import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

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
        "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300",
        "hover:bg-gray-800 hover:text-white transition-all duration-300",
        isActive && "bg-gray-700 text-white",
        collapsed && "px-3 justify-center"
      )}
    >
      <Icon size={20} />

      {/* ANIMATED TEXT */}
      <span
        className={cn(
          "whitespace-nowrap overflow-hidden transition-all duration-300",
          collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
        )}
      >
        {name}
      </span>
    </Link>
  );
};

export default SidebarLink;
