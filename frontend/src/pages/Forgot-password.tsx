import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, Mail, ArrowLeft, KeyRound, Sparkles } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      if (res.data.success) {
        toast.success("Reset link sent!");
        setIsSent(true);
        setTimer(30); 
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || timer > 0) return;
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      if (res.data.success) {
        toast.success("Instructions resent!");
        setTimer(60);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 rounded-[3rem] shadow-2xl border border-white/10 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
             <KeyRound size={32} />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter">Recover Access</h2>
          <p className="text-muted-foreground mt-2 font-medium">No worries, we'll get you back in.</p>
        </div>

        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/80 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="block w-full pl-12 pr-4 py-4 bg-secondary/30 border border-border/50 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-background transition-all duration-300 outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Reset Link"}
              </button>
            </motion.form>
          ) : (
            <motion.div 
               key="sent"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center"
            >
               <div className="bg-primary/5 border border-primary/20 p-6 rounded-4xl mb-8">
                  <div className="flex items-center justify-center gap-2 text-primary font-black mb-2">
                     <Sparkles size={18} /> SUCCESS
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">A magic link has been sent to <span className="text-foreground font-bold">{email}</span></p>
               </div>

               <button
                onClick={handleResend}
                disabled={timer > 0 || isLoading}
                className="w-full py-4 glass border border-white/10 rounded-2xl font-black text-sm hover:bg-secondary/50 transition-all disabled:opacity-50"
               >
                 {timer > 0 ? `Try again in ${timer}s` : "Didn't get it? Resend link"}
               </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 border-t border-white/10 pt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
               <ArrowLeft size={16} /> Back to Sign In
            </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
