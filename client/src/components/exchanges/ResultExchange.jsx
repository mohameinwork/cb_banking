import { CheckCircle, RefreshCcw } from "lucide-react";
import React from "react";

const ResultExchange = ({
  direction,
  rate,
  rateLoading,
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
            <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Transaction Summary
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Operation:</span>
                <span className="font-bold text-primary">
                  {direction === "USD_TO_SLSH"
                    ? "Buying Shillings"
                    : "Selling Shillings"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">
                  Exchange Rate:
                </span>
                <span className="font-bold flex items-center gap-2">
                  {rateLoading ? (
                    <>
                      <RefreshCcw className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    `1 USD = ${rate} SLSH`
                  )}
                </span>
              </div>
              <div className="h-px bg-gradient-to-r from-primary/20 to-primary/20 my-4"></div>
              <div className="flex justify-between items-center text-lg py-2">
                <span className="font-bold text-gray-700">Total Amount:</span>
                <span className="font-bold text-primary text-xl">
                  {result} {outputSymbol}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-primary to-primary/80 text-white font-bold text-xl py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <CheckCircle className="h-6 w-6" />
            CONFIRM EXCHANGE
          </button>
        </div>

        {/* RIGHT COLUMN: Exchange Info */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 min-h-[300px] shadow-lg border border-primary/20 flex flex-col">
          <div className="text-center flex-1 flex flex-col items-center justify-center">
            <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <RefreshCcw className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">
              Currency Exchange
            </h3>
            <h2 className="text-lg font-medium text-gray-600 mb-4">
              {direction === "USD_TO_SLSH" ? "USD → SLSH" : "SLSH → USD"}
            </h2>
            <div className="bg-white/80 rounded-xl p-4 w-full max-w-xs">
              <div className="text-sm text-gray-600 mb-2">Current Rate</div>
              <div className="text-xl font-bold text-primary">
                1 USD = {rate} SLSH
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 max-w-xs">
              Exchange rates are updated in real-time. Your transaction will be
              processed securely.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultExchange;
