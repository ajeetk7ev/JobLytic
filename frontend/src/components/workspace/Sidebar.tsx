import SidebarLink from "./SidebarLink";
import { sidebarLinks } from "@/data/sidebar";
import { useSidebarCollapsedStore } from "@/store/sidebarCollapsedStore";
import { useEffect } from "react";
import type { SidebarLinkTypes } from "@/types/sidebarLink";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { collapsed, setCollapsed } = useSidebarCollapsedStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setCollapsed(true);
      else setCollapsed(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      className="flex flex-col min-h-screen glass border-r border-border/50 
                 fixed top-0 left-0 z-40 pt-16"
    >
      <div className="flex-1 px-4 py-8 space-y-4 overflow-y-auto">
        <div className="space-y-1">
          {sidebarLinks.map((link: SidebarLinkTypes) => (
            <SidebarLink
              key={link.id}
              name={link.name}
              path={link.path}
              icon={link.icon}
              collapsed={collapsed}
            />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-border/50">
        {!collapsed ? (
            <div className="p-4 bg-primary/10 rounded-2xl">
                <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Pro Tip</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Optimize your resume for specific JD to increase your chances.
                </p>
            </div>
        ) : (
            <div className="flex justify-center">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">!</div>
            </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
