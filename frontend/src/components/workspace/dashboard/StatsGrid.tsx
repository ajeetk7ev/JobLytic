import StatsCard from "./StatsCard";

export default function StatsGrid({ stats }: { stats: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
      {stats.map((s) => (
        <StatsCard key={s.id} {...s} />
      ))}
    </div>
  );
}
