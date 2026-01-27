import { useEffect, useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import AccountTypes from "../components/accounts/AccountTypes";
import AccountHeader from "../components/accounts/AccountHeader";
import AccountContent from "../components/accounts/AccountContent";
import axios from "axios";
import AccountSuccessModal from "../components/accounts/AccountSuccessModal";
import { toast } from "sonner";
import { useAuth } from "../context/useAuth";
export default function MyAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  // get user_id from local storage
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    userId: user?.user.id || "",
    currency: "",
    account_number: "",
  });
  const URL = import.meta.env.VITE_API_URL;
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
  }, [URL]);

  const handleAccountCreated = async (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setOpen(true);

    // Refresh accounts list after a new account is created
    try {
      const newAcc = await axios.post(`${URL}/accounts`, {
        userId: formData.userId,
        currency: formData.currency,
        account_number: formData.account_number,
      });
      console.log("New Account Created:", newAcc.data);
      toast.success("Account created successfully!");
      setOpen(false);
    } catch (error) {
      console.log("Failed to load accounts", error);
      setShowSuccess(false);
      toast.error("Failed to create account. Please try again.");
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Section */}
      <AccountHeader
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleAccountCreated}
        open={open}
        setOpen={setOpen}
      />
      {/* 2. Account Type Tabs (Personal vs Company) */}
      <Tabs defaultValue="personal" className="w-full">
        <AccountTypes />
        <AccountContent accounts={accounts} transactions={transactions} />
      </Tabs>

      <AccountSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Account Created"
        message="The new wallet has been successfully added to the user's profile."
      />
    </div>
  );
}
