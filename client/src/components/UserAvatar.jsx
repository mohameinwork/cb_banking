import { ChevronDown, LogOut, User, Settings, CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({ user }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-auto px-2 hover:bg-secondary/10 rounded-full md:rounded-md"
        >
          <div className="flex items-center gap-3">
            {/* Avatar with Teal Brand Ring */}
            <Avatar className="h-9 w-9 border-2 border-secondary/20 ring-2 ring-secondary transition-transform active:scale-95">
              <AvatarImage
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=60"
                alt="Profile"
                className="object-cover"
              />
              <AvatarFallback className="bg-secondary text-white">
                MA
              </AvatarFallback>
            </Avatar>

            {/* User Info (Hidden on mobile) */}
            <div className="hidden text-left md:block">
              <p className="text-sm capitalize font-semibold text-secondary">
                {user?.user.name}
              </p>
              <p className="text-xs uppercase text-muted-foreground">
                {user?.user.role}
              </p>
            </div>

            <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* Header with User Details */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium capitalize leading-none">
              {user.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4 text-secondary" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4 text-secondary" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout Button Section */}
        <div className="p-2">
          <Button
            className="w-full bg-primary font-bold text-white shadow-md hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
            size="sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
