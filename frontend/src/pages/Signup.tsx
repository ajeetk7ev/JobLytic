import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, User, ArrowRight, ShieldCheck } from "lucide-react";

export const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isAuthLoading } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await signup(fullName, email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side: Branding/Value Prop */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-primary-foreground font-black text-2xl">J</span>
            </div>
            <span className="text-3xl font-black tracking-tighter text-gradient">JoblyTics</span>
          </div>
          
          <h2 className="text-5xl font-black leading-tight text-foreground">
            Smart Career <br /> 
            <span className="text-gradient">Optimization</span> 
            <br /> Starts Here.
          </h2>
          
          <ul className="space-y-4">
            {[
              "AI-Powered Resume Analysis",
              "Real-time Job Matching",
              "Premium Interview Preparation",
              "Advanced Career Insights"
            ].map((feature, i) => (
              <motion.li 
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="flex items-center gap-3 text-muted-foreground font-medium"
              >
                <div className="p-1 bg-primary/10 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right Side: Signup Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full glass p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/10"
        >
          <div className="text-center mb-8 md:hidden">
            <h1 className="text-3xl font-black text-foreground mb-2">Join JoblyTics</h1>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-foreground">Create your account</h3>
            <p className="text-muted-foreground mt-1">Free access to premium tools for 7 days</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-2xl mb-6 flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-secondary/30 border border-border/50 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-background transition-all duration-300 outline-none placeholder:text-muted-foreground/50"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-secondary/30 border border-border/50 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-background transition-all duration-300 outline-none placeholder:text-muted-foreground/50"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-secondary/30 border border-border/50 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-background transition-all duration-300 outline-none placeholder:text-muted-foreground/50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-bold hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-4 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isAuthLoading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
            Already a member?{" "}
            <Link to="/login" className="text-primary font-bold hover:text-primary/80 transition-colors border-b-2 border-primary/20 pb-0.5">
              Sign in here
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
