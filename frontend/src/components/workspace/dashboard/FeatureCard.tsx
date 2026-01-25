import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
}

export default function FeatureCard({ title, description, path, icon: Icon }: FeatureCardProps) {
  const navigate = useNavigate();

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={item}
      onClick={() => navigate(path)}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer glass p-10 rounded-[2.5rem] transition-all relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 border border-white/5"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-[80px] group-hover:bg-primary/10 transition-all duration-700" />
      
      <div className="flex flex-col h-full relative z-10">
        <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 shadow-inner border border-white/5">
            <Icon className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
        </div>

        <h2 className="text-3xl font-black text-foreground mb-4 tracking-tighter leading-none group-hover:text-primary transition-colors">
            {title}
        </h2>

        <p className="text-muted-foreground text-sm leading-relaxed mb-10 font-bold opacity-80">
            {description}
        </p>

        <div className="mt-auto flex items-center gap-3 text-primary text-xs font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
            Activate Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
