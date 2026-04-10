import React, { useEffect, useState } from "react";
import { Search, Download } from "lucide-react";
import TransactionTable from "../components/Transactions/TransactionTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import axios from "axios";
import PageLoader from "../components/PageLoader";
export default function TransactionsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL}/accounts/all`);
        setAccounts(response.data.accounts);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [URL]);

  useEffect(() => {
    if (!selectedAccountId && Array.isArray(accounts) && accounts.length > 0) {
      setSelectedAccountId(accounts[0]?.id || accounts[0]?.accountId || "");
    }
  }, [accounts, selectedAccountId]);

  const selectedAccount = Array.isArray(accounts)
    ? accounts.find(
        (acc) =>
          acc.id === selectedAccountId || acc.accountId === selectedAccountId,
      )
    : null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary uppercase tracking-widest">
            Transactions
          </h1>
          <p className="text-primary font-medium opacity-80 mt-1">
            History of your deposits, transfers, and exchanges.
          </p>
          {selectedAccount ? (
            <p className="text-sm text-gray-500 mt-2">
              Viewing account:{" "}
              <span className="font-semibold text-gray-800">
                {selectedAccount.accountNumber ||
                  selectedAccount.name ||
                  selectedAccount.id}
              </span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-white text-primary px-4 py-2 rounded shadow font-bold flex items-center gap-2 hover:bg-gray-50">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8 grid gap-4 md:grid-cols-[1.8fr_1fr] items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            type="text"
            placeholder="Search transactions by type, status, or ID..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded outline-none focus:border-primary focus:ring-primary/10 text-gray-700 font-medium"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {Array.isArray(accounts) && accounts.length > 0 ? (
            <div className="flex items-stretch gap-3">
              <div className="text-sm font-semibold text-gray-600">
                Account:
                <Select
                  value={selectedAccountId}
                  onValueChange={setSelectedAccountId}
                  className="ml-3 w-full sm:w-auto"
                >
                  <SelectTrigger className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-primary">
                    <SelectValue placeholder="Choose account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem
                        key={
                          account.id ||
                          account.accountId ||
                          account.accountNumber
                        }
                        value={
                          account.id ||
                          account.accountId ||
                          account.accountNumber
                        }
                      >
                        {account.accountNumber ||
                          account.name ||
                          account.id ||
                          "Account"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              No accounts available. Please create an account or log in.
            </div>
          )}
        </div>
      </div>

      <TransactionTable accountId={selectedAccountId} search={searchQuery} />
    </div>
  );
}
