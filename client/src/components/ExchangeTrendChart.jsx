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
const ExchangeTrendChart = () => {
  const sarifData = [
    { time: "09:00", volume: 105000 },
    { time: "10:00", volume: 320000 },
    { time: "11:00", volume: 150000 },
    { time: "12:00", volume: 450000 },
    { time: "13:00", volume: 200000 },
    { time: "14:00", volume: 600000 },
    { time: "15:00", volume: 300000 },
  ];
  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sarif Volume</CardTitle>
            <CardDescription>Today's Exchange Activity</CardDescription>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">26,000</span>
            <p className="text-xs text-muted-foreground">
              Current Rate (USD/SLSH)
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sarifData}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVolume)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExchangeTrendChart;
