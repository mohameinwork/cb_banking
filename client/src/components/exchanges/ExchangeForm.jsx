import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ExchangeForm = ({
  senderName,
  onTargetAccountSelect,
  selectedTargetAccount,
}) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL}/accounts/all`);
        setAccounts(response.data.accounts);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [URL]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 md:gap-20">
      {/* From Box - Fixed sender */}
      <div className="flex-1 w-full bg-white p-4 flex items-center shadow-sm border-l-4 border-primary rounded-lg">
        <span className="font-bold text-primary w-16 cursor-default text-sm">
          From:
        </span>
        <div className="flex-1">
          <span className="font-medium italic text-gray-800">
            {senderName || "Self"}
          </span>
        </div>
      </div>

      {/* To Box - Selectable receiver */}
      <div className="flex-1 w-full bg-white p-4 flex items-center shadow-sm border-l-4 border-primary rounded-lg">
        <span className="font-bold text-primary w-16 cursor-default text-sm">
          To:
        </span>
        <div className="flex-1">
          <Select
            value={selectedTargetAccount || ""}
            onValueChange={(value) => {
              onTargetAccountSelect?.(value);
            }}
            disabled={loading}
          >
            <SelectTrigger className="w-full border-none bg-transparent shadow-none focus:ring-0">
              <SelectValue
                placeholder={
                  loading ? "Loading accounts..." : "Select target account"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{account.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({account.currency}: ${account.balance})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ExchangeForm;
