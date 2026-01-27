import axios from "axios";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LoanForm = () => {
  const [loanAmount, setLoanAmount] = useState(500);
  const [termMonth, setTermMonth] = useState("");
  const URL = import.meta.env.VITE_API_URL;
  const handleSubmit = async () => {
    // Submit loan request logic here
    try {
      const resp = await axios.post(`${URL}/loans/`, {
        accountId: "a5ae7693-1768-4bd3-8637-b2ea3e720f5b",
        principal: loanAmount,
        termMonths: Number(termMonth),
        interestRate: 0.05,
      });

      console.log(resp.data.data);
    } catch (error) {
      console.log(error);
    }
  };
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

          <Select onValueChange={setTermMonth} value={termMonth}>
            <SelectTrigger className="w-full h-12 text-lg font-bold text-gray-600 border-2 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all">
              <SelectValue placeholder="Select Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Month</SelectItem>
              <SelectItem value="3" className="font-medium cursor-pointer">
                3 Months
              </SelectItem>
              <SelectItem value="6" className="font-medium cursor-pointer">
                6 Months
              </SelectItem>
            </SelectContent>
          </Select>
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

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white font-extrabold text-xl py-4 rounded shadow-lg hover:bg-trust-light transition-colors uppercase"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
};

export default LoanForm;
