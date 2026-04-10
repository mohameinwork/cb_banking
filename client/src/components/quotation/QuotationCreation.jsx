import React, { useCallback, useEffect, useState } from "react";
import {
  Printer,
  Save,
  Plus,
  Trash2,
  Box,
  Building2,
  Hash,
  Calculator,
  FileText,
  Globe,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const RATE = 11500;

export default function QuotationCreation() {
  const [searchParams] = useSearchParams();
  const sourceQuotationId = searchParams.get("source");
  const [items, setItems] = useState([{ id: 1, desc: "", dollar: 0 }]);
  const [companyAccounts, setCompanyAccounts] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(false);

  const [form, setForm] = useState({
    quotationId: "",
    company: "",
    companyAccountId: "",
    container: "",
  });

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: field === "dollar" ? Number(value) : value }
          : item,
      ),
    );
  };

  const addRow = () => {
    setItems((prev) => [...prev, { id: Date.now(), desc: "", dollar: 0 }]);
  };

  const removeRow = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalUSD = items.reduce((sum, i) => sum + i.dollar, 0);
  const totalSLSH = totalUSD * RATE;
  const URL = import.meta.env.VITE_API_URL;

  const loadSourceQuotation = useCallback(async () => {
    if (!sourceQuotationId) return;

    try {
      const response = await axios.get(
        `${URL}/quotations/${sourceQuotationId}`,
      );
      const source = response.data.data;
      const companyMatch =
        source.description?.match(/Quotation for ([^–-]+?)\s*-\s*/i)?.[1] || "";
      const containerMatch =
        source.description?.match(/Container:\s*(.*)/i)?.[1] || "";

      setForm({
        quotationId: source.title || "",
        company: companyMatch,
        companyAccountId: source.companyAccountId || "",
        container: containerMatch,
      });
      setItems(
        Array.isArray(source.items) && source.items.length > 0
          ? source.items.map((item, index) => ({
              id: Date.now() + index,
              desc: item.description || "",
              dollar: Number(item.total || 0),
            }))
          : [{ id: 1, desc: "", dollar: 0 }],
      );
      toast.success("Quotation data loaded for cloning.");
    } catch (error) {
      console.error("Error loading source quotation:", error);
      toast.error("Unable to prefill quotation from source.");
    }
  }, [URL, sourceQuotationId]);

  useEffect(() => {
    if (!sourceQuotationId) return;
    const fetchSource = async () => {
      await loadSourceQuotation();
    };

    fetchSource();
  }, [loadSourceQuotation, sourceQuotationId]);

  useEffect(() => {
    const fetchCompanyAccounts = async () => {
      setCompanyLoading(true);
      try {
        const response = await axios.get(`${URL}/accounts/all`);
        const allAccounts = response.data.accounts ?? [];
        const companies = allAccounts.filter(
          (account) => account.type === "COMPANY",
        );
        setCompanyAccounts(companies);
      } catch (error) {
        console.error("Failed to fetch company accounts:", error);
      } finally {
        setCompanyLoading(false);
      }
    };

    fetchCompanyAccounts();
  }, [URL]);

  const saveRecord = async () => {
    try {
      if (!form.companyAccountId) {
        toast.error("Please select a company before saving the quotation.");
        return;
      }

      const payload = {
        companyAccountId: form.companyAccountId,
        title: form.quotationId || "Untitled Quotation",
        description: `Quotation for ${form.company} - Container: ${form.container}`,
        total: totalUSD,
        items: items.map((item) => ({
          description: item.desc,
          total: item.dollar,
        })),
      };

      const quotationResp = await axios.post(`${URL}/quotations`, payload);
      console.log("Quotation saved successfully:", quotationResp.data);
      toast.success("Quotation saved successfully!");
      setForm({
        quotationId: "",
        company: "",
        container: "",
      });
      setItems([{ id: 1, desc: "", dollar: 0 }]);
    } catch (error) {
      console.error("Error saving quotation:", error);
      toast.error("Failed to save quotation. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                Create Quotation
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                CB Money Ex - Currency Exchange Services
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all">
              <Printer size={18} /> Print
            </button>
            <button
              onClick={saveRecord}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-blue-100 active:scale-95"
            >
              <Save size={18} /> Save Quotation
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-primary uppercase italic tracking-tighter">
                CB Money Ex
              </h1>
              <p className="text-xs font-medium text-slate-400 max-w-[200px]">
                Your trusted partner for global currency exchange and financial
                solutions.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 text-white min-w-[240px] relative overflow-hidden group">
              <Globe
                size={80}
                className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform duration-700"
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <Calculator size={14} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Current Exchange Rate
                  </span>
                </div>
                <p className="text-xl font-black font-mono">
                  1 USD = <span className="text-primary">11,500</span>{" "}
                  <span className="text-sm font-normal text-slate-300 ml-1 uppercase">
                    Slsh
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-50/50">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Quotation Reference
              </label>
              <div className="relative">
                <Hash
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  placeholder="e.g. Q-2024-001"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none font-bold text-slate-700 shadow-sm"
                  value={form.quotationId}
                  onChange={(e) =>
                    setForm({ ...form, quotationId: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Company / Client
              </label>
              <div className="relative">
                <Building2
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Select
                  value={form.companyAccountId}
                  onValueChange={(value) => {
                    const selected = companyAccounts.find(
                      (account) => account.id === value,
                    );
                    setForm({
                      ...form,
                      companyAccountId: value,
                      company: selected?.name || form.company,
                    });
                  }}
                >
                  <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3 text-slate-700 outline-none font-bold shadow-sm transition-all focus:ring-2 focus:ring-primary focus:ring-opacity-20">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyLoading ? (
                      <SelectItem
                        value="loading"
                        disabled
                        className="text-slate-500"
                      >
                        Loading companies...
                      </SelectItem>
                    ) : companyAccounts.length > 0 ? (
                      companyAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name || account.accountNumber || account.id}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem
                        value="none"
                        disabled
                        className="text-slate-500"
                      >
                        No company accounts found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Container Number
              </label>
              <div className="relative">
                <Box
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  placeholder="MSKU-1234567"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none font-bold text-slate-700 shadow-sm"
                  value={form.container}
                  onChange={(e) =>
                    setForm({ ...form, container: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-4 py-2 text-left w-12">#</th>
                    <th className="px-4 py-2 text-left">
                      Description of Goods/Services
                    </th>
                    <th className="px-4 py-2 text-right w-40">Unit USD</th>
                    <th className="px-4 py-2 text-right w-40">Total SLSH</th>
                    <th className="px-4 py-2 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="group transition-all">
                      <td className="px-4 py-2 text-sm font-bold text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20 border px-4 py-2.5 rounded-xl outline-none font-medium text-slate-700 transition-all"
                          placeholder="Enter item description..."
                          value={item.desc}
                          onChange={(e) =>
                            handleItemChange(item.id, "desc", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                            $
                          </span>
                          <input
                            type="number"
                            className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20 border pl-7 pr-4 py-2.5 rounded-xl outline-none font-black text-slate-700 text-right transition-all"
                            placeholder="0.00"
                            value={item.dollar}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "dollar",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className="text-sm font-mono font-bold text-slate-400 tracking-tighter">
                          SLSH{totalSLSH}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => removeRow(item.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={addRow}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-primary rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition-all"
            >
              <Plus size={16} /> Add New Line
            </button>
          </div>

          <div className="p-8 md:p-12 bg-slate-50/50 border-t border-slate-100">
            <div className="flex flex-col items-end">
              <div className="w-full md:w-80 space-y-3">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Subtotal USD
                  </span>
                  <span className="font-mono font-bold text-lg">
                    ${totalUSD}
                  </span>
                </div>
                <div className="h-[1px] bg-slate-200 w-full"></div>
                <div className="flex flex-col items-end gap-1 pt-2">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    Total Amount Payable
                  </span>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                    ${totalUSD} USD
                  </h2>
                  <p className="text-sm font-mono font-bold text-slate-400">
                    {totalSLSH.toLocaleString()} SLSH
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 px-8 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <p>Generated by CB money exchange.</p>
          <p>Valid for 7 Days from Issue Date</p>
        </div>
      </div>
    </div>
  );
}
