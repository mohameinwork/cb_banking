import React, { useState } from "react";
import { Printer, Save, Plus, Trash2, FileCheck } from "lucide-react";

const INITIAL_ITEMS = [
  {
    id: 1,
    desc: "Shipping Container Fee (40ft)",
    dollar: 2500,
    slsh: 65000000,
    balance: 0,
  },
  {
    id: 2,
    desc: "Port Handling Charges",
    dollar: 300,
    slsh: 7800000,
    balance: 0,
  },
];

export default function QuotationPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  // Function to add a new empty row
  const addNewRow = () => {
    const newId = items.length + 1;
    setItems([
      ...items,
      { id: newId, desc: "", dollar: 0, slsh: 0, balance: 0 },
    ]);
  };

  // Function to remove a row
  const removeRow = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Calculate Total
  const totalAmount = items.reduce((sum, item) => sum + item.dollar, 0);

  return (
    <div className="flex flex-col h-full min-h-[700px] justify-center">
      {/* ACTION HEADER (New Feature) */}
      <div className="w-full max-w-6xl mx-auto mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">New Quotation</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 font-bold shadow-sm hover:bg-gray-50">
            <Printer className="h-4 w-4" /> Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded font-bold shadow-sm hover:bg-trust-light transition-colors">
            <Save className="h-4 w-4" /> Save Record
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="bg-white w-full max-w-6xl mx-auto p-10 shadow-lg min-h-[600px] relative rounded-lg border-t-8 border-trust-DEFAULT">
        {/* STATUS BADGE (New Feature) */}
        <div className="absolute top-8 right-8">
          <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold uppercase text-xs tracking-wider border border-orange-200">
            <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
            Pending Payment
          </div>
        </div>

        {/* 1. TOP FORM SECTION */}
        <div className="flex flex-row justify-start items-end gap-10 mb-10 border-b border-gray-100 pb-8">
          <div className="flex flex-col gap-2">
            <label className="text-primary font-bold text-sm uppercase tracking-wide">
              Quotation ID
            </label>
            <input
              type="text"
              placeholder="QT-2025-001"
              className="border-b-2 border-gray-300 focus:border-trust-DEFAULT outline-none text-gray-900 font-bold pb-1 w-32"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-primary font-bold text-sm uppercase tracking-wide">
              Company Name
            </label>
            <input
              type="text"
              defaultValue="Dahabshiil Imports"
              className="border-b-2 border-gray-300 focus:border-primary outline-none text-gray-900 font-bold pb-1 w-64"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-primary font-bold text-sm uppercase tracking-wide">
              Container No.
            </label>
            <input
              type="text"
              defaultValue="MSKU-99281"
              className="border-b-2 border-gray-300 focus:border-primary outline-none text-gray-900 font-bold pb-1 w-48"
            />
          </div>
          {/* Exchange Rate Indicator (New Feature) */}
          <div className="flex flex-col gap-2 ml-auto text-right">
            <label className="text-gray-400 font-bold text-xs uppercase tracking-wide">
              Exchange Rate
            </label>
            <span className="text-primary font-bold text-lg">
              1 USD =10,830 SLSH
            </span>
          </div>
        </div>

        {/* 2. TABLE SECTION */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-4 px-4 font-bold uppercase w-16 rounded-tl-md">
                  S/N
                </th>
                <th className="py-4 px-4 font-bold uppercase w-1/3">
                  DESCRIPTION
                </th>
                <th className="py-4 px-4 font-bold text-right">Dollar ($)</th>
                <th className="py-4 px-4 font-bold text-right">SLSH (Sh)</th>
                <th className="py-4 px-4 font-bold text-right">BALANCE</th>
                <th className="py-4 px-4 w-12 rounded-tr-md"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                >
                  <td className="py-4 px-4 text-gray-700 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="text"
                      defaultValue={item.desc}
                      placeholder="Enter description"
                      className="w-full bg-transparent outline-none font-bold text-gray-700 placeholder-gray-400"
                    />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <input
                      type="number"
                      defaultValue={item.dollar}
                      className="w-full bg-transparent outline-none text-right font-medium text-gray-700"
                    />
                  </td>
                  <td className="py-4 px-4 text-right text-gray-500">
                    {item.slsh.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right text-red-500 font-bold">
                    {item.balance}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => removeRow(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Row Button (New Feature) */}
          <button
            onClick={addNewRow}
            className="mt-4 flex items-center gap-2 text-sm font-bold text-primary hover:text-trust-light transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>
        </div>

        {/* 3. FOOTER SECTION */}
        <div className="flex justify-between items-end mt-12 pt-8 border-t border-gray-100">
          {/* Signature Block (New Feature) */}
          <div className="flex gap-12">
            <div className="text-center">
              <div className="h-24 w-40 border-b-2 border-gray-300 mb-2"></div>
              <span className="text-xs font-bold text-gray-400 uppercase">
                Authorized Signature
              </span>
            </div>
            <div className="text-center">
              <div className="h-24 w-40 border-b-2 border-gray-300 mb-2 flex items-end justify-center pb-2">
                <span className="text-gray-300 text-sm italic">DD/MM/YYYY</span>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase">
                Date
              </span>
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-gray-500 font-bold text-sm uppercase">
              Total Amount Due
            </span>
            <span className="text-primary font-extrabold text-4xl">
              $
              {totalAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="text-xs text-gray-400 font-medium italic">
              Includes all taxes & fees
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
