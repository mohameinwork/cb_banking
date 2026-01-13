import React from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Mon", income: 4000, expenses: 2400 },
  { name: "Tue", income: 3000, expenses: 1398 },
  { name: "Wed", income: 2000, expenses: 9800 },
  { name: "Thu", income: 2780, expenses: 3908 },
  { name: "Fri", income: 1890, expenses: 4800 },
  { name: "Sat", income: 2390, expenses: 3800 },
  { name: "Sun", income: 3490, expenses: 4300 },
];

export default function ReportPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-primary uppercase tracking-widest">
            Financial Reports
          </h1>
          <p className="text-primary font-medium opacity-80 mt-1">
            Profit/Loss analysis and operational metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white text-primary px-4 py-2 rounded shadow font-bold flex items-center gap-2 hover:bg-gray-50">
            <Calendar className="h-4 w-4" /> This Week
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded shadow font-bold flex items-center gap-2 hover:bg-trust-light">
            <Download className="h-4 w-4" /> PDF Report
          </button>
        </div>
      </div>

      {/* 2. P&L CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
          <p className="text-gray-500 font-bold uppercase text-xs">
            Total Income
          </p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <h2 className="text-3xl font-extrabold text-trust-DEFAULT">
              $12,450
            </h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500">
          <p className="text-gray-500 font-bold uppercase text-xs">
            Total Expenses
          </p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingDown className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl font-extrabold text-trust-DEFAULT">
              $4,200
            </h2>
          </div>
        </div>

        <div className="bg-primary p-6 rounded-xl shadow-lg border-t-4 border-brand-yellow text-white">
          <p className="text-accent font-bold uppercase text-xs">Net Profit</p>
          <div className="flex items-center gap-2 mt-2">
            <DollarSign className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-extrabold text-white">+$8,250</h2>
          </div>
        </div>
      </div>

      {/* 3. MAIN CHART */}
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
        <h3 className="text-xl font-bold text-trust-DEFAULT mb-6 uppercase">
          Income vs Expense Trend
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorIncome)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#EF4444"
                fillOpacity={1}
                fill="url(#colorExpense)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
