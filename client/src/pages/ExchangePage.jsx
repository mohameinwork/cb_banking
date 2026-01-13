import React, { useState, useEffect } from "react";
import { ArrowRightLeft, RefreshCcw, CheckCircle } from "lucide-react";
import ExchangeForm from "../components/exchanges/ExchangeForm";
import ExchangeSwitch from "../components/exchanges/ExchangeSwitch";
import ResultExchange from "../components/exchanges/ResultExchange";
import { useAuth } from "../context/useAuth";
import axios from "axios";

export default function ExchangePage() {
  const { user } = useAuth();
  // --- STATES ---
  const [direction, setDirection] = useState("USD_TO_SLSH"); // "USD_TO_SLSH" or "SLSH_TO_USD"
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");

  useEffect(() => {
    if (user?.user?.name) setSenderName(user.user.name);
  }, [user]);

  // Input values
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(10800);
  const [result, setResult] = useState("0");
  const [loading, setLoading] = useState(false);

  // --- LOGIC ---

  // 1. Switch Handler
  const toggleDirection = () => {
    setDirection((prev) =>
      prev === "USD_TO_SLSH" ? "SLSH_TO_USD" : "USD_TO_SLSH"
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

  // Labels based on direction
  const inputLabel =
    direction === "USD_TO_SLSH" ? "Dollar ($)" : "Shilling (Sh)";
  const outputLabel =
    direction === "USD_TO_SLSH" ? "Shilling (Sh)" : "Dollar ($)";
  const inputSymbol = direction === "USD_TO_SLSH" ? "$" : "Sh";
  const outputSymbol = direction === "USD_TO_SLSH" ? "SLSH" : "USD";

  const URL = "http://localhost:8000/api";
  const handleSubmit = async () => {
    const amt = Number(amount || 0);
    const resAmt = Number(result || 0);
    const rt = Number(rate || 0);

    // Validation
    if (!senderName) return alert("Sender is required");
    if (!receiverName) return alert("Receiver is required");
    if (!amt || amt <= 0)
      return alert("Source amount must be greater than zero");
    if (!resAmt || resAmt <= 0)
      return alert("Target amount must be greater than zero");
    if (!rt || rt <= 0) return alert("Invalid rate");

    const payload = {
      sender: user?.user?.id,
      receiver: receiverName,
      sourceAmount: amt,
      sourceCurrency: inputLabel,
      targetAmount: resAmt,
      targetCurrency: inputLabel === "Shilling (Sh)" ? "SLSH" : "USD",
      rate: rt,
    };

    try {
      setLoading(true); // optional loading state
      const response = await axios.post(`${URL}/exchange/convert`, payload);
      console.log("Exchange success:", response.data);
      alert("Conversion successful!");

      // Reset form
      setAmount("");
      setResult("");
      setRate("");
      setReceiverName("");
      setSenderName("");
    } catch (error) {
      console.error("Exchange failed:", error);
      alert(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
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
    </div>
  );
}
