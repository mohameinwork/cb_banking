import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const formatCurrency = (value, currency) => {
  const number = Number(value ?? 0);
  const symbol = currency === "USD" ? "$" : currency === "SLSH" ? "Sh" : "";
  return `${symbol}${number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function AccountCard({
  account,
  isSelected,
  onSelect,
  onQuickAction,
}) {
  const balance = Number(account?.balance ?? 0);
  const shortAccount = account?.accountNumber
    ? `••••${account.accountNumber.slice(-4)}`
    : "••••0000";
  const isActive = account?.status === "ACTIVE";
  const holderName =
    account?.type === "COMPANY"
      ? account?.companyName || account?.name
      : account?.name;
  const holderLabel = account?.type === "COMPANY" ? "Company" : "Person";

  return (
    <article
      onClick={() => onSelect(account)}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
        isSelected ? "ring-2 ring-primary/30" : ""
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative flex min-h-[240px] flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
            {account?.currency}
          </div>
          <Badge
            variant={isActive ? "secondary" : "outline"}
            className={
              isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="mt-6 space-y-1">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {holderLabel}
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            {holderName || "Account Holder"}
          </h3>
        </div>

        <div className="mt-5">
          <p className="text-xs text-slate-400">Current balance</p>
          <p className="text-3xl font-semibold text-slate-900">
            {formatCurrency(balance, account?.currency)}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span className="font-medium tracking-widest">{shortAccount}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
            {account?.type === "COMPANY" ? "Company" : "Person"}
          </span>
        </div>

        <div className="mt-auto grid gap-2 pt-6">
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              className="text-[11px] font-semibold text-white border border-slate-200 hover:bg-slate-50"
              onClick={(event) => {
                event.stopPropagation();
                onQuickAction("DEPOSIT", account);
              }}
            >
              <ArrowUpRight className="mr-1 h-3.5 w-3.5" /> Deposit
            </Button>
            <Button
              type="button"
              className="text-[11px] font-semibold text-white border border-slate-200 hover:bg-slate-50"
              onClick={(event) => {
                event.stopPropagation();
                onQuickAction("WITHDRAW", account);
              }}
            >
              <ArrowDownRight className="mr-1 h-3.5 w-3.5" /> Withdraw
            </Button>
            <Button
              type="button"
              className="text-[11px] font-semibold text-white border border-slate-200 hover:bg-slate-50"
              onClick={(event) => {
                event.stopPropagation();
                onQuickAction("TRANSFER", account);
              }}
            >
              <Briefcase className="mr-1 h-3.5 w-3.5" /> Transfer
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
