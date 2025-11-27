import { Menu } from "lucide-react";
import { useSidebarCollapsedStore } from "@/store/sidebarCollapsedStore";
function WorkSpaceNavbar() {
    const { collapsed, setCollapsed } = useSidebarCollapsedStore();
  return (
    <nav className="w-full h-16 px-6 flex items-center justify-between 
                    bg-gray-800 border-b border-gray-700 
                    fixed top-0 left-0 right-0 z-40">

      {/* Left section */}
      <div className="flex items-center gap-3 text-gray-200 font-semibold">
        <Menu className="cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
         size={24} />
        <span className="text-lg tracking-wide">JoblyTics</span>
      </div>

      {/* Right section (profile/settings later) */}
      <div className="text-gray-300">
        {/* placeholder */}
      </div>
    </nav>
  );
}

export default WorkSpaceNavbar;
