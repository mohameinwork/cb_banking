import { useState } from "react";
import { ArrowDownLeft, Banknote } from "lucide-react";

// Shadcn UI Imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
export default function DepositDialog({ accounts = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountId: "",
    currency: "",
    amount: "",
  });
  const URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsOpen(true);
    try {
      const resp = await axios.post(`${URL}/accounts/deposit`, {
        id: formData.accountId,
        currency: formData.currency,
        amount: formData.amount,
      });
      console.log("Deposit successful:", resp.data);
      setLoading(false);
      setIsOpen(false);
      toast.success("Deposit successful!");
      setFormData({
        accountId: "",
        currency: "",
        amount: "",
      });
    } catch (error) {
      console.log("Deposit failed:", error);
      toast.error("Deposit failed. Please try again.");
      setLoading(false);
      setIsOpen(false);
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* 1. Trigger Button */}
      <DialogTrigger asChild>
        <Button className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white">
          <ArrowDownLeft className="mr-2 h-4 w-4" /> Deposit Funds
        </Button>
      </DialogTrigger>

      {/* 2. Modal Content */}
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <Banknote className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-primary">
              Deposit Funds
            </DialogTitle>
          </div>
          <DialogDescription>
            Add funds to a specific user account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          {/* Field: Account ID (Select) */}
          <div className="grid gap-2">
            <Label htmlFor="id" className="font-bold text-gray-700">
              Target Account
            </Label>
            <Select
              onValueChange={(val) =>
                setFormData({ ...formData, accountId: val })
              }
              name="id"
            >
              {/* Added w-full here */}
              <SelectTrigger className="w-full h-11 border-gray-300 focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                {/* Mocking accounts if none provided */}
                {accounts.length > 0 ? (
                  accounts.map((acc) => (
                    <SelectItem
                      key={acc.id}
                      value={acc.id}
                      className="cursor-pointer"
                    >
                      {acc.accountNumber} ({acc.currency})
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="acc_usd_001">
                      100-2938-11 (USD)
                    </SelectItem>
                    <SelectItem value="acc_slsh_002">
                      400-9921-22 (SLSH)
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Field: Currency */}
          <div className="grid gap-2">
            <Label htmlFor="currency" className="font-bold text-gray-700">
              Currency
            </Label>
            <Select
              onValueChange={(val) =>
                setFormData({ ...formData, currency: val })
              }
              name="currency"
            >
              {/* Added w-full here */}
              <SelectTrigger className="w-full h-11 border-gray-300 focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD" className="font-medium cursor-pointer">
                  🇺🇸 USD (Dollar)
                </SelectItem>
                <SelectItem value="SLSH" className="font-medium cursor-pointer">
                  🇸🇴 SLSH (Shilling)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field: Amount */}
          <div className="grid gap-2">
            <Label htmlFor="amount" className="font-bold text-gray-700">
              Deposit Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                {formData.currency === "SLSH" ? "Sh" : "$"}
              </span>
              <Input
                id="amount"
                type="number"
                name="amount"
                placeholder="0.00"
                className="pl-8 h-11 border-gray-300 focus:border-primary focus:ring-primary/20 font-bold text-gray-800 w-full"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-trust-light text-white font-bold h-12 text-lg shadow-md"
            >
              {loading ? "Processing..." : "Submit Deposit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
