import { RefreshCcw } from "lucide-react";
import React from "react";

const ExchangeHistory = ({
  exchangeHistory,
  historyLoading,
  fetchExchangeHistory,
}) => {
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Exchange History</h2>
        <button
          onClick={fetchExchangeHistory}
          disabled={historyLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw
            className={`h-4 w-4 ${historyLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  From
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  To
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Rate
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historyLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <RefreshCcw className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-sm text-gray-500">
                      Loading exchange history...
                    </p>
                  </td>
                </tr>
              ) : exchangeHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No exchange transactions found
                  </td>
                </tr>
              ) : (
                exchangeHistory.map((exchange) => {
                  const meta = exchange.meta || {};
                  return (
                    <tr key={exchange.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(exchange.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {meta.sourceAmount} {meta.sourceCurrency}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {meta.targetAmount} {meta.targetCurrency}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {exchange.amount} {exchange.currency}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {meta.rate}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            exchange.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {exchange.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExchangeHistory;
