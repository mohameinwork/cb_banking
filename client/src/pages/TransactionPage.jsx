import React, { useState } from "react";
import {
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCcw,
} from "lucide-react";
import TransactionTable from "../components/Transactions/TransactionTable";

export default function TransactionsPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="max-w-6xl mx-auto">
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary uppercase tracking-widest">
            Transactions
          </h1>
          <p className="text-primary font-medium opacity-80 mt-1">
            History of your deposits, transfers, and exchanges.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-primary px-4 py-2 rounded shadow font-bold flex items-center gap-2 hover:bg-gray-50">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* 2. FILTER BAR (White Card Style) */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or Name..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded outline-none focus:border-trust-light text-trust-DEFAULT font-medium"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded font-bold text-trust-DEFAULT outline-none cursor-pointer"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Deposit">Deposits</option>
            <option value="Transfer">Transfers</option>
            <option value="Exchange">Exchanges</option>
          </select>
          <select className="px-4 py-3 bg-gray-50 border border-gray-200 rounded font-bold text-trust-DEFAULT outline-none cursor-pointer">
            <option>All Currencies</option>
            <option>USD ($)</option>
            <option>SLSH (Sh)</option>
          </select>
        </div>
      </div>

      {/* 3. TRANSACTION TABLE */}
      <TransactionTable />
    </div>
  );
}
