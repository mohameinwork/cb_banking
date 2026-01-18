import React, { useState, useMemo } from "react";
import { CreditCard, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function ActiveLoansCard({ loans = [], handleMakePayment }) {
  // 1. DATA PROCESSING: Group API data by Loan ID to calculate real balance
  const processedLoans = useMemo(() => {
    const loanMap = {};

    loans.forEach((item) => {
      // Handle structure: item.loans contains details, item.loan_payments contains payment info
      const loanData = item.loans;
      const paymentData = item.loan_payments;

      if (!loanData) return; // Safety check

      const id = loanData.id;

      // Initialize if we haven't seen this loan yet
      if (!loanMap[id]) {
        loanMap[id] = {
          ...loanData,
          totalPaid: 0, // Track how much has been paid on this loan
        };
      }

      // If this record has a payment, add it to the total
      if (paymentData) {
        loanMap[id].totalPaid += parseFloat(paymentData.amount);
      }
    });

    // Convert map back to array and filter only ACTIVE loans
    return Object.values(loanMap).filter((loan) => loan.status === "ACTIVE");
  }, [loans]);

  // 2. State for Carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigation Handlers
  const nextLoan = () => {
    setCurrentIndex((prev) =>
      prev === processedLoans.length - 1 ? 0 : prev + 1
    );
  };

  const prevLoan = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? processedLoans.length - 1 : prev - 1
    );
  };

  // --- EMPTY STATE (If no active loans) ---
  if (processedLoans.length === 0) {
    return (
      <div className="bg-primary text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
        <div className="bg-white/20 p-4 rounded-full mb-4">
          <CreditCard className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-xl font-bold">No Active Loans</h3>
        <p className="text-white/70 text-sm mt-2">
          You are debt-free! Need funds?
        </p>
        <button className="mt-6 bg-white text-primary font-bold px-6 py-2 rounded shadow hover:bg-gray-100 transition-colors">
          Apply Now
        </button>
      </div>
    );
  }

  // Get Current Loan Data from processed list
  const currentLoan = processedLoans[currentIndex];

  // --- REAL CALCULATIONS ---
  const principal = parseFloat(currentLoan.principal);
  const totalPaid = currentLoan.totalPaid; // Calculated from API payments

  // Ensure we don't show negative balance if overpaid (optional safety)
  const remaining = Math.max(0, principal - totalPaid);

  // Calculate percentage, capping at 100%
  const progressPercent = Math.min(100, (totalPaid / principal) * 100);

  // Calculate Due Date (Created Date + Term Months)
  const dueDate = new Date(currentLoan.createdAt);
  dueDate.setMonth(dueDate.getMonth() + currentLoan.termMonths);
  const formattedDueDate = dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-primary text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Background Decor */}
      <div className="absolute -right-10 -top-10 h-40 w-40 bg-white opacity-10 rounded-full"></div>

      {/* HEADER: Balance & Icon */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-trust-bg font-bold text-sm uppercase opacity-80">
              Remaining Balance
            </p>
            {/* Counter Badge if multiple loans */}
            {processedLoans.length > 1 && (
              <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] font-bold">
                {currentIndex + 1} / {processedLoans.length}
              </span>
            )}
          </div>
          <h3 className="text-5xl font-extrabold mt-2">
            ${remaining.toFixed(2)}
          </h3>
          <p className="text-xs text-white/60 mt-1 font-mono uppercase tracking-widest">
            Loan ID: {currentLoan?.id?.substring(0, 8) || "N/A"}
          </p>
        </div>
        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="space-y-4 relative z-10">
        <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-brand-yellow h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="opacity-80">Paid: ${totalPaid.toFixed(2)}</span>
          <span className="font-bold">Total: ${principal.toFixed(2)}</span>
        </div>
      </div>

      {/* FOOTER: Due Date & Action */}
      <div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-brand-yellow" />
          <div>
            <p className="text-[10px] uppercase opacity-70 leading-none">
              Due Date
            </p>
            <span className="font-bold text-sm">{formattedDueDate}</span>
          </div>
        </div>
        <button
          onClick={() => handleMakePayment(currentLoan.id, remaining)}
          className="bg-white text-primary font-bold px-6 py-2 rounded shadow hover:bg-gray-100 transition-colors"
        >
          Repay Now
        </button>
      </div>

      {/* NAVIGATION CONTROLS (Only if > 1 loan) */}
      {processedLoans.length > 1 && (
        <>
          <button
            onClick={prevLoan}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/10 hover:bg-black/30 rounded-full transition-colors text-white z-20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextLoan}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/10 hover:bg-black/30 rounded-full transition-colors text-white z-20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {processedLoans.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-6 bg-brand-yellow"
                    : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
