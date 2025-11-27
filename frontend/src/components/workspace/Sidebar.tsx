import SidebarLink from "./SidebarLink";
import { sidebarLinks } from "@/data/sidebar";
import { useSidebarCollapsedStore } from "@/store/sidebarCollapsedStore";
import { useEffect } from "react";
import type { SidebarLinkTypes } from "@/types/sidebarLink";

const Sidebar = () => {
  const { collapsed, setCollapsed } = useSidebarCollapsedStore();

  // Auto collapse behavior
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
    <>
      <aside
       className={`flex flex-col ${
    collapsed ? "w-20" : "w-64"
  } min-h-screen bg-gray-900 border-r border-gray-800 
     transition-all duration-300 fixed top-16 left-0`}
      >
        {/* Links */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link: SidebarLinkTypes) => (
            <SidebarLink
              key={link.id}
              name={link.name}
              path={link.path}
              icon={link.icon}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
