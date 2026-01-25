import StatsGrid from "@/components/workspace/dashboard/StatsGrid";
import UpcomingInterviewCard from "@/components/workspace/dashboard/UpcomingInterviewCard";
import FeatureGrid from "@/components/workspace/dashboard/FeatureGrid";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

import {
  FileSearch,
  Search,
  PenTool,
  ClipboardList,
  Briefcase,
  CheckCircle2,
  Calendar,
  UserCheck,
  Sparkles
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuthStore();
  const userName = user?.fullName?.split(' ')[0] || "there";

  const stats = [
    { id: 1, label: "Jobs Applied", value: 12, icon: Briefcase, color: "text-blue-500" },
    { id: 2, label: "Shortlisted", value: 4, icon: CheckCircle2, color: "text-emerald-500" },
    { id: 3, label: "Interviews", value: 1, icon: Calendar, color: "text-violet-500" },
    { id: 4, label: "Profile Score", value: "78%", icon: UserCheck, color: "text-amber-500" },
  ];

  const nextInterview = {
    role: "Frontend Developer",
    company: "TechNova Pvt Ltd",
    date: "Dec 18, 2025",
    time: "3:00 PM",
    location: "Google Meet",
  };

  const cardData = [
    { id: 1, title: "AI JD Matcher", description: "Analyze how well your resume matches any job description.", icon: FileSearch, path: "/resume-jd-matcher" },
    { id: 2, title: "Smart Job Search", description: "AI-powered job discovery based on your unique profile.", icon: Search, path: "/jobs" },
    { id: 3, title: "Resume Optimizer", description: "Enhance your resume with AI suggestions for better ATS hit.", icon: PenTool, path: "/resume-builder" },
    { id: 4, title: "Application Tracker", description: "Stay organized and track your recruitment status.", icon: ClipboardList, path: "/tracker" },
  ];

  return (
    <div className="w-full h-full pb-20 relative">
        {/* Subtle Decorative Gradient */}
        <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <header className="mb-12 relative z-10">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black tracking-[0.2em] mb-6 uppercase"
            >
                <Sparkles size={14} className="animate-pulse" /> AI Workspace Active
            </motion.div>
            
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-tight"
            >
                Welcome back, <br />
                <span className="text-gradient">Captain {userName}!</span>
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground mt-4 font-medium max-w-xl"
            >
                Your personal AI assistant is ready to optimize your career path. 
                What shall we achieve today?
            </motion.p>
        </header>

        <section className="space-y-12 relative z-10">
            <StatsGrid stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black tracking-tighter">Premium Features</h2>
                        <div className="h-px flex-1 bg-border/50 mx-6 hidden sm:block" />
                    </div>
                    <FeatureGrid cards={cardData} />
                </div>
                
                <div className="lg:col-span-1 space-y-10">
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter mb-8">Next Event</h2>
                        <UpcomingInterviewCard interview={nextInterview} />
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="glass p-8 rounded-[2.5rem] relative overflow-hidden group border-primary/20 bg-linear-to-br from-primary/5 to-accent/5 shadow-xl"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-12 -mt-12 blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                        <h3 className="font-black text-xl mb-3 tracking-tight">Upgrade to <span className="text-primary tracking-tighter italic">ELITE</span></h3>
                        <p className="text-sm font-bold text-muted-foreground mb-8 leading-relaxed">Unlock dedicated AI coaching and advanced market analysis tools.</p>
                        <button className="w-full py-4 bg-foreground text-background rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/10">
                            Explore Elite Plan
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    </div>
  );
}
