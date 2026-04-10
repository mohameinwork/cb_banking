import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Eye,
  Loader2,
  Calendar,
  Building2,
  Hash,
  History,
  TrendingUp,
  AlertCircle,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusLabel = (status) => {
  if (!status || status === "UNPAID") return "PENDING";
  return status;
};

const statusConfig = {
  PENDING: {
    color: "bg-amber-50 text-amber-600 border-amber-100",
    icon: <AlertCircle size={14} />,
  },
  PARTIAL: {
    color: "bg-blue-50 text-blue-600 border-blue-100",
    icon: <TrendingUp size={14} />,
  },
  PAID: {
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: <CheckCircle2 size={14} />,
  },
};

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function QuotationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_API_URL;
  const [quotation, setQuotation] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");

  const quotationId = id;

  const remaining = useMemo(() => {
    if (!quotation) return 0;
    return Math.max(
      Number(quotation.total ?? 0) - Number(quotation.paidAmount ?? 0),
      0,
    );
  }, [quotation]);

  const paymentStatus = statusLabel(quotation?.status);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [qRes, pRes] = await Promise.all([
        axios.get(`${URL}/quotations/${quotationId}`),
        axios.get(`${URL}/quotations/${quotationId}/payments`),
      ]);
      setQuotation(qRes.data.data);
      setPayments(pRes.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load quotation details.");
    } finally {
      setLoading(false);
    }
  }, [URL, quotationId]);

  useEffect(() => {
    if (quotationId) fetchData();
  }, [fetchData, quotationId]);

  const handlePayment = async (event) => {
    event.preventDefault();
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0 || amount > remaining) {
      toast.error("Please enter a valid amount.");
      return;
    }

    console.log(amount);

    setPaymentLoading(true);
    try {
      await axios.post(`${URL}/quotations/${quotationId}/pay`, { amount });
      toast.success("Payment successful");
      setPaymentAmount("");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const companyName =
    quotation?.description?.match(/Quotation for ([^–-]+?)\s*-\s*/i)?.[1] ||
    quotation?.title ||
    "Client";

  if (!quotationId) {
    return (
      <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
          <Eye size={32} />
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900">
          No Quotation Selected
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Pick a document from the list to view its financial status.
        </p>
      </div>
    );
  }

  const content = (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. TOP HEADER NAVIGATION */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/quotations")}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-500 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Ref:{quotationId}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border ${statusConfig[paymentStatus].color}`}
              >
                {statusConfig[paymentStatus].icon} {paymentStatus}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {quotation?.title || "Quotation Details"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/quotations/new"
            className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Plus size={16} /> New Quotation
          </Link>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="rounded-2xl border-slate-200 font-bold"
          >
            Print
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-[2.5rem] bg-white border border-slate-100">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* 2. MAIN DOCUMENT SECTION */}
          <div className="lg:col-span-8 space-y-8">
            {/* Meta Info Grid */}
            <section className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Client Company
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {companyName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Issue Date
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {formatDate(quotation?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Summary Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tighter">
                    Total Value
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 font-mono">
                    ${formatCurrency(quotation?.total)}
                  </h3>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-500 mb-1 uppercase tracking-tighter">
                    Amount Paid
                  </p>
                  <h3 className="text-2xl font-black text-emerald-600 font-mono">
                    ${formatCurrency(quotation?.paidAmount)}
                  </h3>
                </div>
                <div>
                  <p className="text-xs font-bold text-rose-500 mb-1 uppercase tracking-tighter">
                    Balance Due
                  </p>
                  <h3 className="text-2xl font-black text-rose-600 font-mono">
                    ${formatCurrency(remaining)}
                  </h3>
                </div>
              </div>
            </section>

            {/* Line Items */}
            <section className="rounded-[2.5rem] bg-white shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Hash size={16} className="text-blue-500" /> Line Items
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 rounded-lg"
                >
                  {quotation?.items?.length} items
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Service Description</th>
                      <th className="px-6 py-4 text-right">Amount (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quotation?.items?.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                          {item.description || `Service ${idx + 1}`}
                        </td>
                        <td className="px-6 py-4 text-right font-black text-slate-800 font-mono">
                          ${formatCurrency(item.total ?? item.amount ?? 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* 3. SIDEBAR: PAYMENTS & HISTORY */}
          <div className="lg:col-span-4 space-y-8">
            {/* Payment Widget */}
            <section className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group">
              <CreditCard
                size={100}
                className="absolute -right-8 -bottom-8 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700"
              />
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                <CreditCard size={18} className="text-blue-400" /> Process
                Payment
              </h3>

              <form
                onSubmit={handlePayment}
                className="space-y-6 relative z-10"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest">
                    Amount to Pay
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-black">
                      $
                    </span>
                    <input
                      type="text"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-8 pr-4 text-xl font-black font-mono outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-white/20"
                    />
                  </div>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">
                    Max Allowed: ${formatCurrency(remaining)}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full py-6 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:bg-slate-800 transition-all active:scale-95"
                >
                  {paymentLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Confirm Payment"
                  )}
                </Button>
              </form>
            </section>

            {/* Payment Audit Trail */}
            <section className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                <History size={18} className="text-blue-500" /> Payment Audit
              </h3>
              <div className="space-y-4">
                {payments.length === 0 ? (
                  <div className="py-8 text-center text-slate-300 italic text-xs">
                    No transactions recorded yet.
                  </div>
                ) : (
                  payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">
                          {formatDate(p.createdAt)}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase">
                          Successful
                        </span>
                      </div>
                      <span className="text-sm font-black text-emerald-600 font-mono">
                        +${formatCurrency(p.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="mx-auto max-w-7xl px-6 pt-8">{content}</div>
    </div>
  );
}
