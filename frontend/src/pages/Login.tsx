import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, Sparkles } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthLoading } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-15%] right-[-15%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-15%] left-[-15%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }} />

      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Welcome Content */}
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           className="hidden md:block"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" /> AI-Powered Career Platform
          </div>
          
          <h1 className="text-6xl font-black text-foreground leading-[1.1] mb-6">
            Welcome <br />
            <span className="text-gradient">Back Explorer.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground font-medium max-w-sm">
            Resume where you left off and take the next step in your professional evolution.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6 p-6 glass rounded-3xl border border-white/5">
             <div>
                <p className="text-3xl font-black text-primary">10k+</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Users Helped</p>
             </div>
             <div>
                <p className="text-3xl font-black text-accent">98%</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Match Accuracy</p>
             </div>
          </div>
        </motion.div>

        {/* Right Side: Login Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full glass p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/10 relative overflow-hidden"
        >
          <div className="md:hidden text-center mb-10">
             <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-black text-2xl">J</span>
             </div>
             <h2 className="text-3xl font-black text-foreground">Welcome Back</h2>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold text-foreground">Sign in</h3>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your workspace</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-2xl mb-8 flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-destructive rounded-full animate-ping" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-foreground/80">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary font-bold hover:opacity-80 transition-opacity">
                  Forgot?
                </Link>
              </div>
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
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-4 flex items-center justify-center gap-3"
            >
              {isAuthLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-sm font-medium text-muted-foreground">
            New to JoblyTics?{" "}
            <Link to="/signup" className="text-primary font-black hover:text-primary/80 transition-colors border-b-2 border-primary/20 pb-0.5">
              Create an account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
