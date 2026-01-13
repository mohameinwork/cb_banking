import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Wallet,
  History,
  Landmark,
  LogOut,
  X,
  ChartNoAxesCombined,
  User,
  FileSignature,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: User, label: "Users", href: "/dashboard/users" },
  { icon: Wallet, label: "My Accounts", href: "/dashboard/accounts" },
  {
    icon: ArrowRightLeft,
    label: "Sarif(Exchange)",
    href: "/dashboard/exchange",
  },
  { icon: History, label: "Transactions", href: "/dashboard/transactions" },
  { icon: FileText, label: "Quotations", href: "/dashboard/quotations" },
  { icon: Landmark, label: "Loans", href: "/dashboard/loans" },
  { icon: ChartNoAxesCombined, label: "Reports", href: "/dashboard/reports" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Helper to determine link styling
  const getLinkClasses = (href) => {
    const isActive = location.pathname === href;
    return cn(
      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 font-medium text-sm",
      isActive
        ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 translate-x-1"
        : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary"
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border transition-transform duration-300 md:translate-x-0 md:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-2">
            {/* Simple Logo using Brand Colors */}
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
              C
            </div>
            <span className="font-bold text-lg text-secondary tracking-tight">
              Cabdi Bindhe
            </span>
          </div>
          {/* Close Button (Mobile Only) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between py-6 px-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={getLinkClasses(item.href)}
                onClick={() => window.innerWidth < 768 && onClose()}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-4">
            {/* Admin Quick Action (Optional) */}
            <div className="rounded-xl bg-secondary/5 p-4 border border-secondary/10">
              <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                Need Help?
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Contact the Cabdi Bindhe support team.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs border-secondary text-secondary hover:bg-secondary hover:text-white"
              >
                Contact Support
              </Button>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive gap-3"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
