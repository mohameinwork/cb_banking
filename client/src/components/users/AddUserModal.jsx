import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddUserModal({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  open,
  setOpen,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white px-6 py-3 rounded shadow font-bold hover:bg-trust-light transition-colors">
          Add New User
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Fill in the form below to add a new user to the system.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ FORM GOES HERE */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="mohamed123..."
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-3">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-3">
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              placeholder="******"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            {/* ✅ MUST BE submit */}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding User..." : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
