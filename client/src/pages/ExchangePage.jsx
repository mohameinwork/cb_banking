import React, { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import ExchangeForm from "../components/exchanges/ExchangeForm";
import ExchangeSwitch from "../components/exchanges/ExchangeSwitch";
import ResultExchange from "../components/exchanges/ResultExchange";
import { useAuth } from "../context/useAuth";
import axios from "axios";
import SuccessModal from "../components/SuccessModal";
import { toast } from "sonner";
import ExchangeHistory from "../components/exchanges/ExchangeHistory";

export default function ExchangePage() {
  const { user } = useAuth();
  // --- STATES ---
  const [direction, setDirection] = useState("USD_TO_SLSH"); // "USD_TO_SLSH" or "SLSH_TO_USD"
  const [senderName, setSenderName] = useState("");
  const [selectedTargetAccount, setSelectedTargetAccount] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [exchangeHistory, setExchangeHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  useEffect(() => {
    if (user?.user?.name) setSenderName(user.user.name.toUpperCase());
  }, [user]);

  // const accounts = user?.user.accountsTable ?? [];

  // const usdAccount = accounts.find((acc) => acc.currency === "USD");
  // const slshAccount = accounts.find((acc) => acc.currency === "SLSH");

  // if (!usdAccount || !slshAccount) {
  //   throw new Error("Required account missing");
  // }

  // Input values
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(10800);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateLastUpdated, setRateLastUpdated] = useState(null);
  const [result, setResult] = useState("0");
  const [calculatedResult, setCalculatedResult] = useState(0);

  // --- LOGIC ---

  // 1. Switch Handler
  const toggleDirection = () => {
    setDirection((prev) =>
      prev === "USD_TO_SLSH" ? "SLSH_TO_USD" : "USD_TO_SLSH",
    );
    setAmount(""); // Clear input to avoid confusion
    setResult("0");
  };

  // 2. Calculation Effect
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    const numRate = parseFloat(rate) || 1;

    let calc = 0;
    if (direction === "USD_TO_SLSH") {
      calc = numAmount * numRate;
      setResult(calc.toLocaleString("en-US", { maximumFractionDigits: 0 }));
    } else {
      calc = numAmount / numRate;
      // Show decimals for USD result
      setResult(calc.toLocaleString("en-US", { maximumFractionDigits: 2 }));
    }

    setCalculatedResult(calc);
  }, [amount, rate, direction]);

  const URL = import.meta.env.VITE_API_URL;
  // Labels based on direction
  const inputLabel =
    direction === "USD_TO_SLSH" ? "Dollar ($)" : "Shilling (Sh)";
  const outputLabel =
    direction === "USD_TO_SLSH" ? "Shilling (Sh)" : "Dollar ($)";
  const inputSymbol = direction === "USD_TO_SLSH" ? "$" : "Sh";
  const outputSymbol = direction === "USD_TO_SLSH" ? "SLSH" : "USD";

  // Fetch current exchange rate
  const fetchRate = async () => {
    setRateLoading(true);
    try {
      // Always fetch USD to SLSH rate, as the calculation handles the direction
      const response = await axios.get(
        `${URL}/exchange/rate?base=USD&quote=SLSH`,
      );
      setRate(response.data.rate);
      setRateLastUpdated(new Date(response.data.lastUpdated));
      toast.success("Exchange rate updated");
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error);
      toast.error("Failed to fetch current exchange rate");
    } finally {
      setRateLoading(false);
    }
  };

  // Fetch exchange history
  const fetchExchangeHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await axios.get(`${URL}/exchange/all`);
      setExchangeHistory(response.data.data);
    } catch (error) {
      console.error("Failed to fetch exchange history:", error);
      toast.error("Failed to fetch exchange history");
    } finally {
      setHistoryLoading(false);
    }
  };

  // Fetch rate on component mount
  useEffect(() => {
    fetchRate();
    fetchExchangeHistory();
  }, []);

  console.log("AccountId", selectedTargetAccount);
  const handleSubmit = async () => {
    const amt = parseFloat(amount) || 0;
    const resAmt = calculatedResult;
    const rt = Number(rate);

    // Validation
    if (!selectedTargetAccount) return alert("Please select a target account");
    if (!amt || amt <= 0)
      return alert("Source amount must be greater than zero");
    if (!resAmt || resAmt <= 0)
      return alert("Target amount must be greater than zero");
    if (!rt || rt <= 0) return alert("Invalid rate");

    // Simplified payload matching the API controller
    const payload = {
      targetAccountId: selectedTargetAccount,
      targetAmount: resAmt, // The amount being credited to target account
      rate: rt,
    };

    setIsSuccessOpen(false);
    console.log("Submitting exchange with payload:", payload);

    try {
      await axios.post(`${URL}/exchange/convert`, payload);
      // Reset form
      setAmount("");
      setResult("0");
      setCalculatedResult(0);
      setSelectedTargetAccount("");
      setIsSuccessOpen(true);
      // Refresh history
      fetchExchangeHistory();
      toast.success("Exchange completed successfully!");
    } catch (error) {
      console.error("Exchange failed:", error);
      toast.error(error?.response?.data?.message || "Exchange failed!");
    } finally {
      setIsSuccessOpen(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-6 pb-12">
      {/* 1. TITLE (Kept at top) */}
      <div className="relative mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-3">
          <RefreshCcw className="h-6 w-6" />
          SARIF / EXCHANGE
        </h2>
        <div className="flex items-center justify-center gap-4 mt-2">
          <p className="text-gray-500 text-sm">
            Current Direction:{" "}
            <span className="font-bold text-primary">
              {direction === "USD_TO_SLSH" ? "USD ➔ SLSH" : "SLSH ➔ USD"}
            </span>
          </p>
          <button
            onClick={fetchRate}
            disabled={rateLoading}
            className="flex items-center gap-2 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh exchange rate"
          >
            <RefreshCcw
              className={`h-4 w-4 ${rateLoading ? "animate-spin" : ""}`}
            />
            {rateLoading ? "Updating..." : "Refresh Rate"}
          </button>
        </div>
        {rateLastUpdated && (
          <p className="text-xs text-gray-400 mt-1">
            Rate last updated: {rateLastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* 2. FROM / TO NAMES (Kept at top) */}
      <ExchangeForm
        senderName={senderName}
        onTargetAccountSelect={setSelectedTargetAccount}
        selectedTargetAccount={selectedTargetAccount}
      />

      {/* 3. INPUTS ROW & SWITCH BUTTON (Kept at top, logic updated) */}
      <ExchangeSwitch
        amount={amount}
        inputSymbol={inputSymbol}
        outputLabel={outputLabel}
        inputLabel={inputLabel}
        rate={rate}
        rateLoading={rateLoading}
        setAmount={setAmount}
        result={result}
        toggleDirection={toggleDirection}
      />

      {/* 4. SPLIT COLUMNS: Action vs Data State */}
      <ResultExchange
        handleSubmit={handleSubmit}
        direction={direction}
        outputSymbol={outputSymbol}
        result={result}
        rate={rate}
        rateLoading={rateLoading}
      />

      {/* 3. Render the Success Modal at the bottom of the component */}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Exchange Successful!"
        message="The currency exchange has been recorded in the ledger."
        details={{
          "Exchange Direction":
            direction === "USD_TO_SLSH" ? "USD → SLSH" : "SLSH → USD",
          "Exchange Rate": `1 USD = ${rate} SLSH`,
          "Amount Received": `${result} ${direction === "USD_TO_SLSH" ? "SLSH" : "USD"}`,
          "Amount Sent": `${amount} ${direction === "USD_TO_SLSH" ? "USD" : "SLSH"}`,
        }}
      />

      {/* Exchange History Table */}
      <ExchangeHistory
        exchangeHistory={exchangeHistory}
        historyLoading={historyLoading}
        fetchExchangeHistory={fetchExchangeHistory}
      />
    </div>
  );
}
