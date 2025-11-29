import FeatureCard from "./FeatureCard";

export default function FeatureGrid({ cards }: { cards: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
      {cards.map((card) => (
        <FeatureCard key={card.id} {...card} />
      ))}
    </div>
  );
}
