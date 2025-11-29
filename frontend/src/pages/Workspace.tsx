import Sidebar from '@/components/workspace/Sidebar'; 
import { Outlet } from 'react-router-dom';
import { useSidebarCollapsedStore } from '@/store/sidebarCollapsedStore';
import { useEffect, useState } from 'react';
import WorkSpaceNavbar from '@/components/workspace/Navbar';

function WorkSpace() {
  const { collapsed } = useSidebarCollapsedStore();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
       <WorkSpaceNavbar/>
      <div className="sm:fixed sm:top-0 sm:left-0 sm:bottom-0">
        <Sidebar />
      </div>

      <div
        className="flex-1 overflow-y-auto sm:p-8 pb-20 sm:pb-8 transition-all duration-300"
        style={{
          marginTop:'60px',
          marginLeft: isDesktop ? (collapsed ? '5rem' : '16rem') : '0',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default WorkSpace;


