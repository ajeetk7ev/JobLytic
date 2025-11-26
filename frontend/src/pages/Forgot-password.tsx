import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // ---- RESEND TIMER ----
  const [timer, setTimer] = useState(isSent ? 30 : 0);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const navigate = useNavigate();

  // ---- FIRST SUBMIT ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });

      if (res.data.success) {
        toast.success("Reset link sent!");
        setIsSent(true);
        setTimer(30); // start 30 sec timer
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ---- RESEND ----
  const handleResend = async () => {
    if (!email || timer > 0) return;

    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });

      if (res.data.success) {
        toast.success("Instructions resent!");
        setTimer(30);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        
        <h2 className="text-2xl font-bold text-white mb-4">Reset your password</h2>
        
        <p className="text-gray-300 mb-6">
          Enter your email to receive password reset instructions.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-200 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          {/* SEND BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg text-lg font-semibold text-white bg-gray-700 hover:bg-gray-600 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader className="animate-spin h-5 w-5" />}
            {isLoading ? "Sending..." : isSent ? "Sent" : "Send"}
          </button>
        </form>

        {/* RESEND BUTTON */}
        {isSent && (
          <button
            onClick={handleResend}
            disabled={timer > 0 || isLoading}
            className={`mt-4 w-full py-3 rounded-lg text-lg font-medium 
              ${timer > 0 ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-gray-700 text-white hover:bg-gray-600"}`}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend email"}
          </button>
        )}

        {/* BACK */}
        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-gray-300 hover:text-white flex items-center gap-1"
        >
          ← Back To Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
