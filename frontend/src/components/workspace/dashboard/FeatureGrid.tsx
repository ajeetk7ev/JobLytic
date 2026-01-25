import FeatureCard from "./FeatureCard";
import { motion } from "framer-motion";

export default function FeatureGrid({ cards }: { cards: any[] }) {
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
        className="grid grid-cols-1 sm:grid-cols-2 gap-8"
    >
      {cards.map((card) => (
        <FeatureCard key={card.id} {...card} />
      ))}
    </motion.div>
  );
}
