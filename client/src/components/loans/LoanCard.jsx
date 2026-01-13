import { Calendar, CreditCard } from "lucide-react";
import React from "react";

const LoanCard = () => {
  return (
    <div className="bg-primary text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -right-10 -top-10 h-40 w-40 bg-white opacity-10 rounded-full"></div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-trust-bg font-bold text-sm uppercase opacity-80">
            Remaining Balance
          </p>
          <h3 className="text-5xl font-extrabold mt-2">$250.00</h3>
        </div>
        <div className="bg-white/20 p-2 rounded-lg">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="w-full bg-trust-light/30 rounded-full h-3">
          <div
            className="bg-brand-yellow h-3 rounded-full"
            style={{ width: "50%" }}
          ></div>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span>Paid: $250</span>
          <span>Total: $500</span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-brand-yellow" />
          <span className="font-bold text-sm">Next Payment: Dec 25</span>
        </div>
        <button className="bg-white text-primary font-bold px-6 py-2 rounded shadow hover:bg-gray-100 transition-colors">
          Repay Now
        </button>
      </div>
    </div>
  );
};

export default LoanCard;
