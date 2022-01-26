import React, { useEffect, useState } from 'react';
import '../assets/styles/Checkout.css';
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcApplePay,
  FaCcPaypal,
  FaGooglePay,
  FaBitcoin,
  FaEthereum,
  FaCcJcb,
  FaDhl,
  FaFedex,
  FaUsps,
} from 'react-icons/fa';
import { SiUps } from 'react-icons/si';
import { GiDeliveryDrone } from 'react-icons/gi';

import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useSelector, useDispatch } from 'react-redux';

const Checkout = () => {
  const { state } = useLocation();
  const d = new Date();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartGlobal = useSelector((state) => state.cart);
  const userGlobal = useSelector((state) => state.user);
  const [checkoutData, setCheckoutData] = useState([]);
  const [thankyouMsg, setThankyouMsg] = useState(false);
  const [checkoutState, setCheckoutState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    telephone: '',
    paymentMethod: '',
    deliveryOpt: '',
    totalPayment: 0,
  });
  const [errorFirstName, setErrorFirstName] = useState('');
  const [errorLastName, setErrorLastName] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorAddress, setErrorAddress] = useState('');
  const [errorTelephone, setErrorTelephone] = useState('');
  const [errorDeliveryOpt, setErrorDeliveryOpt] = useState('');
  const [errorPaymentMethod, setErrorPaymentMethod] = useState('');
  const [errorTotalPayment, setErrorTotalPayment] = useState('');

  const eventHandler = (e) => {
    const name = e.target.name;
    const val = e.target.value;

    setCheckoutState({
      ...checkoutState,
      [name]: val,
    });
  };

  const fetchCheckoutData = () => {
    const fetchedData = state.checkout_data.map((data) => {
      return cartGlobal.cartList.find((item) => item.id === data);
    });

    setCheckoutData(fetchedData);
  };

  const renderCheckoutData = () => {
    return checkoutData.map((data, index) => {
      return (
        <div className="content-detail-items-container">
          <div>
            <span>
              {index + 1}. {data.productName}
            </span>
          </div>
          <div className="content-details-text-container">
            <div className="item-details-subtext">
              <span>Qty:</span>
            </div>
            <span className="ms-auto">{data.productQty}</span>
          </div>
          <div className="content-details-text-container">
            <div className="item-details-subtext">
              <span>Price:</span>
            </div>
            <span className="ms-auto">Rp. {data.productPrice.toLocaleString()}</span>
          </div>
          <div className="content-details-text-container bottom-divider">
            <div className="item-details-subtext mb-2">
              <span>Subtotal:</span>
            </div>
            <span className="ms-auto">Rp. {(data.productQty * data.productPrice).toLocaleString()}</span>
          </div>
        </div>
      );
    });
  };

  const renderTotal = () => {
    let sum = 0;

    checkoutData.forEach((data) => {
      sum += data.productPrice * data.productQty;
    });

    return sum;
  };

  const renderTax = () => {
    return renderTotal() * 0.05;
  };

  const renderShippingCost = () => {
    return renderTotal() * 0.03;
  };

  const renderGrandTotal = () => {
    if (renderTotal() > 10000000) {
      return renderTotal() + renderTax();
    } else {
      return renderTotal() + renderTax() + renderShippingCost();
    }
  };

  const checkoutBtnHandler = () => {
    if (!checkoutState.firstName) {
      setErrorFirstName('This field is required');
    } else if (!checkoutState.lastName) {
      setErrorLastName('This field is required');
    } else if (!checkoutState.email) {
      setErrorEmail('This field is required');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(checkoutState.email)) {
      setErrorEmail('Please use a vaild email address');
    } else if (!checkoutState.address) {
      setErrorAddress('This field is required');
    } else if (!checkoutState.telephone) {
      setErrorTelephone('This field is required');
    } else if (!checkoutState.paymentMethod) {
      setErrorPaymentMethod('This field is required');
    } else if (!checkoutState.deliveryOpt) {
      setErrorDeliveryOpt('This field is required');
    } else if (checkoutState.totalPayment < renderGrandTotal()) {
      setErrorTotalPayment('Please put a sufficient amount!');
    } else {
      Axios.post(`${API_URL}/transactions`, {
        userID: userGlobal.id,
        transactionDate: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDay() + 1}--${d.getHours()}:${d.getMinutes()}.${d.getSeconds()}`,
        transactionYear: d.getFullYear(),
        transactionMonth: d.getMonth() + 1,
        firstName: checkoutState.firstName,
        lastName: checkoutState.lastName,
        email: checkoutState.email,
        address: checkoutState.address,
        telephone: checkoutState.telephone,
        paymentMethod: checkoutState.paymentMethod,
        deliveryOpt: checkoutState.deliveryOpt,
        transactionItems: checkoutData,
        totalPrice: renderGrandTotal(),
        totalPayment: parseInt(checkoutState.totalPayment),
      })
        .then(() => {
          const endpoints = state.checkout_data.map((data) => {
            return Axios.delete(`${API_URL}/carts/${data}`);
          });
          Axios.all(endpoints)
            .then(() => {
              Axios.get(`${API_URL}/carts`, {
                params: {
                  userID: userGlobal.id,
                },
              })
                .then((response) => {
                  dispatch({
                    type: 'FILL_CART',
                    payload: response.data,
                  });
                  setThankyouMsg(true);
                  setTimeout(() => {
                    navigate(`/`, { replace: true });
                  }, 5000);
                })
                .catch(() => {
                  alert('Unable to get update cart data!');
                });
            })
            .catch(() => {
              alert('Unable to clear cart');
            });
        })
        .catch(() => {
          alert('Unable to process transaction');
        });
    }
  };

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  return (
    <div className="checkout-page-body">
      {thankyouMsg ? (
        <div className="thankyou-container">
          <div className="thankyou-message-container">
            <span className="thankyou">Thankyou for shopping at ULTIMA STORE! :)</span>
            <span className="thankyou-subtext">You will be redirected shortly . .</span>
          </div>
        </div>
      ) : (
        <div className="checkout-page-container">
          <div className="checkout-page-header-container">
            <span className="checkout-page-header">Checkout</span>
          </div>
          <div className="checkout-page-content-container">
            <div className="checkout-page-content-form-container">
              <div className="checkout-page-content-headers left">
                <span>Shipping Info</span>
              </div>
              <div className="checkout-billinginfo-container">
                <div className="bill-info-input-container">
                  <label htmlFor="firstName">First Name:</label>
                  <input id="firstName" name="firstName" type="text" onChange={eventHandler} />
                  {errorFirstName ? <div className="input-error-container">{errorFirstName}</div> : null}
                </div>
                <div className="bill-info-input-container">
                  <label htmlFor="lastName">Last Name:</label>
                  <input id="lastName" name="lastName" type="text" onChange={eventHandler} />
                  {errorLastName ? <div className="input-error-container">{errorLastName}</div> : null}
                </div>
                <div className="bill-info-input-container">
                  <label htmlFor="email">Email:</label>
                  <input id="email" name="email" type="text" onChange={eventHandler} />
                  {errorEmail ? <div className="input-error-container">{errorEmail}</div> : null}
                </div>
                <div className="bill-info-input-container">
                  <label htmlFor="email">Address:</label>
                  <input id="address" name="address" type="text" onChange={eventHandler} />
                  {errorAddress ? <div className="input-error-container">{errorAddress}</div> : null}
                </div>
                <div className="bill-info-input-container">
                  <label htmlFor="telephone">Telephone:</label>
                  <input id="telephone" name="telephone" type="tel" onChange={eventHandler} />
                  {errorTelephone ? <div className="input-error-container">{errorTelephone}</div> : null}
                </div>
                <div className="bill-info-bottom-select-container">
                  <div className="bill-info-payment-container">
                    <label htmlFor="paymentMethod">Payment Method:</label>
                    <select id="paymentMethod" name="paymentMethod" type="select" onChange={eventHandler}>
                      <option value="">Choose Payment Method</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="visa">Visa</option>
                      <option value="mastercard">MasterCard</option>
                      <option value="jcb">JCB</option>
                      <option value="paypal">PayPal</option>
                      <option value="applepay">Apple Pay</option>
                      <option value="googlepay">Google Pay</option>
                      <option value="btc">Bitcoin</option>
                      <option value="eth">Ethereum</option>
                    </select>
                    {errorPaymentMethod ? <div className="input-error-container">{errorPaymentMethod}</div> : null}
                  </div>
                  <div className="bill-info-payment-container">
                    <label htmlFor="deliveryOpt">Delivery Options:</label>
                    <select id="deliveryOpt" name="deliveryOpt" type="select" onChange={eventHandler}>
                      <option value="">Choose Delivery Option</option>
                      <option value="dhl">DHL</option>
                      <option value="ups">UPS</option>
                      <option value="fedex">FedEx</option>
                      <option value="usps">USPS</option>
                      <option value="drone">Drone (Experimental)</option>
                    </select>
                    {errorDeliveryOpt ? <div className="input-error-container">{errorDeliveryOpt}</div> : null}
                  </div>
                </div>
                <div className="logo-container">
                  <div className="logo-container-1">
                    <FaCcVisa />
                    <FaCcMastercard />
                    <FaCcJcb />
                    <FaCcPaypal />
                    <FaCcApplePay />
                    <FaGooglePay />
                    <FaBitcoin />
                    <FaEthereum />
                  </div>
                  <div className="logo-container-2">
                    <FaDhl />
                    <FaFedex />
                    <SiUps />
                    <FaUsps />
                    <GiDeliveryDrone />
                  </div>
                </div>
                <div className="bill-info-bottom-divider" />
                <div className="payment-amount-container">
                  <div className="payment-amount upper">
                    <span className="subtext-amount">Order Total:</span>
                    <strong>Rp. {renderGrandTotal().toLocaleString()}</strong>
                  </div>
                  <div className="payment-amount">
                    <label htmlFor="totalPayment" className="subtext-amount">
                      Enter Amount:
                    </label>
                    <input id="totalPayment" name="totalPayment" type="number" onChange={eventHandler} />
                  </div>
                  {errorTotalPayment ? <div className="amount-error-container">{errorTotalPayment}</div> : null}
                </div>
                <div className="checkout-button-container">
                  <button onClick={checkoutBtnHandler}>Checkout</button>
                </div>
              </div>
            </div>
            <div className="checkout-page-content-details-container">
              <div className="checkout-page-content-headers right">
                <span>Order Summary</span>
              </div>
              <div className="content-details-container">
                {renderCheckoutData()}
                <div className="content-details-total-container">
                  <div className="content-details-total">
                    <div className="content-details-total-subtext">
                      <span>Total:</span>
                    </div>
                    <span className="ms-auto">Rp. {renderTotal().toLocaleString()}</span>
                  </div>
                  <div className="content-details-total">
                    <div className="content-details-total-subtext">
                      <span>Sales Tax (5%):</span>
                    </div>
                    <span className="ms-auto">Rp. {renderTax().toLocaleString()}</span>
                  </div>
                  <div className="content-details-total">
                    <div className="content-details-total-subtext">
                      <span>Shipping Cost:</span>
                    </div>
                    <span className="ms-auto">{renderTotal() > 10000000 ? `Free` : `Rp. ${renderShippingCost().toLocaleString()}`}</span>
                  </div>
                  <div className="content-details-total">
                    <div className="content-details-total-subtext">
                      <span>Grand Total:</span>
                    </div>
                    <span className="ms-auto">Rp. {renderGrandTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
