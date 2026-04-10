import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Eye,
  Edit3,
  Plus,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  Search,
  FileText,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const filterOptions = [
  { value: "ALL", label: "All Quotations" },
  { value: "PENDING", label: "Pending" },
  { value: "PARTIAL", label: "Partial" },
  { value: "PAID", label: "Paid" },
];

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-100",
  PARTIAL: "bg-blue-50 text-blue-700 border-blue-100",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

const statusLabel = (status) => {
  if (!status) return "PENDING";
  if (status === "UNPAID") return "PENDING";
  return status;
};

const extractCompany = (description) => {
  if (!description) return "Unknown";
  const match = description.match(/Quotation for ([^–-]+?)\s*-\s*/i);
  return match?.[1]?.trim() || description;
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

const StatCard = ({ label, value, icon, color }) => (
  <div className={`rounded-2xl p-6 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      </div>
      <div className="text-slate-400">{icon}</div>
    </div>
  </div>
);

export default function QuotationListPage() {
  const [quotations, setQuotations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchQuotations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${URL}/quotations`);
      setQuotations(response.data.data || []);
    } catch (err) {
      setError("Could not load quotations.");
    } finally {
      setLoading(false);
    }
  }, [URL]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const filteredQuotations = useMemo(() => {
    return quotations.filter((q) => {
      const matchesStatus =
        statusFilter === "ALL" || statusLabel(q.status) === statusFilter;
      const matchesSearch =
        extractCompany(q.description)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (q.title || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [quotations, statusFilter, searchQuery]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quotation?")) return;
    try {
      await axios.delete(`${URL}/quotations/${id}`);
      toast.success("Quotation deleted");
      fetchQuotations();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
              <FileText className="h-4 w-4" />
              <span>Management</span>
            </div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Quotations
            </h1>
            <p className="text-slate-500">
              Overview of your billing and estimates.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchQuotations}
              className="hidden h-11 items-center gap-2 rounded-xl border-slate-200 bg-white px-4 text-slate-600 hover:bg-slate-50 md:flex"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Link to="/dashboard/quotations/new">
              <Button className="h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700">
                <Plus className="h-5 w-5" />
                New Quotation
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Balance"
            value={quotations.length}
            icon={<FileText className="text-indigo-600" />}
            color="bg-indigo-50"
          />
          <StatCard
            label="Pending Invoices"
            value={
              quotations.filter((q) => statusLabel(q.status) === "PENDING")
                .length
            }
            icon={<Clock className="text-amber-600" />}
            color="bg-amber-50"
          />
          <StatCard
            label="Paid to Date"
            value={
              quotations.filter((q) => statusLabel(q.status) === "PAID").length
            }
            icon={<CheckCircle className="text-emerald-600" />}
            color="bg-emerald-50"
          />
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {filterOptions.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    statusFilter === filter.value
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search company or title..."
                className="h-10 rounded-xl border-slate-200 pl-10 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Client / Project</th>
                  <th className="px-6 py-4">Financial Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-20 text-center text-slate-400"
                    >
                      Loading data...
                    </td>
                  </tr>
                ) : (
                  filteredQuotations.map((q) => (
                    <QuotationRow
                      key={q.id}
                      quotation={q}
                      onDelete={handleDelete}
                      onNavigate={navigate}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuotationRow({ quotation, onDelete, onNavigate }) {
  const label = statusLabel(quotation.status);
  const amount = Number(quotation.total ?? 0);
  const paid = Number(quotation.paidAmount ?? 0);
  const remaining = Math.max(amount - paid, 0);
  const progress = (paid / amount) * 100;

  return (
    <tr className="group transition-colors hover:bg-slate-50/50">
      <td className="px-6 py-4">
        <div className="font-semibold text-slate-900">
          {extractCompany(quotation.description)}
        </div>
        <div className="text-xs text-slate-500">
          {quotation.title || "Standard Quotation"}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1.5">
          <div className="text-sm font-medium text-slate-900">
            ${formatCurrency(amount)}
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full transition-all ${label === "PAID" ? "bg-emerald-500" : "bg-indigo-500"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              {remaining > 0 ? `$${formatCurrency(remaining)} left` : "Settled"}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[label]}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {label}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">
        {formatDate(quotation.createdAt)}
      </td>
      <td className="px-6 py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-lg p-0 hover:bg-slate-100"
            >
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 rounded-xl shadow-xl border-slate-200"
          >
            <DropdownMenuItem
              className="py-2"
              onClick={() =>
                onNavigate(`/dashboard/quotations/${quotation.id}`)
              }
            >
              <Eye className="mr-2 h-4 w-4 text-slate-400" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-2"
              onClick={() =>
                onNavigate(`/dashboard/quotations/new?source=${quotation.id}`)
              }
            >
              <Edit3 className="mr-2 h-4 w-4 text-slate-400" /> Duplicate/Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="py-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50"
              onClick={() => onDelete(quotation.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
