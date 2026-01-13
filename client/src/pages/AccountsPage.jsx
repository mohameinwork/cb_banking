import { useEffect, useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import AccountTypes from "../components/accounts/AccountTypes";
import AccountHeader from "../components/accounts/AccountHeader";
import AccountContent from "../components/accounts/AccountContent";
import axios from "axios";
export default function MyAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const URL = "http://localhost:8000/api";

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const resp = await axios.get(`${URL}/accounts/all`);
        setAccounts(resp.data.accounts);
      } catch (error) {
        console.log("Failed to load accounts", error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const resp = await axios.get(`${URL}/transactions/all`);
        setTransactions(resp?.data.data);
      } catch (error) {
        console.log("Failed to load transactions", error);
      }
    };
    fetchAccounts();
    fetchTransactions();
  }, []);
  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Section */}
      <AccountHeader />
      {/* 2. Account Type Tabs (Personal vs Company) */}
      <Tabs defaultValue="personal" className="w-full">
        <AccountTypes />
        <AccountContent accounts={accounts} transactions={transactions} />
      </Tabs>
    </div>
  );
}
