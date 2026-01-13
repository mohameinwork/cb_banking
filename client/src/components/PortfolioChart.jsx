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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const PortfolioChart = () => {
  const portfolioData = [
    { name: "USD", value: 55, color: "hsl(var(--secondary))" }, // Teal
    { name: "SLSH", value: 35, color: "hsl(var(--primary))" }, // Orange
    { name: "Loan", value: 10, color: "hsl(var(--destructive))" }, // Red
  ];
  return (
    <Card className="shadow-sm border-border/50 flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>USD vs SLSH Holdings</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-foreground">55%</span>
            <span className="text-xs text-muted-foreground uppercase">USD</span>
          </div>
        </div>
      </CardContent>
      <div className="p-6 pt-0 text-center text-sm text-muted-foreground">
        Total Net Worth:{" "}
        <span className="font-bold text-foreground">$1,234.00</span>
      </div>
    </Card>
  );
};

export default PortfolioChart;
