import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
const URL = "https://cb-banking.onrender.com/api";
export default function LoginPage() {
  const { login, loading, setLoading } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const email = formData.get("email");
      const password = formData.get("password");
      const loginData = { email, password };
      const resp = await axios.post(`${URL}/auth/login`, loginData);
      login(resp.data);
      navigate("/dashboard");
      setLoading(false);
    } catch (err) {
      console.log("Error at login", err.message);
      setLoading(false);
    }
  };

  return (
    // 1. Full Page Background with subtle gradient
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      {/* 2. Main Card Container */}
      <div className="bg-white shadow-2xl rounded-2xl max-w-md w-full overflow-hidden border border-gray-100">
        {/* Decorative Top Bar */}
        <div className="h-2 w-full bg-primary"></div>

        <div className="p-8 flex flex-col gap-6">
          {/* 3. Logo & Header Section */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold text-primary tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 font-medium">
              Cabdi Bindhe Money Exchange
            </p>
          </div>

          {/* 4. The Form */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-bold text-gray-700 ml-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-11 bg-gray-50 border-gray-200 focus:border-trust-DEFAULT focus:ring-trust-DEFAULT/20"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-gray-700 ml-1"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-trust-light text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Spinner size="sm" color="text-white" /> : "Sign In"}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </Button>
          </form>

          {/* 5. Footer / Register Link */}
          <div className="text-center text-sm text-gray-500 mt-2">
            Don't have an account?{" "}
            <a href="#" className="font-bold text-primary hover:underline">
              Contact Admin
            </a>
          </div>
        </div>

        {/* 6. Security Footer */}
        <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" /> Secured with 256-bit Encryption
          </p>
        </div>
      </div>
    </div>
  );
}
