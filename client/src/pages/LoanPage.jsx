import React, { useEffect, useState } from "react";
import axios from "axios";
import LoanList from "../components/loans/LoanList";
import LoanForm from "../components/loans/LoanForm";
import PageLoader from "../components/PageLoader";
import ActiveLoansCard from "../components/loans/LoanCard";
export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${URL}/loans/all`);
        setLoans(resp.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const handleMakePayment = async (loanId, amount) => {
    setLoading(true);
    try {
      await axios.post(`${URL}/loans/make-payment`, {
        loanId,
        amount,
      });
      setLoading(false);
      // Refresh loans data after payment
      const updatedLoans = await axios.get(`${URL}/loans/all`);
      setLoans(updatedLoans.data.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  console.log(loans);
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-primary uppercase tracking-widest mb-8">
        Loan Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN: ACTIVE LOAN STATUS */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-primary">Active Loan</h2>

          <ActiveLoansCard
            handleMakePayment={handleMakePayment}
            loans={loans}
          />

          {/* Past Payments List */}
          <LoanList loans={loans} />
        </div>

        {/* RIGHT COLUMN: REQUEST NEW LOAN */}
        <LoanForm />
      </div>
    </div>
  );
}
