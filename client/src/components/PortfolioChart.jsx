import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const PortfolioChart = () => {
  const portfolioData = [
    { name: "USD", value: 55, color: "hsl(var(--secondary))" },
    { name: "SLSH", value: 35, color: "hsl(var(--primary))" },
    { name: "Loan", value: 10, color: "hsl(var(--destructive))" },
  ];

  const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0);
  const primaryAsset = portfolioData[0];

  return (
    <Card className="bg-white shadow-xl shadow-slate-200/60 border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 border-b border-slate-200/70 pb-4">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-semibold text-slate-900">
            Asset Allocation
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Breakdown of your holdings by currency and loan exposure.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <div className="relative h-[240px] w-full p-2 ">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  border: "1px solid rgba(148, 163, 184, 0.15)",
                  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-slate-900">
              {primaryAsset.value}%
            </span>
            <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
              {primaryAsset.name} Dominance
            </span>
          </div>
        </div>

        <div className="space-y-4 px-1">
          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Total Portfolio Value
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              $1,234.00
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Across currency accounts and loan positions.
            </p>
          </div>

          <div className="grid gap-3">
            {portfolioData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.value}% allocation
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {((item.value / totalValue) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioChart;
