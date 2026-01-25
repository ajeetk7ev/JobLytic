import Sidebar from '@/components/workspace/Sidebar'; 
import { Outlet } from 'react-router-dom';
import { useSidebarCollapsedStore } from '@/store/sidebarCollapsedStore';
import { useEffect, useState } from 'react';
import WorkSpaceNavbar from '@/components/workspace/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

function WorkSpace() {
  const { collapsed, setCollapsed } = useSidebarCollapsedStore();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if(isDesktop){
      setCollapsed(false);
    } else{
      setCollapsed(true);
    }
  }, [isDesktop, setCollapsed])

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-500">
       <WorkSpaceNavbar/>
      
      <Sidebar />

      <main
        className="flex-1 overflow-y-auto overflow-x-hidden pt-20 px-4 sm:px-8 pb-10 transition-all duration-300"
        style={{
          marginLeft: isDesktop ? (collapsed ? '80px' : '256px') : '0',
        }}
      >
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Outlet />
            </motion.div>
        </div>
      </main>
    </div>
  );
}

export default WorkSpace;
