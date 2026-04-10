import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ArrowDownLeft, ArrowUpRight, RefreshCcw } from "lucide-react";
import PageLoader from "../PageLoader";

const TransactionTable = ({ accountId, search = "" }) => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL | IN | OUT
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const URL = import.meta.env.VITE_API_URL;

  const fetchTransactions = useCallback(async () => {
    if (!accountId) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await axios.get(`${URL}/transactions/all`, {
        params: {
          accountId,
        },
      });

      setTransactions(resp.data.data ?? []);
    } catch (fetchError) {
      console.error("Failed to load transactions", fetchError);
      setError("Unable to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [URL, accountId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "IN") return tx.direction === "IN";
    if (filter === "OUT") return tx.direction === "OUT";
    return true;
  });

  const searchLower = search.trim().toLowerCase();
  const visibleTransactions = filteredTransactions.filter((tx) => {
    if (!searchLower) return true;
    return [
      tx.id,
      tx.type,
      tx.status,
      tx.currency,
      tx.direction,
      tx.fromAccountId,
      tx.toAccountId,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(searchLower));
  });

  if (!accountId) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-dashed border-gray-200 p-10 text-center text-gray-600">
        <p className="text-lg font-semibold text-gray-800">
          No account selected
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Pick an account above to load your transactions from the API.
        </p>
      </div>
    );
  }

  if (loading) return <PageLoader />;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="flex flex-col gap-4 p-4 border-b bg-gray-50 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {["ALL", "IN", "OUT"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/40
                ${
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
            >
              {f === "ALL" ? "All" : f === "IN" ? "Received" : "Sent"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchTransactions}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left border-collapse">
          <thead>
            <tr className="bg-primary text-white uppercase text-xs tracking-wider">
              <th className="p-4">Transaction</th>
              <th className="p-4">Direction</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Reference</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {visibleTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-sm text-gray-500"
                >
                  {error
                    ? error
                    : "No transactions found for the selected account."}
                </td>
              </tr>
            ) : (
              visibleTransactions.map((tx) => {
                const isIncome = tx.direction === "IN";
                const displayAmount =
                  tx.signedAmount ??
                  `${isIncome ? "+" : "-"}${Number(tx.amount).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}`;

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-blue-50 transition cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center
                            ${
                              isIncome
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                        >
                          {isIncome ? (
                            <ArrowDownLeft className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {tx.type}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tx.currency || "--"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-700">
                      {tx.direction === "IN" ? "Credit" : "Debit"}
                    </td>
                    <td
                      className={`p-4 font-extrabold text-right text-lg ${isIncome ? "text-green-600" : "text-red-600"}`}
                    >
                      {displayAmount}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold
                          ${
                            tx.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : tx.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleString()
                        : "--"}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {tx.toAccountId === accountId
                        ? `Received from ${tx.fromAccountId?.slice(0, 8)}`
                        : `Sent to ${tx.toAccountId?.slice(0, 8)}`}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 border-t flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <p className="text-sm text-gray-600">
            Showing {visibleTransactions.length} transaction
            {visibleTransactions.length === 1 ? "" : "s"}
          </p>
          <p className="text-xs text-gray-400">
            Filtered by{" "}
            {filter.toLowerCase() === "all"
              ? "all directions"
              : filter.toLowerCase() === "in"
                ? "credits"
                : "debits"}
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
