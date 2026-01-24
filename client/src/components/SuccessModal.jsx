import { CheckCircle, X, Download, Copy } from "lucide-react";

const SuccessModal = ({
  isOpen,
  onClose,
  title = "Transaction Successful!",
  message = "Your exchange has been processed successfully.",
  details = {}, // Example: { "Transaction ID": "TXN-882910", "Amount": "$100.00" }
}) => {
  if (!isOpen) return null;

  // Simple copy to clipboard function
  const handleCopyId = () => {
    if (details["Transaction ID"]) {
      navigator.clipboard.writeText(details["Transaction ID"]);
      alert("Transaction ID copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 1. Header with Success Icon */}
        <div className="flex flex-col items-center pt-10 pb-6 px-8 text-center bg-emerald-50/50">
          <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-primary tracking-tight">
            {title}
          </h2>
          <p className="text-gray-500 font-medium mt-1">{message}</p>
        </div>

        {/* 2. Receipt Details Section */}
        {Object.keys(details).length > 0 && (
          <div className="px-8 py-6 bg-white">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
              {Object.entries(details).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-500 font-medium">{key}:</span>
                  <span
                    className={`font-bold ${key.toLowerCase().includes("amount") ? "text-lg text-emerald-600" : "text-primary"}`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Action: Copy ID */}
            {details["Transaction ID"] && (
              <button
                onClick={handleCopyId}
                className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-bold text-primary hover:text-trust-light transition-colors py-2"
              >
                <Copy className="h-4 w-4" /> Copy Reference ID
              </button>
            )}
          </div>
        )}

        {/* 3. Footer Buttons */}
        <div className="px-8 pb-8 pt-2 flex gap-4">
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <Download className="h-4 w-4" /> Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
