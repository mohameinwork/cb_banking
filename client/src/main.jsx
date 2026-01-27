import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "@/components/ui/sonner";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        colors={{ success: "#10B981", error: "#EF4444" }}
      />
    </AuthProvider>
  </StrictMode>,
);
