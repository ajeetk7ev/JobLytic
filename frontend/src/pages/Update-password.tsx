import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/utils/api";
import { motion } from "framer-motion";

function UpdatePassword() {
  const { id } = useParams();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match.");
        return;
      }
      const res = await axios.post(`${API_URL}/auth/update-password/${id}`, {
        password: newPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setNewPassword("");
        setConfirmPassword("");
        navigate("/login");
      }
    } catch (error: any) {
      console.log("Error in UpdatePassword ", error);
      toast.error(error.response?.data.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden relative">
      <div className="absolute bottom-[-15%] left-[-15%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass p-10 rounded-[3rem] shadow-2xl border border-white/10 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
             <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter">Secure Account</h2>
          <p className="text-muted-foreground mt-2 font-medium">Create a bulletproof password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/80 ml-1">New Password</label>
            <div className="relative group">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-6 py-4 bg-secondary/30 border border-border/50 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-background transition-all duration-300 outline-none placeholder:text-muted-foreground/50"
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/80 ml-1">Confirm Identity</label>
            <div className="relative group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-6 py-4 bg-secondary/30 border border-border/50 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-background transition-all duration-300 outline-none placeholder:text-muted-foreground/50"
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <>
                Confirm New Password <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
            <Link to="/login" className="text-sm font-bold text-primary hover:opacity-80 transition-opacity">
               Actually, I remember it now.
            </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default UpdatePassword;
