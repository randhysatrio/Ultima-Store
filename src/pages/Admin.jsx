import React from 'react';
import '../assets/styles/Admin.css';

import { useNavigate, NavLink, Outlet } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page-container">
      <div className="sidebar-main-container">
        <div className="sidebar-header-container">
          <span>Menu</span>
        </div>
        <NavLink
          to=""
          end
          className={({ isActive }) => {
            return isActive ? 'sidebarLinkActive' : 'sidebarLink';
          }}
        >
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="AdminProductsPage"
          className={({ isActive }) => {
            return isActive ? 'sidebarLinkActive' : 'sidebarLink';
          }}
        >
          Manage Products
        </NavLink>
        <NavLink to="/" className="back-to-home-button">
          Back to Home
        </NavLink>
      </div>
      <div className="admin-outlet-container">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
