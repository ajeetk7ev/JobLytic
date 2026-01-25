import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, Briefcase, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface JobFiltersProps {
  onSearch: (filters: any) => void;
  isLoading: boolean;
}

export default function JobFilters({ onSearch, isLoading }: JobFiltersProps) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    country: "us",
    date_posted: "all",
    employment_types: "",
    work_from_home: false,
    radius: "",
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query, ...filters });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleApply} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by job title, company, or keywords..."
            className="w-full pl-14 pr-6 py-5 bg-secondary/30 border border-border/50 rounded-3xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-background transition-all font-bold text-lg"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`px-8 py-5 rounded-3xl border border-border/50 font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all ${showFilters ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-secondary/30 text-foreground hover:bg-secondary/50'}`}
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
        <button
          type="submit"
          disabled={isLoading || !query}
          className="px-12 py-5 bg-primary text-primary-foreground rounded-3xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Find Jobs"}
        </button>
      </form>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-8 rounded-[2.5rem] border border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <div className="space-y-3">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                <MapPin size={14} /> Country Code
              </label>
              <input
                type="text"
                placeholder="e.g. us, in, uk"
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="w-full px-5 py-3.5 bg-background/50 border border-border/50 rounded-2xl outline-none focus:border-primary font-bold text-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={14} /> Date Posted
              </label>
              <select
                value={filters.date_posted}
                onChange={(e) => setFilters({ ...filters, date_posted: e.target.value })}
                className="w-full px-5 py-3.5 bg-background/50 border border-border/50 rounded-2xl outline-none focus:border-primary font-bold text-sm appearance-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="3days">Last 3 Days</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                <Briefcase size={14} /> Job Type
              </label>
              <select
                value={filters.employment_types}
                onChange={(e) => setFilters({ ...filters, employment_types: e.target.value })}
                className="w-full px-5 py-3.5 bg-background/50 border border-border/50 rounded-2xl outline-none focus:border-primary font-bold text-sm appearance-none cursor-pointer"
              >
                <option value="">Any Type</option>
                <option value="FULLTIME">Full-time</option>
                <option value="CONTRACTOR">Contract</option>
                <option value="PARTTIME">Part-time</option>
                <option value="INTERN">Internship</option>
              </select>
            </div>

            <div className="flex items-center gap-4 mt-8">
               <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.work_from_home}
                    onChange={(e) => setFilters({ ...filters, work_from_home: e.target.checked })}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-secondary/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-sm font-black text-foreground uppercase tracking-widest">Remote </span>
               </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
