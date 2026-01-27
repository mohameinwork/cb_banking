import { Plus, Wallet } from "lucide-react";
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

export default function AddAccount({
  formData,
  setFormData,
  handleSubmit,
  open,
  setOpen,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 1. The Trigger Button */}
      <DialogTrigger asChild>
        <Button className="bg-primary focus:ring-primary/20 text-white font-bold shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Open New Account
        </Button>
      </DialogTrigger>

      {/* 2. The Modal Content */}
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold text-primary">
              Create New Account
            </DialogTitle>
          </div>
          <DialogDescription>
            Enter the details below to open a new wallet for the user.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          {/* Field: Account Number */}
          <div className="grid gap-2">
            <Label htmlFor="account_number" className="font-bold text-gray-700">
              Account Number
            </Label>
            <Input
              id="account_number"
              name="account_number"
              placeholder="e.g. 100-2938-11"
              className="h-11 border-gray-300 focus:border-primary focus:ring-primary/20"
              value={formData.account_number}
              onChange={(e) => {
                setFormData({ ...formData, account_number: e.target.value });
              }}
            />
          </div>

          {/* Field: Currency (Shadcn Select) */}
          <div className="grid gap-2">
            <Label className="font-bold text-gray-700">Currency</Label>
            <Select
              onValueChange={(e) => setFormData({ ...formData, currency: e })}
              value={formData.currency}
              name="currency"
            >
              <SelectTrigger className="h-11 w-full border-gray-300 focus:border-primary focus:ring-primary/20">
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

          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/80 text-white font-bold h-12 text-lg shadow-md"
            >
              Create Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
