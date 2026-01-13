import React from "react";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* The Animated Ring */}
        <div className="relative h-16 w-16">
          {/* Background Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          {/* Spinning Ring (Trust Blue) */}
          <div className="absolute inset-0 rounded-full border-4 border-trust-DEFAULT border-t-transparent animate-spin"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-trust-DEFAULT tracking-wider animate-pulse">
            CABDI BINDHE
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Processing secure data...
          </p>
        </div>
      </div>
    </div>
  );
}
