import React from "react";
import { Loader2 } from "lucide-react";

export default function Spinner({ size = "md", color = "text-trust-DEFAULT" }) {
  // Size mapping
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div className="flex justify-center items-center">
      <Loader2 className={`animate-spin ${sizes[size]} ${color}`} />
    </div>
  );
}
