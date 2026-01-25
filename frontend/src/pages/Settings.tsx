
import { useState, useRef } from "react";
import { User, Lock, Trash2, Camera, Upload, ShieldAlert, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import api from "@/utils/api";
import { toast } from "react-hot-toast";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "danger", label: "Danger Zone", icon: ShieldAlert },
];

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // Profile State
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.user);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    setLoading(true);
    try {
      await api.put("/auth/password", { currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Change password failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This action CANNOT be undone.")) return;
    const confirmText = window.prompt("Type 'DELETE' to confirm account deletion");
    if (confirmText !== "DELETE") return toast.error("Incorrect confirmation text");

    try {
      await api.delete("/auth/account");
      toast.success("Account deleted");
      window.location.href = "/login";
    } catch (error: any) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen pt-20 px-6 pb-12 flex justify-center">
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex flex-col gap-2">
            <h1 className="text-2xl font-black mb-6 px-4">Settings</h1>
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        activeTab === tab.id 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                        : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <tab.icon size={18} />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-secondary/10 border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                >
                    {activeTab === "profile" && (
                        <div className="max-w-lg">
                            <h2 className="text-xl font-black mb-8 flex items-center gap-2">
                                <User className="text-primary" /> Edit Profile
                            </h2>
                            
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                {/* Avatar Upload */}
                                <div className="flex items-center gap-6">
                                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-secondary bg-secondary/30">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <User size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera size={24} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                                        >
                                            <Upload size={14} /> Upload New
                                        </button>
                                        <p className="text-[10px] text-muted-foreground">Recommended: Square JPG, PNG</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleAvatarChange} 
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Full Name</label>
                                        <input 
                                            className="w-full bg-secondary/30 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Email Address</label>
                                        <input 
                                            className="w-full bg-secondary/30 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button 
                                    disabled={loading}
                                    className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/25 transition-all disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="max-w-lg">
                            <h2 className="text-xl font-black mb-8 flex items-center gap-2">
                                <Fingerprint className="text-primary" /> Change Password
                            </h2>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Current Password</label>
                                    <input 
                                        type="password"
                                        className="w-full bg-secondary/30 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase ml-1">New Password</label>
                                        <input 
                                            type="password"
                                            className="w-full bg-secondary/30 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Confirm New</label>
                                        <input 
                                            type="password"
                                            className="w-full bg-secondary/30 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button 
                                    disabled={loading}
                                    className="px-8 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-bold uppercase tracking-widest transition-all disabled:opacity-50 mt-4"
                                >
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === "danger" && (
                        <div className="max-w-lg">
                            <h2 className="text-xl font-black mb-8 flex items-center gap-2 text-destructive">
                                <ShieldAlert /> Danger Zone
                            </h2>
                            <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-2xl">
                                <h3 className="font-bold text-lg mb-2">Delete Account</h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Once you delete your account, there is no going back. Please be certain. All your data including resumes and job applications will be permanently removed.
                                </p>
                                <button 
                                    onClick={handleDeleteAccount}
                                    className="px-6 py-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-destructive/25 transition-all"
                                >
                                    Delete My Account
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
