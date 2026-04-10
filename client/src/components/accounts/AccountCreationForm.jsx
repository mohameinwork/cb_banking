import { Plus, Wallet } from "lucide-react";
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

export default function AccountCreationForm({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  loading,
}) {
  const isCompany = formData.type === "COMPANY";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New Account
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] rounded-[28px] bg-white p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900">
                Open a new account
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Create a person or company wallet with fast onboarding fields.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="type" className="font-semibold text-slate-700">
                Account type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger
                  id="type"
                  className="h-12 border-slate-300 focus:border-primary focus:ring-primary/20"
                >
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERSON">Person</SelectItem>
                  <SelectItem value="COMPANY">Company</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="currency"
                className="font-semibold text-slate-700"
              >
                Currency
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  setFormData({ ...formData, currency: value })
                }
              >
                <SelectTrigger
                  id="currency"
                  className="h-12 border-slate-300 focus:border-primary focus:ring-primary/20"
                >
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="SLSH">SLSH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name" className="font-semibold text-slate-700">
              {isCompany ? "Company name" : "Full name"}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              placeholder={isCompany ? "Acme Ventures" : "John Doe"}
              className="h-12 border-slate-300 focus:border-primary focus:ring-primary/20"
            />
          </div>

          {isCompany && (
            <div className="grid gap-2">
              <Label
                htmlFor="responsiblePerson"
                className="font-semibold text-slate-700"
              >
                Responsible person
              </Label>
              <Input
                id="responsiblePerson"
                value={formData.responsiblePerson}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    responsiblePerson: event.target.value,
                  })
                }
                placeholder="Jane Smith"
                className="h-12 border-slate-300 focus:border-primary focus:ring-primary/20"
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="phone" className="font-semibold text-slate-700">
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(event) =>
                setFormData({ ...formData, phone: event.target.value })
              }
              placeholder="+252 61 123 4567"
              className="h-12 border-slate-300 focus:border-primary focus:ring-primary/20"
            />
          </div>

          <DialogFooter className="pt-1">
            <Button
              type="submit"
              className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
