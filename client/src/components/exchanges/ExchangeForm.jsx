import React from "react";

const ExchangeForm = ({ senderName, receiverName, setReceiverName }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 md:gap-20">
      {/* From Box */}
      <div className="flex-1 w-full bg-white p-2 pl-4 flex items-center shadow-sm border-l-4 border-primary">
        <span className="font-bold text-primary w-16 cursor-default">
          From:
        </span>
        <input
          type="text"
          value={senderName}
          readOnly
          className="font-medium italic text-gray-800 w-full outline-none border-none bg-transparent placeholder-gray-400"
          placeholder="Sender Name..."
        />
      </div>

      {/* To Box */}
      <div className="flex-1 w-full bg-white p-2 pl-4 flex items-center shadow-sm border-l-4 border-primary">
        <span className="font-bold text-primary w-16 cursor-default">To:</span>
        <input
          type="text"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
          className="font-medium italic text-gray-800 w-full outline-none border-none bg-transparent placeholder-gray-400"
          placeholder="Receiver Name..."
        />
      </div>
    </div>
  );
};

export default ExchangeForm;
