import React from 'react';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, onLogout  }) => {
  return (
    <div className="layout">
      <Header onLogout={onLogout} />
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;