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
import { IoMdClose, IoMdCheckmark } from 'react-icons/io';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const Checkout = () => {
  const userData = JSON.parse(localStorage.getItem('emmerceData'));
  const d = new Date();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [checkoutItemID, setCheckoutItemID] = useState([]);
  const [cartData, setCartData] = useState([]);
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
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorAddress, setErrorAddress] = useState(false);
  const [errorTelephone, setErrorTelephone] = useState(false);
  const [errorDeliveryOpt, setErrorDeliveryOpt] = useState(false);
  const [errorPaymentMethod, setErrorPaymentMethod] = useState(false);
  const [errorTotalPayment, setErrorTotalPayment] = useState(false);

  const eventHandler = (e) => {
    const name = e.target.name;
    const val = e.target.value;

    setCheckoutState({
      ...checkoutState,
      [name]: val,
    });
  };

  const fetchCheckoutData = () => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userID: userData.id,
      },
    })
      .then((response) => {
        setCartData(response.data);
        Axios.get(`${API_URL}/users`, {
          params: {
            id: userData.id,
          },
        })
          .then((response) => {
            setCheckoutItemID(response.data[0].checkoutItems);
          })
          .catch(() => {
            toast.error('Unable to get user data to fill checkout items', { position: 'bottom-left', theme: 'colored' });
          });
      })
      .catch(() => {
        toast.error('Unable to get user cart data!', { position: 'bottom-left', theme: 'colored' });
      });
  };

  const renderCheckoutData = () => {
    const dataToRender = checkoutItemID.map((id) => {
      return cartData.find((cart) => cart.id === id);
    });

    return dataToRender.map((data, index) => {
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

    const dataToRender = checkoutItemID.map((id) => {
      return cartData.find((cart) => cart.id === id);
    });

    dataToRender.forEach((data) => {
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

  const errClear = () => {
    setErrorFirstName(false);
    setErrorLastName(false);
    setErrorEmail(false);
    setErrorAddress(false);
    setErrorTelephone(false);
    setErrorPaymentMethod(false);
    setErrorDeliveryOpt(false);
    setErrorTotalPayment(false);
  };

  const validator = () => {
    if (!checkoutState.firstName) {
      setErrorFirstName(true);
    }

    if (!checkoutState.lastName) {
      setErrorLastName(true);
    }

    if (!checkoutState.email) {
      setErrorEmail(true);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(checkoutState.email)) {
      setErrorEmail(true);
    }

    if (!checkoutState.address) {
      setErrorAddress(true);
    }

    if (!checkoutState.telephone) {
      setErrorTelephone(true);
    }

    if (!checkoutState.paymentMethod) {
      setErrorPaymentMethod(true);
    }

    if (!checkoutState.deliveryOpt) {
      setErrorDeliveryOpt(true);
    }

    if (checkoutState.totalPayment < renderGrandTotal()) {
      setErrorTotalPayment(true);
    }
  };

  const checkoutBtnHandler = () => {
    const checkoutItemsList = checkoutItemID.map((id) => {
      return cartData.find((cart) => cart.id === id);
    });

    if (!checkoutState.firstName || errorFirstName) {
      return;
    } else if (!checkoutState.lastName || errorLastName) {
      return;
    } else if (!checkoutState.email || errorEmail) {
      return;
    } else if (!checkoutState.address || errorAddress) {
      return;
    } else if (!checkoutState.telephone || errorTelephone) {
      return;
    } else if (!checkoutState.paymentMethod || errorPaymentMethod) {
      return;
    } else if (!checkoutState.deliveryOpt || errorDeliveryOpt) {
      return;
    } else if (checkoutState.totalPayment < renderGrandTotal() || errorTotalPayment) {
      return;
    } else {
      Axios.post(`${API_URL}/transactions`, {
        userID: userData.id,
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
        transactionItems: checkoutItemsList,
        totalPrice: renderGrandTotal(),
        totalPayment: parseInt(checkoutState.totalPayment),
      })
        .then(() => {
          const endpoints = checkoutItemID.map((data) => {
            return Axios.delete(`${API_URL}/carts/${data}`);
          });
          Axios.all(endpoints)
            .then(() => {
              Axios.get(`${API_URL}/users`, {
                params: {
                  id: userData.id,
                },
              }).then((response) => {
                Axios.patch(`${API_URL}/users/${response.data[0].id}`, {
                  checkoutItems: [],
                })
                  .then(() => {
                    Axios.get(`${API_URL}/carts`, {
                      params: {
                        userID: userData.id,
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
                    alert('Unable to clear user checkout items!');
                  });
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

  const cancelHandler = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <span>Are you sure you want to cancel this transaction?</span>
            <div className="close-button-container">
              <button className="close-button" onClick={onClose}>
                <IoMdClose />
              </button>
              <button
                onClick={() => {
                  Axios.patch(`${API_URL}/users/${userData.id}`, {
                    checkoutItems: [],
                  })
                    .then(() => {
                      navigate(-1, { replace: true });
                      onClose();
                    })
                    .catch(() => {
                      toast.error('Unable to cancel this transaction', { position: 'bottom-left', theme: 'colored' });
                    });
                }}
                className="check-button"
              >
                <IoMdCheckmark />
              </button>
            </div>
          </div>
        );
      },
    });
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
                  {errorFirstName ? <div className="input-error-container">This field is required</div> : null}
                </div>
                <div className="bill-info-input-container">
                  <label htmlFor="lastName">Last Name:</label>
                  <input id="lastName" name="lastName" type="text" onChange={eventHandler} />
                  {errorLastName ? <div className="input-error-container">This field is required</div> : null}
                </div>
                <div className="bill-info-input-container">
                  <label htmlFor="email">Email:</label>
                  <input id="email" name="email" type="text" onChange={eventHandler} />
                  {errorEmail ? <div className="input-error-container">This field is required</div> : null}
                </div>
                <div className="bill-info-input-container">
                  <label htmlFor="email">Address:</label>
                  <input id="address" name="address" type="text" onChange={eventHandler} />
                  {errorAddress ? <div className="input-error-container">This field is required</div> : null}
                </div>
                <div className="bill-info-input-container">
                  <label htmlFor="telephone">Telephone:</label>
                  <input id="telephone" name="telephone" type="tel" onChange={eventHandler} />
                  {errorTelephone ? <div className="input-error-container">This field is required</div> : null}
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
                    {errorPaymentMethod ? <div className="input-error-container">This field is required</div> : null}
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
                    {errorDeliveryOpt ? <div className="input-error-container">This field is required</div> : null}
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
                  {errorTotalPayment ? <div className="amount-error-container">Please put a sufficient amount!</div> : null}
                </div>
                <div className="checkout-button-container">
                  <button
                    onClick={() => {
                      errClear();
                      validator();
                      checkoutBtnHandler();
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
              <div className="cancel-checkout-container">
                <span onClick={cancelHandler}>Cancel this Transaction</span>
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
