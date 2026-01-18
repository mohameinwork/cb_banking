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
import BalanceCards from "../components/BalanceCards";
import { useEffect, useState } from "react";
import axios from "axios";
import PageLoader from "../components/PageLoader";
const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const URL = "http://localhost:8000/api";

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const resp = await axios.get(`${URL}/accounts/all`);
        setAccounts(resp.data.accounts);
      } catch (error) {
        console.log("Failed to load accounts", error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const resp = await axios.get(`${URL}/transactions/all`);
        setTransactions(resp?.data.data);
      } catch (error) {
        console.log("Failed to load transactions", error);
      }
    };

    const fetchLoans = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${URL}/loans/all`);
        setLoans(resp.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchAccounts();
    fetchTransactions();
    fetchLoans();
  }, []);

  const usdType = accounts.find((acc) => acc.currency === "USD");
  const slshType = accounts.find((acc) => acc.currency === "SLSH");
  const amount = usdType ? usdType.balance : "0.00";
  const slshAmount = slshType ? slshType.balance : "0";
  const usdAmount = `$${parseFloat(amount).toFixed(2)}`;

  const activeLoans = loans.filter((loan) => loan.status === "ACTIVE");
  const totalLoanAmount = activeLoans.reduce(
    (total, loan) => total + parseFloat(loan.amount),
    0
  );
  const formattedLoanAmount = `$${totalLoanAmount.toFixed(2)}`;

  const dueDate = activeLoans.length > 0 ? activeLoans[0].dueDate : "N/A";

  if (loading) return <PageLoader />;
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
        <BalanceCards
          title="USD Balance"
          type="USD"
          amount={usdAmount}
          icon={DollarSign}
        />

        {/* Metric 2: SLSH Balance */}
        <BalanceCards title="SLSH Balance" type="SLSH" amount={slshAmount} />

        {/* Metric 3: Active Loans */}
        <BalanceCards
          title="Active Loans"
          type="Loan"
          amount={formattedLoanAmount}
          dueDate={dueDate}
          icon={CreditCard}
        />

        {/* Metric 4: Total Profit (Admin/Personal View) */}
        <BalanceCards
          title="Total Income"
          type="income"
          amount="$8,750.00"
          icon={TrendingUp}
        />
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
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9 bg-secondary/10">
                      <AvatarFallback className="text-secondary font-bold text-xs">
                        {tx.type.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {tx.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.createdAt
                          ? new Date(tx.createdAt).toLocaleString()
                          : "--"}
                      </p>
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
