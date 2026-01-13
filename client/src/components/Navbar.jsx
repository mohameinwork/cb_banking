import React from "react";
import { Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "./UserAvatar";
import { useAuth } from "../context/useAuth";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-secondary"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Search Bar (Hidden on small mobile) */}
        <div className="hidden md:flex items-center relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="pl-9 h-10 bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all rounded-full"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-secondary"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
        </Button>

        {/* Separator */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* Profile Dropdown */}
        <UserAvatar user={user} />
      </div>
    </header>
  );
};

export default Navbar;
