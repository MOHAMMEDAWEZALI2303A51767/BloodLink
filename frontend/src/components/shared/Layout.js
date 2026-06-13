import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              {title && <div className="topbar-title">{title}</div>}
              {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
            </div>
          </div>
        </div>
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
