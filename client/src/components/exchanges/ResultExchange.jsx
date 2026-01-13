import { CheckCircle, RefreshCcw } from "lucide-react";
import React from "react";

const ResultExchange = ({
  direction,
  rate,
  result,
  outputSymbol,
  handleSubmit,
}) => {
  return (
    <>
      {/* 4. SPLIT COLUMNS: Action vs Data State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* LEFT COLUMN: Actions & Summary */}
        <div className="flex flex-col justify-between gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Transaction Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Operation:</span>
                <span className="font-bold">
                  {direction === "USD_TO_SLSH"
                    ? "Buying Shillings"
                    : "Selling Shillings"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Exchange Rate:</span>
                <span className="font-bold">{rate.toLocaleString()}</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between text-lg">
                <span className="font-bold text-primary">Total:</span>
                <span className="font-bold text-primary">
                  {result} {outputSymbol}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white font-bold text-xl py-5 rounded-xl shadow-xl hover:bg-primary/90 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <CheckCircle className="h-6 w-6" />
            CONFIRM EXCHANGE
          </button>
        </div>

        {/* RIGHT COLUMN: Completed Data State (The Form) */}
        <div className="bg-white rounded-[30px] p-8 min-h-[300px] shadow-xl relative border border-gray-100 flex flex-col">
          {/* Decorative Top Bar */}
          <div className="absolute top-8 left-8 right-8 h-6 bg-[#A8D5BA] opacity-50 rounded-full"></div>

          <div className="mt-16 text-center flex-1 flex flex-col items-center justify-center opacity-40">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <RefreshCcw className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-black">Exchange Details</h3>
            <h2 className="text-2xl font-bold text-black mt-1">FORM</h2>
            <p className="text-sm text-gray-500 mt-2">
              Data will appear here after confirmation
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultExchange;
