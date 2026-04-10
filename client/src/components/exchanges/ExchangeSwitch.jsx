import { ArrowRightLeft, RefreshCcw } from "lucide-react";
import React from "react";

const ExchangeSwitch = ({
  inputSymbol,
  amount,
  setAmount,
  toggleDirection,
  rate,
  rateLoading,
  outputSymbol,
  result,
}) => {
  return (
    <>
      {/* 3. INPUTS ROW & SWITCH BUTTON (Kept at top, logic updated) */}
      <div className="relative flex flex-col md:flex-row justify-between items-end mb-12 gap-6 md:gap-8">
        {/* Input 1: Source Amount */}
        <div className="flex-1 w-full text-center">
          <label className="block text-primary font-bold text-lg mb-3 italic transition-all">
            You Send
          </label>
          <div className="bg-white p-4 flex items-center justify-center shadow-md rounded-xl border-2 border-gray-100 hover:border-primary/30 transition-colors">
            <span className="font-bold text-xl mr-3 text-gray-400">
              {inputSymbol}
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full text-center font-bold text-xl outline-none text-gray-800 placeholder-gray-300"
            />
          </div>
        </div>

        {/* THE SWITCH BUTTON (Centered) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 md:static md:mb-3 z-10">
          <button
            onClick={toggleDirection}
            className="bg-primary hover:bg-primary/80 text-white rounded-full p-3 shadow-lg border-4 border-gray-100 transition-transform active:scale-95"
            title="Switch Currency"
          >
            <ArrowRightLeft className="h-6 w-6" />
          </button>
        </div>

        {/* Input 2: Rate */}
        <div className="flex-1 w-full text-center">
          <label className="block text-primary font-bold text-lg mb-3 italic">
            Exchange Rate
          </label>
          <div className="bg-white p-4 flex items-center justify-center shadow-md rounded-xl border-2 border-gray-100">
            <input
              type="number"
              value={rate}
              readOnly
              className="w-full text-center font-bold text-xl outline-none text-gray-800"
            />
            {rateLoading && (
              <RefreshCcw className="h-5 w-5 text-primary animate-spin ml-3" />
            )}
          </div>
        </div>

        {/* Input 3: Result (Read Only) */}
        <div className="flex-1 w-full text-center">
          <label className="block text-primary font-bold text-lg mb-3 italic transition-all">
            You Receive
          </label>
          <div className="bg-white p-4 flex items-center justify-center shadow-md rounded-xl border-2 border-primary/20 bg-primary/5">
            <span className="font-bold text-xl mr-3 text-primary">
              {outputSymbol}
            </span>
            <input
              type="text"
              readOnly
              value={result}
              className="w-full text-center font-bold text-xl outline-none bg-transparent text-primary"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExchangeSwitch;
