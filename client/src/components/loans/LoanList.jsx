import { CheckCircle } from "lucide-react";

const LoanList = ({ loans }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-trust-DEFAULT mb-4">
        Repayment History
      </h3>
      <div className="space-y-3">
        {loans.map((i) => (
          <div
            key={i}
            className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-bold text-gray-700 text-sm">
                  Installment #{i}
                </p>
                <p className="text-xs text-gray-500">Nov {i * 10}, 2025</p>
              </div>
            </div>
            <span className="font-bold text-primary">$125.00</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanList;
