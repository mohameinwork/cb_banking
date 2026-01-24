import React, { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import ExchangeForm from "../components/exchanges/ExchangeForm";
import ExchangeSwitch from "../components/exchanges/ExchangeSwitch";
import ResultExchange from "../components/exchanges/ResultExchange";
import { useAuth } from "../context/useAuth";
import axios from "axios";
import SuccessModal from "../components/SuccessModal";

export default function ExchangePage() {
  const { user } = useAuth();
  // --- STATES ---
  const [direction, setDirection] = useState("USD_TO_SLSH"); // "USD_TO_SLSH" or "SLSH_TO_USD"
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  useEffect(() => {
    if (user?.user?.name) setSenderName(user.user.name.toUpperCase());
  }, [user]);

  const accounts = user?.user.accountsTable ?? [];

  const usdAccount = accounts.find((acc) => acc.currency === "USD");
  const slshAccount = accounts.find((acc) => acc.currency === "SLSH");

  if (!usdAccount || !slshAccount) {
    throw new Error("Required account missing");
  }

  // Input values
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(10800);
  const [result, setResult] = useState("0");

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
  }, [amount, rate, direction]);

  const URL = "http://localhost:8000/api";
  // Labels based on direction
  const inputLabel =
    direction === "USD_TO_SLSH" ? "Dollar ($)" : "Shilling (Sh)";
  const outputLabel =
    direction === "USD_TO_SLSH" ? "Shilling (Sh)" : "Dollar ($)";
  const inputSymbol = direction === "USD_TO_SLSH" ? "$" : "Sh";
  const outputSymbol = direction === "USD_TO_SLSH" ? "SLSH" : "USD";

  const handleSubmit = async () => {
    const amt = Number(amount);
    const resAmt = Number(result);
    const rt = Number(rate);

    // Validation
    if (!senderName) return alert("Sender is required");
    if (!receiverName) return alert("Receiver is required");
    if (!amt || amt <= 0)
      return alert("Source amount must be greater than zero");
    if (!resAmt || resAmt <= 0)
      return alert("Target amount must be greater than zero");
    if (!rt || rt <= 0) return alert("Invalid rate");
    const payload = {
      userId: user.user.id,

      sourceAccountId:
        direction === "USD_TO_SLSH" ? usdAccount.id : slshAccount.id,

      targetAccountId:
        direction === "USD_TO_SLSH" ? slshAccount.id : usdAccount.id,

      sourceAmount: Number(amount),
      targetAmount: Number(result),

      sourceCurrency: direction === "USD_TO_SLSH" ? "USD" : "SLSH",
      targetCurrency: direction === "USD_TO_SLSH" ? "SLSH" : "USD",

      rate: Number(rate),
    };

    setIsSuccessOpen(false);
    console.log("Submitting exchange with payload:", payload);

    try {
      await axios.post(`${URL}/exchange/convert`, payload);
      // Reset form
      setAmount("");
      setResult("");
      setRate("");
      setReceiverName("");
      setSenderName("");
      setIsSuccessOpen(true);
    } catch (error) {
      console.error("Exchange failed:", error);
      alert(error?.response?.data?.message || "Something went wrong!");
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
        <p className="text-gray-500 text-sm mt-1">
          Current Direction:{" "}
          <span className="font-bold text-primary">
            {direction === "USD_TO_SLSH" ? "USD ➔ SLSH" : "SLSH ➔ USD"}
          </span>
        </p>
      </div>

      {/* 2. FROM / TO NAMES (Kept at top) */}
      <ExchangeForm
        setReceiverName={setReceiverName}
        senderName={senderName}
        receiverName={receiverName}
      />

      {/* 3. INPUTS ROW & SWITCH BUTTON (Kept at top, logic updated) */}
      <ExchangeSwitch
        amount={amount}
        inputSymbol={inputSymbol}
        outputLabel={outputLabel}
        inputLabel={inputLabel}
        rate={rate}
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
      />

      {/* 3. Render the Success Modal at the bottom of the component */}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Exchange Successful!"
        message="The currency exchange has been recorded in the ledger."
        details={{
          "Transaction ID": "TXN-882910-XG",
          Sender: senderName || "Self",
          Receiver: receiverName || "Self",
          "Exchange Rate": `1 USD = ${rate} SLSH`,
          "Total Amount": `${result} ${direction === "USD_TO_SLSH" ? "SLSH" : "USD"}`,
        }}
      />
    </div>
  );
}
