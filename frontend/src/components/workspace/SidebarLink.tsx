import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type SidebarLinkProps = {
  name: string;
  path: string;
  icon: React.ElementType;
  collapsed?: boolean;
};

const SidebarLink = ({ name, path, icon: Icon, collapsed }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 relative group",
        isActive 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
          : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
        collapsed && "px-3 justify-center"
      )}
    >
      <Icon size={20} className={cn("shrink-0", isActive ? "text-primary-foreground" : "text-primary")} />

      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="whitespace-nowrap font-medium text-sm tracking-tight"
        >
          {name}
        </motion.span>
      )}

      {collapsed && !isActive && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
          {name}
        </div>
      )}
    </Link>
  );
};

export default SidebarLink;
