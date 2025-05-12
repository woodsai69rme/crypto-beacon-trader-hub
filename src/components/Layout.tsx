
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 ml-16 md:ml-64 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
