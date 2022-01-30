import React from 'react';
import '../assets/styles/UserProfile.css';
import { AiOutlineUser, AiOutlineHistory } from 'react-icons/ai';
import { IoIosReturnLeft } from 'react-icons/io';

import { Outlet, NavLink } from 'react-router-dom';

const UserProfile = () => {
  return (
    <div className="userprofile-body">
      <div className="userprofile-sidebar-container">
        <div className="userprofile-sidebar-header-container">
          <span>Menu</span>
        </div>
        <div className="userprofile-sidebar-links-container">
          <NavLink to="" end className={({ isActive }) => (isActive ? 'sidebar-links-active' : 'sidebar-links')}>
            <AiOutlineUser style={{ marginRight: '0.2rem' }} />
            User Profile
          </NavLink>
          <NavLink
            to="History"
            className="sidebar-links"
            className={({ isActive }) => (isActive ? 'sidebar-links-active' : 'sidebar-links')}
          >
            <AiOutlineHistory style={{ marginRight: '0.2rem' }} />
            History
          </NavLink>
          <NavLink to="/" className="sidebar-links-exit">
            <IoIosReturnLeft style={{ marginRight: '0.2rem' }} />
            Back to Home
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default UserProfile;
