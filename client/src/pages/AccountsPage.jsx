import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowUpRight, ArrowDownRight, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AccountCard from "../components/accounts/AccountCard";
import AccountCreationForm from "../components/accounts/AccountCreationForm";
import AccountDetailsModal from "../components/accounts/AccountDetailsModal";
import PageLoader from "../components/PageLoader";

const filterOptions = [
  { value: "ALL", label: "All" },
  { value: "POSITIVE", label: "Positive" },
  { value: "NEGATIVE", label: "Negative" },
];

const formatNumber = (value) => {
  const number = Number(value ?? 0);
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export default function MyAccountsPage() {
  const [accountsPayload, setAccountsPayload] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedAction, setSelectedAction] = useState("Ready");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [formData, setFormData] = useState({
    type: "PERSON",
    currency: "USD",
    name: "",
    phone: "",
    responsiblePerson: "",
  });
  const URL = import.meta.env.VITE_API_URL;

  const accountList = useMemo(() => {
    if (Array.isArray(accountsPayload)) {
      return accountsPayload;
    }

    if (Array.isArray(accountsPayload?.accounts)) {
      return accountsPayload.accounts;
    }

    return [];
  }, [accountsPayload]);

  const filteredAccounts = useMemo(() => {
    if (!accountList.length) return [];

    return accountList.filter((account) => {
      const balance = Number(account?.balance ?? 0);
      if (activeFilter === "POSITIVE") return balance >= 0;
      if (activeFilter === "NEGATIVE") return balance < 0;
      return true;
    });
  }, [accountList, activeFilter]);

  const summary = useMemo(
    () => ({
      total: accountList.length,
      positive: accountList.filter(
        (account) => Number(account?.balance ?? 0) >= 0,
      ).length,
      negative: accountList.filter(
        (account) => Number(account?.balance ?? 0) < 0,
      ).length,
    }),
    [accountList],
  );

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${URL}/accounts/all`);
      setAccountsPayload(response.data ?? []);
    } catch (error) {
      console.error("Failed to load accounts", error);
      toast.error("Unable to load account data.");
    } finally {
      setLoading(false);
    }
  }, [URL]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    if (!selectedAccount && filteredAccounts.length) {
      setSelectedAccount(filteredAccounts[0]);
    }
  }, [filteredAccounts, selectedAccount]);

  const handleAccountCreated = async (event) => {
    event.preventDefault();
    setCreating(true);

    try {
      await axios.post(`${URL}/accounts`, {
        currency: formData.currency,
        type: formData.type,
        name: formData.name,
        phone: formData.phone,
        responsiblePerson: formData.responsiblePerson,
      });
      toast.success("Account created successfully.");
      setCreateOpen(false);
      setFormData({
        type: "PERSON",
        currency: "USD",
        name: "",
        phone: "",
        responsiblePerson: "",
      });
      fetchAccounts();
    } catch (error) {
      console.error("Failed to create account", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setSelectedAction("Ready");
    setDetailsOpen(true);
  };

  const handleActionSelect = (actionType, account) => {
    setSelectedAccount(account);
    setSelectedAction(actionType);
    setDetailsOpen(true);
  };

  if (loading && !accountList.length) {
    return <PageLoader />;
  }

  return (
    <div className="flex min-h-screen flex-col gap-8 pb-10">
      <div className="flex flex-col gap-5 rounded-[32px] border border-primary/60 bg-slate-50/80 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Accounts dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Financial wallets & account management
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Track your person and company wallets with polished cards,
              real-time status, and fast actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchAccounts}
              className="inline-flex items-center gap-2 rounded-2xl border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100"
            >
              <RefreshCcw className="h-4 w-4" /> Refresh
            </Button>
            <AccountCreationForm
              open={createOpen}
              onOpenChange={setCreateOpen}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAccountCreated}
              loading={creating}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-primary">Total accounts</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">
              {formatNumber(summary.total)}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-primary">Positive balance</p>
            <p className="mt-4 text-3xl font-semibold text-primary">
              {formatNumber(summary.positive)}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-primary">Negative balance</p>
            <p className="mt-4 text-3xl font-semibold text-primary">
              {formatNumber(summary.negative)}
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-[32px] border border-primary/60 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-primary">Accounts</h2>
            <p className="mt-2 text-sm text-slate-500">
              Filter the dashboard by deposit and withdrawal account states.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveFilter(option.value)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === option.value
                    ? "bg-primary text-white shadow-lg shadow-primary/10"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6">
        {filteredAccounts.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.id ?? account.accountNumber}
                account={account}
                isSelected={selectedAccount?.id === account.id}
                onSelect={handleSelectAccount}
                onQuickAction={(action) => handleActionSelect(action, account)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-primary/60 bg-slate-50 p-10 text-center text-primary/60 shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 mb-6">
              <ArrowUpRight className="h-6 w-6 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold text-primary">
              No accounts match this filter.
            </h3>
            <p className="mt-3 text-sm text-slate-500">
              Create a new person or company account to start managing wallets
              here.
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => setCreateOpen(true)}
                className="rounded-2xl bg-primary px-5 py-3 text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
              >
                Create account
              </Button>
              s
            </div>
          </div>
        )}
      </section>

      <AccountDetailsModal
        account={selectedAccount}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        selectedAction={selectedAction}
        onActionSelect={(action) => setSelectedAction(action)}
      />
    </div>
  );
}
