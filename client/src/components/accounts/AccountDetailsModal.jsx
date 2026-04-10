import {
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Repeat,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const formatCurrency = (value, currency) => {
  const number = Number(value ?? 0);
  const symbol = currency === "USD" ? "$" : currency === "SLSH" ? "Sh" : "";
  return `${symbol}${number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function AccountDetailsModal({
  account,
  open,
  onOpenChange,
  selectedAction,
  onActionSelect,
}) {
  if (!account) {
    return null;
  }

  const accountHolder =
    account.type === "COMPANY"
      ? account.companyName || account.name
      : account.name;
  const statusIsActive = account.status === "ACTIVE";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Account details
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Review account metadata, status, and quick finance actions for this
            wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Account holder
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {accountHolder || "Unknown Holder"}
                </h3>
              </div>
              <Badge
                className={
                  statusIsActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }
              >
                {statusIsActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="grid gap-1">
                <span className="font-medium text-slate-500">
                  Account Number
                </span>
                <span className="rounded-2xl bg-white px-4 py-3 text-slate-800 shadow-sm">
                  {account.accountNumber || "N/A"}
                </span>
              </div>
              <div className="grid gap-1">
                <span className="font-medium text-slate-500">Currency</span>
                <span className="rounded-2xl bg-white px-4 py-3 text-slate-800 shadow-sm">
                  {account.currency || "USD"}
                </span>
              </div>
              <div className="grid gap-1">
                <span className="font-medium text-slate-500">Balance</span>
                <span className="rounded-2xl bg-white px-4 py-3 text-slate-800 shadow-sm">
                  {formatCurrency(account.balance, account.currency)}
                </span>
              </div>
              <div className="grid gap-1">
                <span className="font-medium text-slate-500">Account type</span>
                <span className="rounded-2xl bg-white px-4 py-3 text-slate-800 shadow-sm">
                  {account.type === "COMPANY" ? "Company" : "Person"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-sm font-medium">Quick actions</span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-600">
                {selectedAction || "Ready"}
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              <Button
                variant={selectedAction === "DEPOSIT" ? "secondary" : "outline"}
                className="justify-start"
                onClick={() => onActionSelect("DEPOSIT")}
              >
                <ArrowUpRight className="mr-2 h-4 w-4" /> Deposit
              </Button>
              <Button
                variant={
                  selectedAction === "WITHDRAW" ? "secondary" : "outline"
                }
                className="justify-start"
                onClick={() => onActionSelect("WITHDRAW")}
              >
                <ArrowDownRight className="mr-2 h-4 w-4" /> Withdraw
              </Button>
              <Button
                variant={
                  selectedAction === "TRANSFER" ? "secondary" : "outline"
                }
                className="justify-start"
                onClick={() => onActionSelect("TRANSFER")}
              >
                <Repeat className="mr-2 h-4 w-4" /> Transfer
              </Button>
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <div className="flex items-center gap-2 text-slate-500">
                <CreditCard className="h-4 w-4" />
                <span>
                  This card is a dashboard preview for the selected wallet.
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-slate-500">
                {statusIsActive ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                )}
                <span>
                  {statusIsActive
                    ? "Payments are enabled."
                    : "Account is paused — contact support."}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            Close details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
