import { CheckCircle, Clock, AlertCircle } from "lucide-react";

// Helper to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function LoanHistoryList({ loans = [] }) {
  // Assuming 'data' is the array from your API response
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-trust-DEFAULT mb-4">
        Repayment History
      </h3>

      <div className="space-y-3">
        {loans.map((item) => {
          const loan = item.loans;
          const payment = item.loan_payments;

          // Determine if this specific entry represents a completed payment or just an active loan
          const isPaid = payment !== null;

          // Use payment date if paid, otherwise loan creation date
          const displayDate = isPaid ? payment.createdAt : loan.createdAt;

          // Use payment amount if paid, otherwise loan principal
          const displayAmount = isPaid ? payment.amount : loan.principal;

          return (
            <div
              key={isPaid ? payment.id : loan.id}
              className={`flex justify-between items-center p-3 rounded border transition-colors ${
                isPaid
                  ? "bg-green-50 border-green-100"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* ICON: Green Check if paid, Blue Clock if active/pending */}
                {isPaid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-trust-DEFAULT" />
                )}

                <div>
                  <p
                    className={`font-bold text-sm ${
                      isPaid ? "text-green-700" : "text-gray-700"
                    }`}
                  >
                    {isPaid ? "Repayment Received" : "Loan Disbursed"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {/* Truncate the UUID to make it look cleaner (e.g., #c30e954a) */}
                    ID: #{isPaid ? payment.id.slice(0, 8) : loan.id.slice(0, 8)}{" "}
                    • {formatDate(displayDate)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-bold ${
                    isPaid ? "text-green-600" : "text-primary"
                  }`}
                >
                  {isPaid ? "+" : ""} ${parseFloat(displayAmount).toFixed(2)}
                </span>
                {!isPaid && (
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                    {loan.termMonths} Month Term
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
