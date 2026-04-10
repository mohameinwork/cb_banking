import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// export const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
//     return (
//       <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200">
//         <p className="font-semibold text-slate-900 mb-2">{label}</p>
//         <div className="space-y-1">
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
//             <span className="text-sm text-slate-600">Income: </span>
//             <span className="font-semibold text-green-600">
//               ${data.income.toLocaleString()}
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full"></div>
//             <span className="text-sm text-slate-600">Expense: </span>
//             <span className="font-semibold text-red-600">
//               ${data.expense.toLocaleString()}
//             </span>
//           </div>
//           <div className="h-px bg-slate-200 my-2"></div>
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-slate-600">Net: </span>
//             <span
//               className={`font-semibold ${data.net >= 0 ? "text-green-600" : "text-red-600"}`}
//             >
//               ${data.net.toLocaleString()}
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   return null;
// };

const CashFlowChart = () => {
  // --- MOCK DATA ---
  const weeklyData = [
    { name: "Sat", income: 4000, expense: 2400, net: 1600 },
    { name: "Sun", income: 3000, expense: 1398, net: 1602 },
    { name: "Mon", income: 2000, expense: 9800, net: -7800 },
    { name: "Tue", income: 2780, expense: 3908, net: -1128 },
    { name: "Wed", income: 1890, expense: 4800, net: -2910 },
    { name: "Thu", income: 2390, expense: 3800, net: -1410 },
    { name: "Fri", income: 3490, expense: 4300, net: -810 },
  ];

  // Calculate totals
  const totalIncome = weeklyData.reduce((sum, day) => sum + day.income, 0);
  const totalExpense = weeklyData.reduce((sum, day) => sum + day.expense, 0);
  const netFlow = totalIncome - totalExpense;
  const avgDailyNet = netFlow / 7;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900 mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Income: </span>
              <span className="font-semibold text-green-600">
                ${data.income.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Expense: </span>
              <span className="font-semibold text-red-600">
                ${data.expense.toLocaleString()}
              </span>
            </div>
            <div className="h-px bg-slate-200 my-2"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Net: </span>
              <span
                className={`font-semibold ${data.net >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                ${data.net.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white shadow-lg shadow-slate-200/50 border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100/50 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-slate-600" />
              Weekly Cash Flow
            </CardTitle>
            <CardDescription className="text-slate-600 mt-1">
              Income vs. Expenses (Last 7 Days)
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div
                className={`text-sm font-bold flex items-center gap-1 ${netFlow >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {netFlow >= 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                ${Math.abs(netFlow).toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">Net Flow</div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/60 rounded-lg p-3 border border-slate-200/50">
            <div className="text-sm text-slate-600 mb-1">Total Income</div>
            <div className="text-lg font-bold text-green-600">
              ${totalIncome.toLocaleString()}
            </div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 border border-slate-200/50">
            <div className="text-sm text-slate-600 mb-1">Total Expenses</div>
            <div className="text-lg font-bold text-red-600">
              ${totalExpense.toLocaleString()}
            </div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 border border-slate-200/50">
            <div
              className={`text-sm mb-1 ${avgDailyNet >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              Avg. Daily Net
            </div>
            <div
              className={`text-lg font-bold flex items-center gap-1 ${avgDailyNet >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {avgDailyNet >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              ${Math.abs(avgDailyNet).toFixed(0)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="relative">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={weeklyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b" }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: "#64748b" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
              <Bar
                dataKey="income"
                name="Income"
                fill="url(#incomeGradient)"
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="url(#expenseGradient)"
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
                animationBegin={200}
              />
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0.3} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>

          {/* Overlay trend line */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-slate-200/50">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                <span className="text-slate-600">Trend</span>
                <span className="font-semibold text-slate-900">
                  {avgDailyNet >= 0 ? "+" : ""}${avgDailyNet.toFixed(0)}/day
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowChart;
