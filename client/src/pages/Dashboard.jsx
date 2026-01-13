import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";
import CashFlowChart from "@/components/CashFlowChart";
import PortfolioChart from "@/components/PortfolioChart";
import ExchangeTrendChart from "@/components/ExchangeTrendChart";
const Dashboard = () => {
  const recentTransactions = [
    {
      id: 1,
      name: "Ahmed Yasin",
      type: "Sent",
      amount: "-$120.00",
      date: "Today, 10:23 AM",
      avatar: "AY",
    },
    {
      id: 2,
      name: "Dahabshiil Remittance",
      type: "Received",
      amount: "+$4,500.00",
      date: "Yesterday, 4:00 PM",
      avatar: "DR",
    },
    {
      id: 3,
      name: "Sarif Exchange",
      type: "Exchange",
      amount: "~ 2.5M SLSH",
      date: "Nov 24, 2025",
      avatar: "EX",
    },
  ];
  return (
    <>
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, Mohamein. Here's your financial overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary hover:text-white"
          >
            <ArrowDownLeft className="mr-2 h-4 w-4" /> Request
          </Button>
          <Button className="bg-primary hover:bg-accent text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <ArrowUpRight className="mr-2 h-4 w-4" /> Send Money
          </Button>
        </div>
      </div>

      {/* 2. Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Metric 1: USD Balance */}
        <Card className="border-t-4 border-t-secondary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              USD Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$1,234.56</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium">+2.5%</span> from
              last month
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: SLSH Balance */}
        <Card className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              SLSH Balance
            </CardTitle>
            <span className="text-sm font-bold text-primary">Sh</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3,500,000</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available to Exchange
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Active Loans */}
        <Card className="border-t-4 border-t-destructive shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Loan
            </CardTitle>
            <CreditCard className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$500.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              Due: Dec 01, 2025
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Total Profit (Admin/Personal View) */}
        <Card className="border-t-4 border-t-accent shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$450.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              From Sarif & Transfers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Main Chart Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-8">
        {/* Left: Cash Flow (Span 4) */}
        <div className="col-span-4">
          <CashFlowChart />
        </div>

        {/* Right: Portfolio (Span 3) */}
        <div className="col-span-3">
          <PortfolioChart />
        </div>
      </div>

      {/* 4. Bottom Section: Trends & Transactions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Left: Exchange Trends (Span 3) */}
        <div className="col-span-3">
          <ExchangeTrendChart />
        </div>

        {/* Right: Recent Transactions Table (Span 4) */}
        <Card className="col-span-4 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial movements.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9 bg-secondary/10">
                      <AvatarFallback className="text-secondary font-bold text-xs">
                        {tx.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {tx.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-sm font-bold ${
                        tx.amount.startsWith("+")
                          ? "text-emerald-500"
                          : tx.amount.includes("~")
                          ? "text-accent-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {tx.amount}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
