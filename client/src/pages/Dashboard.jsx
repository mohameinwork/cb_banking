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
  const URL = import.meta.env.VITE_API_URL;

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
    0,
  );
  const formattedLoanAmount = `$${totalLoanAmount.toFixed(2)}`;

  const dueDate = activeLoans.length > 0 ? activeLoans[0].dueDate : "N/A";

  if (loading) return <PageLoader />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* 1. Page Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600 text-lg">
                Welcome back! Here's your financial overview.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* 2. Metrics Row */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Metric 1: USD Balance */}
          <div className="group">
            <BalanceCards
              title="USD Balance"
              type="USD"
              amount={usdAmount}
              icon={DollarSign}
              className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group-hover:scale-105"
            />
          </div>

          {/* Metric 2: SLSH Balance */}
          <div className="group">
            <BalanceCards
              title="SLSH Balance"
              type="SLSH"
              amount={slshAmount}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group-hover:scale-105"
            />
          </div>

          {/* Metric 3: Active Loans */}
          <div className="group">
            <BalanceCards
              title="Active Loans"
              type="Loan"
              amount={formattedLoanAmount}
              dueDate={dueDate}
              icon={CreditCard}
              className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group-hover:scale-105"
            />
          </div>

          {/* Metric 4: Total Profit (Admin/Personal View) */}
          <div className="group">
            <BalanceCards
              title="Total Income"
              type="income"
              amount="$8,750.00"
              icon={TrendingUp}
              className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* 3. Main Chart Section */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
          {/* Left: Cash Flow (Span 4) */}
          <div className="col-span-4">
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300">
              <CashFlowChart />
            </div>
          </div>

          {/* Right: Portfolio (Span 3) */}
          <div className="col-span-3">
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300">
              <PortfolioChart />
            </div>
          </div>
        </div>

        {/* 4. Bottom Section: Trends & Transactions */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
          {/* Left: Exchange Trends (Span 3) */}
          <div className="col-span-3">
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300">
              <ExchangeTrendChart />
            </div>
          </div>

          {/* Right: Recent Transactions Table (Span 4) */}
          <Card className="col-span-4 bg-white shadow-lg shadow-slate-200/50 border-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Recent Transactions
                  </CardTitle>
                  <CardDescription className="text-slate-600 mt-1">
                    Your latest financial movements
                  </CardDescription>
                </div>
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ArrowUpRight className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm">No transactions yet</p>
                  </div>
                ) : (
                  transactions.slice(0, 8).map((tx, index) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50/80 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200/50 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            tx.type === "DEPOSIT"
                              ? "bg-gradient-to-br from-green-500 to-emerald-600"
                              : tx.type === "WITHDRAW"
                                ? "bg-gradient-to-br from-red-500 to-red-600"
                                : tx.type === "EXCHANGE"
                                  ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                  : "bg-gradient-to-br from-slate-500 to-slate-600"
                          }`}
                        >
                          {tx.type.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900 capitalize">
                            {tx.type.toLowerCase().replace("_", " ")}
                          </p>
                          <p className="text-xs text-slate-500">
                            {tx.createdAt
                              ? new Date(tx.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : "--"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div
                            className={`text-sm font-bold ${
                              tx.amount.startsWith("+")
                                ? "text-emerald-600"
                                : tx.amount.includes("~")
                                  ? "text-slate-600"
                                  : "text-slate-900"
                            }`}
                          >
                            {tx.amount}
                          </div>
                          <div className="text-xs text-slate-500 uppercase">
                            {tx.currency}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-200"
                        >
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {transactions.length > 8 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <Button
                    variant="outline"
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    View All Transactions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
