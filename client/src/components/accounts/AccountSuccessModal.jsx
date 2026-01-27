import React from "react";
import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AccountSuccessModal({
  isOpen,
  onClose,
  title,
  message,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center p-6 bg-white rounded-2xl">
        {/* Animated Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4 animate-in zoom-in-50 duration-300">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-primary text-center">
            {title || "Success!"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 font-medium text-base">
            {message || "Your transaction has been processed successfully."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          <Button
            onClick={onClose}
            className="w-full sm:w-1/2 bg-primary hover:bg-trust-light text-white font-bold h-12 text-lg shadow-lg"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
