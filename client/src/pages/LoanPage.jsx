import React, { useEffect, useState } from "react";
import { CreditCard, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import LoanCard from "../components/loans/LoanCard";
import LoanList from "../components/loans/LoanList";
import LoanForm from "../components/loans/LoanForm";
export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const URL = "http://localhost:8000/api";

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const resp = await axios.get(`${URL}/loans/all`);
        setLoans(resp.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLoans();
  }, []);

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

          <LoanCard />

          {/* Past Payments List */}
          <LoanList loans={loans} />
        </div>

        {/* RIGHT COLUMN: REQUEST NEW LOAN */}
        <LoanForm />
      </div>
    </div>
  );
}
