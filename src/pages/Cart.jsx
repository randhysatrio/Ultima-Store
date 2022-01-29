import React, { useState, useEffect } from 'react';
import '../assets/styles/Cart.css';
import { FaArrowRight } from 'react-icons/fa';
import { FiAlertTriangle } from 'react-icons/fi';

import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import { IoMdClose, IoMdCheckmark } from 'react-icons/io';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

//https://codesandbox.io/s/react-select-all-checkbox-jbub2?file=/src/index.js

const Cart = () => {
  const userData = JSON.parse(localStorage.getItem('emmerceData'));
  const [cartList, setCartList] = useState([]);
  const [initialCheckoutData, setInitialCheckoutData] = useState([]);
  const [toCheckout, setToCheckout] = useState([]);
  const navigate = useNavigate();

  const notify = (val, msg) => {
    if (val === 'ok') {
      toast.warn(msg, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } else {
      toast.error(msg, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  const checkAllHandler = (e) => {
    setToCheckout(cartList.map((cart) => cart.id));
    if (!e.target.checked) {
      setToCheckout([]);
    }
  };

  const productCheckHandler = (e) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);

    setToCheckout([...toCheckout, id]);
    if (!checked) {
      setToCheckout(toCheckout.filter((productID) => productID !== id));
    }
  };

  const fetchCartData = () => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userID: userData.id,
      },
    })
      .then((response) => {
        setCartList(response.data);

        Axios.get(`${API_URL}/users/`, {
          params: {
            id: userData.id,
          },
        })
          .then((response) => {
            setInitialCheckoutData(response.data[0].checkoutItems);
          })
          .catch(() => {
            toast.warn('Unable to get user checkout items data', { position: 'bottom-left', theme: 'colored' });
          });
      })
      .catch(() => {
        toast.warn('Unable to get user cart data!', { position: 'bottom-left', theme: 'colored' });
      });
  };

  const qtyBtnHandler = (val, key) => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        id: key,
      },
    })
      .then((response) => {
        if (val === 'plus') {
          Axios.patch(`${API_URL}/carts/${response.data[0].id}`, {
            productQty: response.data[0].productQty + 1,
          })
            .then(() => {
              fetchCartData();
            })
            .catch(() => {
              notify('fail', 'Unable to add product quantity');
            });
        } else {
          Axios.patch(`${API_URL}/carts/${response.data[0].id}`, {
            productQty: response.data[0].productQty - 1,
          })
            .then(() => {
              fetchCartData();
            })
            .catch(() => {
              notify('fail', 'Unable to add product quantity');
            });
        }
      })
      .catch(() => {
        notify('fail', 'Unable to get product data');
      });
  };

  const inputTypeHandler = (e, val) => {
    const amount = parseInt(e.target.value);
    if (!amount) {
      toast.warn('The minimun quantity you can put is 1', { position: 'bottom-left', theme: 'colored' });
    } else {
      Axios.patch(`${API_URL}/carts/${val}`, {
        productQty: amount,
      })
        .then(() => {
          fetchCartData();
        })
        .catch(() => {
          toast.warn('Unable to update product quantity', { position: 'bottom-left', theme: 'colored' });
        });
    }
  };

  const dispatch = useDispatch();
  const deleteBtnHandler = (cartID) => {
    if (initialCheckoutData.includes(cartID)) {
      toast.warn('This item is currently in checkout, please continue this item checkout process', {
        position: 'bottom-left',
        theme: 'colored',
      });
    } else {
      Axios.delete(`${API_URL}/carts/${cartID}`)
        .then(() => {
          Axios.get(`${API_URL}/carts`, {
            params: {
              userID: userData.id,
            },
          })
            .then((response) => {
              dispatch({
                type: 'REMOVE_CART',
                payload: response.data,
              });
              notify('ok', 'Removed product from your cart!');
              fetchCartData();
            })
            .catch(() => {
              notify('fail', 'Unable to update cart data!');
            });
        })
        .catch(() => {
          notify('fail', 'Failed to delete product from your cart!');
        });
    }
  };

  const proceedCheckoutHandler = () => {
    Axios.patch(`${API_URL}/users/${userData.id}`, {
      checkoutItems: toCheckout,
    })
      .then(() => {
        navigate('/Checkout');
      })
      .catch(() => {
        toast.error('Unable to proceed to checkout items!', { position: 'bottom-left', theme: 'colored' });
      });
  };

  const continueHandler = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="alert-ui">
            <span>Discard your previous transaction and continue with this one instead?</span>
            <div className="close-button-container">
              <button className="close-button" onClick={onClose}>
                <IoMdClose />
              </button>
              <button
                onClick={() => {
                  proceedCheckoutHandler();
                  onClose();
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

  const renderCart = () => {
    return cartList.map((cart, index) => {
      return (
        <div className="items-cart-container" key={cart.id}>
          <div className="items-container-header">
            <text>Item Details:</text>
            <label htmlFor={cart.id}>Select Item</label>
            <input
              type="checkbox"
              id={cart.id}
              name={cart.productName}
              checked={toCheckout.includes(cart.id)}
              onChange={(e) => {
                productCheckHandler(e);
              }}
            />
          </div>
          <div className="items-container-content">
            <div className="items-content-image-container">
              <text>{index + 1}.</text>
              <div className="image-container">
                <img src={cart.productImage} />
              </div>
            </div>
            <div className="items-content-details-container">
              <text
                className="items-content-name-header"
                onClick={() => {
                  navigate(`/ProductDetails/${cart.productID}`);
                }}
              >
                {cart.productName}
              </text>
              <text>Rp. {cart.productPrice.toLocaleString()}</text>
            </div>
            <div className="items-content-qty-container">
              <button
                onClick={() => {
                  qtyBtnHandler('plus', cart.id);
                }}
              >
                +
              </button>
              <div className="qty-container">
                <input
                  type="text"
                  value={cart.productQty}
                  onChange={(e) => {
                    inputTypeHandler(e, cart.id);
                  }}
                />
              </div>
              <button
                onClick={() => {
                  qtyBtnHandler('min', cart.id);
                }}
                disabled={cart.productQty < 2}
              >
                -
              </button>
            </div>
            <div className="items-content-delete-container">
              <button
                onClick={() => {
                  deleteBtnHandler(cart.id);
                }}
                disabled={toCheckout.includes(cart.id)}
                style={{ cursor: toCheckout.includes(cart.id) ? 'not-allowed' : 'pointer' }}
              >
                Remove Item
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  const renderCartDetails = () => {
    const productToRender = toCheckout.map((id) => {
      return cartList.find((item) => item.id === id);
    });

    return productToRender.map((item, index) => {
      return (
        <div className="cart-transaction-list" key={item.id}>
          <text>
            {index + 1}. {item.productName}
          </text>
          <div className="cart-transaction-quantity-container">
            <div className="q1">
              <text>Qty:</text>
            </div>
            <div className="q2">
              <text>{item.productQty}</text>
            </div>
          </div>
          <div className="cart-transaction-quantity-container">
            <div className="q1">
              <text>Price:</text>
            </div>
            <div className="q2">
              <text>Rp. {item.productPrice.toLocaleString()}</text>
            </div>
          </div>
          <div className="cart-transaction-quantity-container top-border">
            <div className="q1">
              <text>Subtotal:</text>
            </div>
            <div className="q2">
              <text>Rp. {(item.productQty * item.productPrice).toLocaleString()}</text>
            </div>
          </div>
        </div>
      );
    });
  };

  const renderTotal = () => {
    const productToRender = toCheckout.map((id) => {
      return cartList.find((item) => item.id === id);
    });

    let total = 0;

    productToRender.forEach((item) => {
      total += item.productPrice * item.productQty;
    });

    return total;
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  return (
    <div className="container">
      <div className="cart-page-header">
        <text className="cart-header">Your Cart</text>
        {initialCheckoutData.length ? (
          <div className="cart-header-info-container">
            <FiAlertTriangle />
            <span>
              You currently have {initialCheckoutData.length} item(s) in your checkout page. Click{' '}
              <Link to="/Checkout" className="checkout-proceed-link">
                here
              </Link>{' '}
              to continue transaction
            </span>
          </div>
        ) : null}
      </div>
      <div className="row">
        <div className="col-9">
          {cartList.length ? (
            <>
              <div className="cart-header-container">
                <text className="cart-text-header">Item List(s)</text>
                <label htmlFor="select-all" className="cart-text-header select-all">
                  Select All Item(s)
                </label>
                <input type="checkbox" onChange={checkAllHandler} checked={toCheckout.length === cartList.length} id="select-all" />
              </div>
              <div className="cart-items-container">{renderCart()}</div>
            </>
          ) : (
            <div className="empty-cart-content">
              <div className="empty-cart-container">
                <text className="empty-cart-header">Your cart is still empty</text>
              </div>
              <div className="empty-cart-container">
                <text
                  className="empty-cart-link"
                  onClick={() => {
                    navigate('/AllProducts', { state: { passed_key: '' } });
                  }}
                >
                  Browse All Products
                </text>
              </div>
            </div>
          )}
        </div>
        <div className="col-3">
          <div className="cart-header-container-transaction">
            <text className="cart-text-header">Transaction Details</text>
          </div>
          <div className="cart-transaction-details-container">
            <div className="cart-transaction-content-container">
              <div className="cart-transaction-content-header">
                <text>Summary</text>
              </div>
              <div className="cart-transaction-content-body py-2">
                {toCheckout.length ? renderCartDetails() : <text className="mx-2">Please select item(s) from your cart</text>}
              </div>
              <div className="cart-transaction-quantity-container bigger">
                <div className="q2">
                  <text>Total:</text>
                </div>
                <div className="q2 total">
                  <text>{toCheckout.length ? `Rp. ${renderTotal().toLocaleString()}` : `-`}</text>
                </div>
              </div>
            </div>
          </div>
          <div className="proceed-checkout-container">
            {}
            <button
              className="proceed-checkout-button"
              disabled={!toCheckout.length}
              onClick={() => {
                if (initialCheckoutData.length) {
                  continueHandler();
                } else {
                  proceedCheckoutHandler();
                }
              }}
              style={{ cursor: toCheckout.length ? 'pointer' : 'not-allowed' }}
            >
              <div className="proceed-checkout-button-content">
                <span>Proceed to Checkout</span>
                <FaArrowRight />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
