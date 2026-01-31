import React, { useState, useMemo } from "react";
import { CreditCard, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function ActiveLoansCard({ loans = [], handleMakePayment }) {
  /**
   * 1️⃣ PROCESS NORMALIZED EVENTS INTO ACTIVE LOANS
   */
  const processedLoans = useMemo(() => {
    const loanMap = {};

    // 1️⃣ FIRST PASS — collect loans
    loans.forEach((event) => {
      if (event.type === "LOAN") {
        loanMap[event.id] = {
          ...event,
          totalPaid: 0,
        };
      }
    });

    // 2️⃣ SECOND PASS — attach payments
    loans.forEach((event) => {
      if (event.type === "PAYMENT") {
        const loan = loanMap[event.loanId];
        if (loan) {
          loan.totalPaid += Number(event.amount);
        }
      }
    });

    // 3️⃣ Filter ACTIVE loans
    return Object.values(loanMap).filter((loan) => loan.status === "ACTIVE");
  }, [loans]);

  /**
   * 2️⃣ CAROUSEL STATE
   */
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextLoan = () => {
    setCurrentIndex((prev) =>
      prev === processedLoans.length - 1 ? 0 : prev + 1,
    );
  };

  const prevLoan = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? processedLoans.length - 1 : prev - 1,
    );
  };

  /**
   * 3️⃣ EMPTY STATE
   */
  if (processedLoans.length === 0) {
    return (
      <div className="bg-primary text-white rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
        <div className="bg-white/20 p-4 rounded-full mb-4">
          <CreditCard className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-xl font-bold">No Active Loans</h3>
        <p className="text-white/70 text-sm mt-2">
          You are debt-free! Need funds?
        </p>
        <button className="mt-6 bg-white text-primary font-bold px-6 py-2 rounded shadow">
          Apply Now
        </button>
      </div>
    );
  }

  /**
   * 4️⃣ CURRENT LOAN CALCULATIONS
   */
  const currentLoan = processedLoans[currentIndex];

  const principal = Number(currentLoan.amount);
  const totalPaid = currentLoan.totalPaid;

  const remaining = Math.max(0, principal - totalPaid);
  const progressPercent = Math.min(100, (totalPaid / principal) * 100);

  const dueDate = new Date(currentLoan.createdAt);
  dueDate.setMonth(dueDate.getMonth() + currentLoan.termMonths);

  /**
   * 5️⃣ RENDER
   */
  return (
    <div className="bg-primary text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold uppercase opacity-80">
              Remaining Balance
            </p>
            {processedLoans.length > 1 && (
              <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] font-bold">
                {currentIndex + 1} / {processedLoans.length}
              </span>
            )}
          </div>
          <h3 className="text-5xl font-extrabold mt-2">
            ${remaining.toFixed(2)}
          </h3>
          <p className="text-xs opacity-60 font-mono mt-1">
            Loan ID: {currentLoan.id.slice(0, 8)}
          </p>
        </div>
        <div className="bg-white/20 p-2 rounded-lg">
          <CreditCard className="h-8 w-8" />
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <div className="w-full bg-black/20 rounded-full h-3">
          <div
            className="bg-brand-yellow h-3 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span>Paid: ${totalPaid.toFixed(2)}</span>
          <span className="font-bold">Total: ${principal.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-brand-yellow" />
          <div>
            <p className="text-[10px] uppercase opacity-70">Due Date</p>
            <span className="font-bold text-sm">
              {dueDate.toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          onClick={() => handleMakePayment(currentLoan.id, remaining)}
          className="bg-white text-primary font-bold px-6 py-2 rounded shadow"
        >
          Repay Now
        </button>
      </div>

      {/* Navigation */}
      {processedLoans.length > 1 && (
        <>
          <button
            onClick={prevLoan}
            className="absolute left-2 top-1/2 -translate-y-1/2"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={nextLoan}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <ChevronRight />
          </button>
        </>
      )}
    </div>
  );
}
