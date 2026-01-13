import { AlertCircle } from "lucide-react";
import { useState } from "react";

const LoanForm = () => {
  const [loanAmount, setLoanAmount] = useState(500);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-trust-DEFAULT">
        Request New Loan
      </h2>

      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <div className="mb-6 bg-blue-50 border-l-4 border-primary p-4 flex gap-3">
          <AlertCircle className="h-6 w-6 text-primary shrink-0" />
          <p className="text-sm text-gray-600 font-medium">
            You are eligible for a maximum loan of{" "}
            <span className="font-bold text-primary">$1,000</span> based on your
            transaction history.
          </p>
        </div>

        {/* Amount Slider / Input */}
        <div className="mb-8">
          <label className="block text-primary font-bold text-lg mb-2">
            Loan Amount ($)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full text-3xl font-extrabold text-primary border-b-2 border-gray-200 focus:border-primary outline-none py-2"
            />
          </div>
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full mt-4 accent-primary cursor-pointer"
          />
        </div>

        {/* Duration Selector */}
        <div className="mb-8">
          <label className="block text-primary font-bold text-lg mb-4">
            Repayment Duration
          </label>
          <div className="grid grid-cols-3 gap-4">
            {["1 Month", "3 Months", "6 Months"].map((dur) => (
              <button
                key={dur}
                className="border-2 border-gray-200 text-gray-500 font-bold py-3 rounded-lg hover:border-primary hover:text-primary focus:border-primary focus:text-primary transition-all"
              >
                {dur}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-8">
          <div className="flex justify-between text-sm font-bold text-gray-500">
            <span>Principal</span>
            <span>${loanAmount}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-500">
            <span>Service Fee (5%)</span>
            <span>${(loanAmount * 0.05).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-extrabold text-primary">
            <span>Total Repayment</span>
            <span>${(loanAmount * 1.05).toFixed(2)}</span>
          </div>
        </div>

        <button className="w-full bg-primary text-white font-extrabold text-xl py-4 rounded shadow-lg hover:bg-trust-light transition-colors uppercase">
          Submit Request
        </button>
      </div>
    </div>
  );
};

export default LoanForm;
