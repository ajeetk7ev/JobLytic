import StatsCard from "./StatsCard";
import { motion } from "framer-motion";

export default function StatsGrid({ stats }: { stats: any[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
    >
      {stats.map((s) => (
        <StatsCard key={s.id} {...s} />
      ))}
    </motion.div>
  );
}
