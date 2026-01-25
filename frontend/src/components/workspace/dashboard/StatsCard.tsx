import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export default function StatsCard({ label, value, icon: Icon, color }: StatsCardProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
        variants={item}
        whileHover={{ y: -5 }}
        className="glass p-6 rounded-4xl flex items-center gap-6 hover:bg-white/5 transition-all group cursor-default shadow-xl shadow-black/5"
    >
      <div className={`p-4 rounded-2xl bg-secondary/50 group-hover:bg-background transition-all duration-300 shadow-inner border border-white/5`}>
        <Icon className={`w-7 h-7 ${color} filter drop-shadow-[0_0_8px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform`} />
      </div>
      <div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</p>
        <p className="text-3xl font-black text-foreground mt-1 tracking-tighter">{value}</p>
      </div>
    </motion.div>
  );
}
