import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface InterviewProps {
  role: string;
  company: string;
  date: string;
  time: string;
  location: string;
}

export default function UpcomingInterviewCard({ interview }: { interview: InterviewProps | null }) {
  const navigate = useNavigate();

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-6 shadow-xl relative overflow-hidden group"
    >
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black flex items-center gap-2 text-foreground">
                <Calendar className="w-5 h-5 text-primary" />
                Interviews
            </h2>

            <button
                onClick={() => navigate("/tracker")}
                className="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center gap-1"
            >
                VIEW ALL <ArrowRight size={12} />
            </button>
        </div>

        {interview ? (
            <div className="space-y-4">
                <div className="bg-secondary/50 p-4 rounded-xl border border-border/50">
                    <p className="text-foreground font-bold leading-tight">{interview.role}</p>
                    <p className="text-primary text-xs font-semibold mt-1">{interview.company}</p>
                </div>

                <div className="space-y-3 px-1">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar size={14} className="text-primary/70" />
                        <span className="text-xs font-medium">{interview.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock size={14} className="text-primary/70" />
                        <span className="text-xs font-medium">{interview.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin size={14} className="text-primary/70" />
                        <span className="text-xs font-medium">{interview.location}</span>
                    </div>
                </div>

                <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all mt-2">
                    Prep with AI
                </button>
            </div>
        ) : (
            <div className="text-center py-6">
                <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar size={20} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                    No interviews scheduled.
                </p>
                <button 
                    onClick={() => navigate("/tracker")}
                    className="text-primary text-xs font-bold mt-2 hover:underline"
                >
                    Update Tracker
                </button>
            </div>
        )}
    </motion.div>
  );
}
