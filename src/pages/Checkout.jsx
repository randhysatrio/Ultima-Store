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
import Switch from 'react-switch';

const Checkout = () => {
  const userData = JSON.parse(localStorage.getItem('emmerceData'));
  const d = new Date();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [checkoutItemID, setCheckoutItemID] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [productCheckoutData, setProductCheckoutData] = useState([]);
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
  const [checkoutPreference, setCheckoutPreference] = useState(false);

  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorEmailInvalid, setErrorEmailInvalid] = useState(false);
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
            if (response.data[0].checkoutDataPref) {
              setCheckoutState({
                ...checkoutState,
                firstName: response.data[0].firstname,
                lastName: response.data[0].lastname,
                email: response.data[0].email,
                address: response.data[0].address,
                telephone: response.data[0].telephone,
              });
            }
            setCheckoutItemID(response.data[0].checkoutItems);

            const endpoints = response.data[0].checkoutItems.map((item) => {
              return Axios.get(`${API_URL}/carts/${item}`);
            });

            Axios.all(endpoints)
              .then((response) => {
                const endpoints = response.map((item) => {
                  return Axios.get(`${API_URL}/products/${item.data.productID}`);
                });

                Axios.all(endpoints)
                  .then((response) => {
                    setProductCheckoutData(response);
                  })
                  .catch(() => {
                    toast.error('Unable to get product checkout data!', { position: 'bottom-left', theme: 'colored' });
                  });
              })
              .catch(() => {
                toast.error('Unable to get product checkout ID data!', { position: 'bottom-left', theme: 'colored' });
              });
          })
          .catch(() => {
            toast.error('Unable to get user checkout items data!', { position: 'bottom-left', theme: 'colored' });
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
            <span className="ms-auto mb-2">Rp. {(data.productQty * data.productPrice).toLocaleString()}</span>
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
    if (renderTotal() > 10000000) {
      return 'Free';
    } else {
      return renderTotal() * 0.03;
    }
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
    setErrorEmailInvalid(false);
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
      setErrorEmailInvalid(true);
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
    errClear();
    validator();

    const checkoutItemsList = checkoutItemID.map((id) => {
      return cartData.find((cart) => cart.id === id);
    });

    const checkoutItemProductIDList = checkoutItemsList.map((item) => {
      return item.productID;
    });

    const checkoutItemQtyList = checkoutItemsList.map((item) => {
      return item.productQty;
    });

    if (!checkoutState.firstName) {
      return;
    } else if (!checkoutState.lastName) {
      return;
    } else if (!checkoutState.email) {
      return;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(checkoutState.email)) {
      return;
    } else if (!checkoutState.address) {
      return;
    } else if (!checkoutState.telephone) {
      return;
    } else if (!checkoutState.paymentMethod) {
      return;
    } else if (!checkoutState.deliveryOpt) {
      return;
    } else if (checkoutState.totalPayment < renderGrandTotal()) {
      return;
    } else {
      Axios.post(`${API_URL}/transactions`, {
        userID: userData.id,
        transactionYear: d.getFullYear(),
        transactionMonth: d.getMonth() + 1,
        transactionDate: d.getDate(),
        transactionTime: `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
        firstName: checkoutState.firstName,
        lastName: checkoutState.lastName,
        email: checkoutState.email,
        address: checkoutState.address,
        telephone: checkoutState.telephone,
        paymentMethod: checkoutState.paymentMethod,
        deliveryOpt: checkoutState.deliveryOpt,
        transactionItems: checkoutItemsList,
        orderTotal: renderTotal(),
        orderTax: renderTax(),
        orderShippingCost: renderShippingCost(),
        totalPrice: renderGrandTotal(),
        totalPayment: parseInt(checkoutState.totalPayment),
      })
        .then(() => {
          const endpoints = checkoutItemID.map((data) => {
            return Axios.delete(`${API_URL}/carts/${data}`);
          });
          Axios.all(endpoints)
            .then(() => {
              const endpoints = checkoutItemProductIDList.map((id, index) => {
                const currentStockAmount = productCheckoutData[index].data.stock - checkoutItemQtyList[index];
                if (!currentStockAmount) {
                  return Axios.patch(`${API_URL}/products/${id}`, {
                    stock: currentStockAmount,
                    available: false,
                  });
                } else {
                  return Axios.patch(`${API_URL}/products/${id}`, {
                    stock: currentStockAmount,
                  });
                }
              });
              Axios.all(endpoints)
                .then(() => {
                  const endpoints = checkoutItemProductIDList.map((id, index) => {
                    return Axios.patch(`${API_URL}/products/${id}`, {
                      sold: productCheckoutData[index].data.sold + checkoutItemQtyList[index],
                    });
                  });
                  Axios.all(endpoints)
                    .then(() => {
                      if (checkoutPreference) {
                        Axios.patch(`${API_URL}/users/${userData.id}`, {
                          telephone: checkoutState.telephone,
                          address: checkoutState.address,
                          checkoutDataPref: checkoutPreference,
                          checkoutItems: [],
                        }).then((response) => {
                          localStorage.setItem('emmerceData', JSON.stringify(response.data));

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
                              document.body.scrollIntoView();
                              setTimeout(() => {
                                navigate(`/`, { replace: true });
                              }, 3000);
                            })
                            .catch(() => {
                              toast.error('Unable to update cart data!', { position: 'bottom-left', theme: 'colored' });
                            });
                        });
                      } else {
                        Axios.patch(`${API_URL}/users/${userData.id}`, {
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
                                document.body.scrollIntoView();
                                setTimeout(() => {
                                  navigate(`/`, { replace: true });
                                }, 4000);
                              })
                              .catch(() => {
                                toast.error('Unable to update cart data!', { position: 'bottom-left', theme: 'colored' });
                              });
                          })
                          .catch(() => {
                            toast.error('Unable to clear user checkout items!', { position: 'bottom-left', theme: 'colored' });
                          });
                      }
                    })
                    .catch(() => {
                      toast.error('Unable to update product sold quantity!', { position: 'bottom-left', theme: 'colored' });
                    });
                })
                .catch(() => {
                  toast.error('Unable to update database product stock!', { position: 'bottom-left', theme: 'colored' });
                });
            })
            .catch(() => {
              toast.error('Unable to remove cart data!', { position: 'bottom-left', theme: 'colored' });
            });
        })
        .catch(() => {
          toast.error('Unable to process transaction', { position: 'bottom-left', theme: 'colored' });
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
                {userData.checkoutDataPref ? null : (
                  <div className="checkout-info-prompt-container">
                    <span>Always use this form as your checkout info?</span>
                    <Switch
                      handleDiameter={18}
                      height={20}
                      width={40}
                      checked={checkoutPreference}
                      onChange={() => {
                        setCheckoutPreference(!checkoutPreference);
                      }}
                    />
                  </div>
                )}

                <div className="bill-info-input-container">
                  <label htmlFor="firstName">First Name:</label>
                  <input id="firstName" name="firstName" type="text" value={checkoutState.firstName} onChange={eventHandler} />
                  {errorFirstName ? <div className="input-error-container">This field is required</div> : null}
                </div>
                <div className="bill-info-input-container">
                  <label htmlFor="lastName">Last Name:</label>
                  <input id="lastName" name="lastName" type="text" value={checkoutState.lastName} onChange={eventHandler} />
                  {errorLastName ? <div className="input-error-container">This field is required</div> : null}
                </div>
                <div className="bill-info-input-container">
                  <label htmlFor="email">Email:</label>
                  <input id="email" name="email" type="text" value={checkoutState.email} onChange={eventHandler} />
                  {errorEmail ? <div className="input-error-container">This field is required</div> : null}
                  {errorEmailInvalid ? <div className="input-error-container">Please use a valid email address</div> : null}
                </div>
                <div className="bill-info-input-container">
                  <label htmlFor="email">Address:</label>
                  <input id="address" name="address" type="text" value={checkoutState.address} onChange={eventHandler} />
                  {errorAddress ? <div className="input-error-container">This field is required</div> : null}
                </div>
                <div className="bill-info-input-container">
                  <label htmlFor="telephone">Telephone:</label>
                  <input id="telephone" name="telephone" type="tel" value={checkoutState.telephone} onChange={eventHandler} />
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
