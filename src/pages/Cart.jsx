import React, { useState, useEffect } from 'react';

import '../assets/styles/Cart.css';
import { FaArrowRight } from 'react-icons/fa';

import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

//https://codesandbox.io/s/react-select-all-checkbox-jbub2?file=/src/index.js

const Cart = () => {
  const userGlobal = useSelector((state) => state.user);
  const cartGlobal = useSelector((state) => state.cart);
  const [cartList, setCartList] = useState([]);
  const [checkoutID, setCheckoutID] = useState([]);
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

  const isCheckAllHandler = (e) => {
    setCheckoutID(cartList.map((cart) => cart.id));
    if (!e.target.checked) {
      setCheckoutID([]);
    }
  };

  const productCheckHandler = (e) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    setCheckoutID([...checkoutID, id]);
    if (!checked) {
      setCheckoutID(checkoutID.filter((productID) => productID !== id));
    }
  };

  const fetchCartData = () => {
    const data = localStorage.getItem('emmerceData');

    if (data) {
      const userData = JSON.parse(data);

      Axios.get(`${API_URL}/carts`, {
        params: {
          userID: userData.id,
        },
      })
        .then((response) => {
          setCartList(response.data);
        })
        .catch(() => {
          notify('fail', 'Unable to get cart data!');
        });
    } else {
      notify('fail', 'Please sign in to see your cart!');
    }
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

  const dispatch = useDispatch();
  const deleteBtnHandler = (cartID) => {
    Axios.delete(`${API_URL}/carts/${cartID}`)
      .then(() => {
        const data = localStorage.getItem('emmerceData');
        const userData = JSON.parse(data);
        if (data) {
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
            })
            .catch(() => {
              notify('fail', 'Unable to update cart data!');
            });
        }
      })
      .catch(() => {
        notify('fail', 'Failed to delete product from your cart!');
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
              checked={checkoutID.includes(cart.id)}
              onChange={productCheckHandler}
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
                <text>{cart.productQty}</text>
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
                disabled={checkoutID.includes(cart.id)}
              >
                Remove Item
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  const renderTotal = () => {
    const productToRender = [];

    checkoutID.forEach((id) => {
      productToRender.push(cartList.find((item) => item.id === id));
    });

    let total = 0;

    productToRender.forEach((item) => {
      total += item.productPrice * item.productQty;
    });

    return total;
  };

  const renderCartDetails = () => {
    const productToRender = checkoutID.map((id) => {
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

  useEffect(() => {
    fetchCartData();
  }, [cartGlobal.cartList]);

  return (
    <div className="container">
      <div className="cart-page-header">
        <text className="cart-header">Your Cart</text>
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
                <input type="checkbox" onChange={isCheckAllHandler} checked={checkoutID.length === cartList.length} id="select-all" />
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
                {checkoutID.length ? renderCartDetails() : <text className="mx-2">Please select item(s) from your cart</text>}
              </div>
              <div className="cart-transaction-quantity-container bigger">
                <div className="q2">
                  <text>Total:</text>
                </div>
                <div className="q2 total">
                  <text>{checkoutID.length ? `Rp. ${renderTotal().toLocaleString()}` : `-`}</text>
                </div>
              </div>
            </div>
          </div>
          <div className="proceed-checkout-container">
            <button
              className="proceed-checkout-button"
              disabled={!checkoutID.length}
              onClick={() => {
                navigate('/Checkout', { state: { checkout_data: checkoutID } });
              }}
              style={{ cursor: checkoutID.length ? 'pointer' : 'not-allowed' }}
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
