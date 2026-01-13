import { Download, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";

const AccountHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-secondary tracking-tight">
          My Accounts
        </h1>
        <p className="text-muted-foreground">
          Manage your Personal and Company wallets.
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="border-secondary text-secondary hover:bg-secondary hover:text-white"
        >
          <Download className="mr-2 h-4 w-4" /> Statements
        </Button>
        <Button className="bg-primary hover:bg-accent text-white font-bold shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Open New Account
        </Button>
      </div>
    </div>
  );
};

export default AccountHeader;
