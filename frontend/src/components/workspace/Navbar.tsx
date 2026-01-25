import { Menu, LogOut, User, Bell, Search as SearchIcon, Sun, Moon, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useSidebarCollapsedStore } from "@/store/sidebarCollapsedStore";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function WorkSpaceNavbar() {
    const { collapsed, setCollapsed } = useSidebarCollapsedStore();
    const { user, logout } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <nav className="w-full h-16 px-6 flex items-center justify-between 
                        glass border-b border-border/50
                        fixed top-0 left-0 right-0 z-50">

            {/* Left section */}
            <div className="flex items-center gap-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-primary/10 rounded-xl text-muted-foreground hover:text-primary transition-colors"
                >
                    <Menu size={22} />
                </motion.button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">J</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gradient hidden sm:block">JoblyTics</span>
                </div>
            </div>

            {/* Middle section - Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full group">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search anything..." 
                        className="w-full bg-secondary/50 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
                <Link to="/subscription">
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary/25">
                        <Zap size={14} className="fill-current" /> Upgrade
                    </button>
                </Link>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </motion.button>

                <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                </button>

                <div className="relative">
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 p-1 pl-3 border border-border/50 rounded-2xl hover:bg-secondary/50 transition-all"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-foreground leading-none">{user?.fullName}</p>
                            <p className="text-[10px] text-muted-foreground">Premium Plan</p>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20">
                            {user?.fullName?.charAt(0)}
                        </div>
                    </button>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-48 glass rounded-2xl shadow-xl border border-border/50 py-2 z-50 overflow-hidden"
                            >
                                <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-primary/10 text-foreground transition-colors">
                                    <User size={16} className="text-primary" /> Profile
                                </button>
                                <div className="h-px bg-border/50 my-1 mx-2" />
                                <button 
                                    onClick={() => logout()}
                                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-destructive/10 text-destructive transition-colors"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
}

export default WorkSpaceNavbar;
