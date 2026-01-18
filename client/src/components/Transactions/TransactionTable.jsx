import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowDownLeft, ArrowUpRight, RefreshCcw } from "lucide-react";
import PageLoader from "../PageLoader";
const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const URL = "http://localhost:8000/api";
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${URL}/transactions/all`);
        setTransactions(resp?.data.data);
        setLoading(false);
      } catch (error) {
        console.log("Failed to load transactions", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <PageLoader />;
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary text-white uppercase text-sm tracking-wider">
              <th className="p-5 font-bold">Transaction ID</th>
              <th className="p-5 font-bold">Description</th>
              <th className="p-5 font-bold">Date</th>
              <th className="p-5 font-bold">Status</th>
              <th className="p-5 font-bold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <td className="p-5 font-bold text-trust-light">
                  #{tx.id.slice(0, 8)}
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    {/* Icon Logic */}
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center 
                        ${
                          tx.type === "DEPOSIT"
                            ? "bg-green-100 text-green-600"
                            : tx.type === "TRANSFER"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                    >
                      {tx.type === "TRANSFER" ? (
                        <RefreshCcw className="h-4 w-4" />
                      ) : tx.type === "DEPOSIT" ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <span className="font-bold text-gray-700">{tx.desc}</span>
                  </div>
                </td>
                <td className="p-5 font-medium text-gray-500 text-sm">
                  {tx.createdAt
                    ? new Date(tx.createdAt).toLocaleString()
                    : "--"}
                </td>
                <td className="p-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase
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
                <td
                  className={`p-5 text-right font-extrabold text-lg
                    ${
                      tx.amount.includes("+")
                        ? "text-green-600"
                        : "text-primary"
                    }`}
                >
                  {tx.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Mockup */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm font-bold text-gray-500">
          Showing 1-5 of 128
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-bold text-gray-600 hover:bg-gray-100">
            Prev
          </button>
          <button className="px-3 py-1 bg-primary text-white rounded text-sm font-bold hover:bg-trust-light">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
