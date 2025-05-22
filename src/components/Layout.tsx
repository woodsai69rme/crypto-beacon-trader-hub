
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 ml-16 md:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

export default Layout;
