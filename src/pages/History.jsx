import React, { useState, useEffect } from 'react';
import '../assets/styles/History.css';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { IoMdClose, IoMdCheckmark } from 'react-icons/io';

import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const userData = JSON.parse(localStorage.getItem('emmerceData'));
  const navigate = useNavigate();
  const [transactionsList, setTransactionsList] = useState([]);

  const fetchTransactionsData = () => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        userID: userData.id,
      },
    })
      .then((response) => {
        setTransactionsList(response.data);
      })
      .catch(() => {
        toast.warn('Unable to get transactions data', { position: 'bottom-left', theme: 'colored' });
      });
  };

  useEffect(() => {
    fetchTransactionsData();
  }, []);

  const renderTransactionsData = () => {
    return transactionsList.reverse().map((transaction) => {
      const renderTransactionItems = () => {
        return transaction.transactionItems.map((item, index) => {
          return (
            <div className="user-history-items-container" key={item.id}>
              <div className="user-history-items-number-container">
                <span>{index + 1}.</span>
              </div>
              <div className="user-history-items-name-container">
                <span>{item.productName}</span>
              </div>
              <div className="user-history-items-image-container">
                <div className="history-image-container">
                  <img src={item.productImage} />
                </div>
              </div>
              <div className="user-history-items-price-container">
                <span className="subtext-price">Price:</span>
                <span>Rp. {item.productPrice.toLocaleString('id')}</span>
              </div>
              <div className="user-history-items-quantity-container">
                <span className="subtext-qty">Qty:</span>
                <span>{item.productQty}</span>
              </div>
              <div className="user-history-items-total-container">
                <span className="subtext-total">Total:</span>
                <span>Rp. {(item.productPrice * item.productQty).toLocaleString('id')}</span>
              </div>
            </div>
          );
        });
      };

      const buyAgainPrompt = () => {
        confirmAlert({
          customUI: ({ onClose }) => {
            const renderBuyLinks = () => {
              return transaction.transactionItems.map((item) => {
                return (
                  <div
                    className="buy-item-links-container"
                    onClick={() => {
                      navigate(`/ProductDetails/${item.productID}`);
                      onClose();
                    }}
                  >
                    <div className="buy-item-image-container">
                      <div className="buy-image-container">
                        <img src={item.productImage} />
                      </div>
                    </div>
                    <div className="buy-item-links-name-container">
                      <span>{item.productName}</span>
                    </div>
                  </div>
                );
              });
            };

            return (
              <div className="buy-again-ui">
                <span className="buy-again-header">Which item would you like to buy again?</span>
                <div className="buy-again-links-container">{renderBuyLinks()}</div>
                <div className="cancel-button-container">
                  <button className="cancel-button" onClick={onClose}>
                    Cancel
                  </button>
                </div>
              </div>
            );
          },
        });
      };

      return (
        <div className="user-history-details-container" key={transaction.id}>
          <div className="user-history-details-header">
            <span style={{ marginRight: '0.3rem' }}>Date:</span>
            <span>
              {transaction.transactionYear}-{transaction.transactionMonth}-{transaction.transactionDate} - {transaction.transactionTime}
            </span>
          </div>
          <div className="user-history-details-content-container">
            {renderTransactionItems()}
            <div className="details-divider" />
            <div className="user-history-total-container">
              <span>Total:</span>
              <span className="total-subtext">Rp. {transaction.orderTotal.toLocaleString('id')}</span>
            </div>
            <div className="user-history-total-container">
              <span>Sales Tax (5%):</span>
              <span className="total-subtext">Rp. {transaction.orderTax.toLocaleString('id')}</span>
            </div>
            <div className="user-history-total-container">
              <span>Shipping Cost:</span>
              <span className="total-subtext">
                {isNaN(transaction.orderShippingCost)
                  ? transaction.orderShippingCost
                  : `Rp. ${transaction.orderShippingCost.toLocaleString('id')}`}
              </span>
            </div>
            <div className="user-history-total-container">
              <span>Grand Total:</span>
              <span className="total-subtext">Rp. {transaction.totalPrice.toLocaleString('id')}</span>
            </div>
          </div>
          <div className="user-history-button-container">
            <button
              onClick={() => {
                if (transaction.transactionItems.length > 1) {
                  buyAgainPrompt();
                } else {
                  navigate(`/ProductDetails/${transaction.transactionItems[0].productID}`);
                }
              }}
            >
              Buy Again
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="user-history-page-body">
      <div className="user-history-page-header-container">
        <span>Transactions History</span>
      </div>
      <div className="user-history-page-content-container">
        {transactionsList.length ? (
          renderTransactionsData()
        ) : (
          <div className="empty-history-header-container">
            <span>You don't have any transactions history..</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
