import React, { useState, useEffect } from 'react';
import '../assets/styles/AdminMain.css';

import Axios from 'axios';
import { API_URL } from '../assets/constants';

const AdminMain = () => {
  const d = new Date();
  const [transactionsList, setTransactionsList] = useState([]);
  const [usersList, setUserList] = useState([]);

  const fetchDashboardData = () => {
    Axios.get(`${API_URL}/transactions`)
      .then((response) => {
        setTransactionsList(response.data);

        Axios.get(`${API_URL}/users`)
          .then((response) => {
            setUserList(response.data);
          })
          .catch(() => {
            alert('Unable to get users data!');
          });
      })
      .catch(() => {
        alert('Unable to get transactions data!');
      });
  };

  const renderTransactionsMonthly = () => {
    const currentMonth = d.getMonth() + 1;

    const transactionToSum = transactionsList.filter((transaction) => {
      return transaction.transactionMonth === currentMonth;
    });

    let sums = 0;

    transactionToSum.forEach((transaction) => {
      sums += transaction.totalPrice;
    });

    return (sums / 1000000).toFixed(2);
  };

  const renderTransactionsDaily = () => {
    const currentDate = d.getDate();

    const transactionToSum = transactionsList.filter((transaction) => {
      return transaction.transactionDate === currentDate;
    });

    let sums = 0;

    transactionToSum.forEach((transaction) => {
      sums += transaction.totalPrice;
    });

    return (sums / 1000000).toFixed(2);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-main-body">
      <div className="dashboard-main-header">
        <span>Dashboard</span>
      </div>
      <div className="dashboard-content-main-container">
        <div className="dashboard-summary-container">
          <div className="figure-container monthly">
            <span className="figure-subtext">Monthly Sales:</span>
            <span>IDR. {renderTransactionsMonthly()}mil</span>
          </div>
          <div className="figure-container daily">
            <span className="figure-subtext">Daily Sales:</span>
            <span>IDR. {renderTransactionsDaily()}mil</span>
          </div>
          <div className="figure-container regusers">
            <span className="figure-subtext">Registered Users:</span>
            <span>{usersList.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
