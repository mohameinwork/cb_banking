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
const CashFlowChart = () => {
  // --- MOCK DATA ---
  const weeklyData = [
    { name: "Sat", income: 4000, expense: 2400 },
    { name: "Sun", income: 3000, expense: 1398 },
    { name: "Mon", income: 2000, expense: 9800 },
    { name: "Tue", income: 2780, expense: 3908 },
    { name: "Wed", income: 1890, expense: 4800 },
    { name: "Thu", income: 2390, expense: 3800 },
    { name: "Fri", income: 3490, expense: 4300 },
  ];
  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle>Weekly Cash Flow</CardTitle>
        <CardDescription>Income vs. Expenses (Last 7 Days)</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Legend />
            <Bar
              dataKey="income"
              name="Income"
              fill="hsl(var(--secondary))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CashFlowChart;
