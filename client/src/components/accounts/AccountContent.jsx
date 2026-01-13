import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowDownLeft,
  Briefcase,
  Copy,
  Download,
  MoreHorizontal,
  Plus,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import PageLoader from "../PageLoader";

const AccountContent = ({ transactions, accounts }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    if (accounts?.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts, selectedAccount]);

  if (!selectedAccount) return <PageLoader />;

  console.log(accounts, selectedAccount);
  return (
    <>
      <TabsContent value="personal" className="space-y-6">
        {/* CARDS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts?.map((acc) => (
            <div
              key={acc.id}
              onClick={() => setSelectedAccount(acc)}
              className={`cursor-pointer transition-transform hover:scale-[1.02] ${
                selectedAccount?.id === acc.id
                  ? "ring-4 ring-offset-2 ring-primary/50 rounded-xl"
                  : ""
              }`}
            >
              {/* VIRTUAL CARD COMPONENT */}
              <div
                className={`relative h-56 w-full rounded-xl overflow-hidden shadow-xl p-6 flex flex-col justify-between text-white
                    ${
                      acc.currency === "USD"
                        ? "bg-gradient-to-br from-secondary to-somali-blue"
                        : "bg-gradient-to-br from-primary to-accent"
                    }`}
              >
                {/* Background Pattern Overlay */}
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                {/* Top Row: Chip & Logo */}
                <div className="flex justify-between items-start">
                  <div className="h-10 w-12 bg-yellow-200/40 rounded-md border border-white/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="h-6 w-8 border border-black/20 rounded-[2px] relative grid grid-cols-2 gap-1 p-1">
                      <div className="border border-black/10 rounded-[1px]"></div>
                      <div className="border border-black/10 rounded-[1px]"></div>
                      <div className="border border-black/10 rounded-[1px]"></div>
                      <div className="border border-black/10 rounded-[1px]"></div>
                    </div>
                  </div>
                  <span className="font-bold text-lg italic tracking-wider opacity-90">
                    {acc.currency}
                  </span>
                </div>

                {/* Middle: Balance */}
                <div className="z-10">
                  <p className="text-xs uppercase opacity-75 mb-1">
                    Available Balance
                  </p>
                  <h3 className="text-3xl font-mono font-bold tracking-tight">
                    {acc.currency === "USD" ? "$" : "Sh"} {acc.balance}
                  </h3>
                </div>

                {/* Bottom: Number & Status */}
                <div className="flex justify-between items-end z-10">
                  <div className="font-mono text-lg tracking-widest opacity-90">
                    {acc.accountNumber}
                  </div>
                  {acc.status === "ACTIVE" ? (
                    <ShieldCheck className="h-6 w-6 text-emerald-300" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-200" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card Placeholder */}
          <div className="h-56 w-full rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/10 cursor-pointer transition-colors">
            <Plus className="h-10 w-10 mb-2 opacity-50" />
            <span className="font-medium">Add Another Account</span>
          </div>
        </div>

        {/* SELECTED ACCOUNT DETAILS & LEDGER */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column: Account Actions */}
          <Card className="lg:col-span-1 h-fit shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Account Actions</CardTitle>
              <CardDescription>
                Manage {selectedAccount?.currency} ****{" "}
                {selectedAccount?.accountNumber}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white">
                <ArrowDownLeft className="mr-2 h-4 w-4" /> Deposit Funds
              </Button>

              <Button className="w-full justify-start bg-primary hover:bg-accent text-white">
                <Send className="mr-2 h-4 w-4" /> Transfer Money
              </Button>
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center text-sm py-2">
                  <span className="text-muted-foreground">Account Status</span>
                  <Badge
                    variant="outline"
                    className="text-emerald-600 border-emerald-200 bg-emerald-50"
                  >
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm py-2">
                  <span className="text-muted-foreground">Interest Rate</span>
                  <span className="font-medium">0.0% (Islamic)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Transaction History */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Transaction History</CardTitle>
                <CardDescription>
                  Recent activity for this account
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions?.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        {tx.createdAt
                          ? new Date(tx.createdAt).toLocaleString()
                          : "--"}
                      </TableCell>
                      <TableCell>
                        {/* <div className="flex flex-col">
                          <span className="font-medium">{tx.desc}</span>
                          <span className="text-xs text-muted-foreground">
                            {tx.id}
                          </span>
                        </div> */}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`font-normal ${
                            tx.type === "DEPOSIT"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                              : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                          }`}
                        >
                          {tx.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${
                          tx.type === "DEPOSIT"
                            ? "text-emerald-600"
                            : "text-foreground"
                        }`}
                      >
                        {tx.amount}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" /> Copy Ref
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" /> Receipt
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Report Issue
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="company">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-muted/20 rounded-xl border border-dashed border-border">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-secondary">
            Company Account Setup
          </h2>
          <p className="text-muted-foreground max-w-md mt-2 mb-6">
            To activate your Company wallet, we need to verify your business
            quotation documents as per compliance regulations.
          </p>
          <div className="flex gap-4">
            <Button variant="outline">View Requirements</Button>
            <Button className="bg-primary hover:bg-accent text-white">
              Upload Quotation
            </Button>
          </div>
        </div>
      </TabsContent>
    </>
  );
};

export default AccountContent;
