import React from 'react';

import '../assets/styles/AdminMain.css';

const AdminMain = () => {
  return (
    <div className="dashboard-main-body">
      <div className="dashboard-main-header">
        <span>Dashboard</span>
      </div>
      <div className="dashboard-content-main-container">
        <div className="dashboard-summary-container">
          <div className="figure-container monthly">
            <span className="figure-subtext">Monthly Sales:</span>
            <span>IDR. 43mil</span>
          </div>
          <div className="figure-container daily">
            <span className="figure-subtext">Daily Sales:</span>
            <span>IDR. 43mil</span>
          </div>
          <div className="figure-container regusers">
            <span className="figure-subtext">Registered Users:</span>
            <span>1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
