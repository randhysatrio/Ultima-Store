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
import { FcCheckmark } from 'react-icons/fc';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

//https://codesandbox.io/s/react-select-all-checkbox-jbub2?file=/src/index.js

const Cart = () => {
  const userData = JSON.parse(localStorage.getItem('emmerceData'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartList, setCartList] = useState([]);
  const [initialCheckoutData, setInitialCheckoutData] = useState([]);
  const [toCheckout, setToCheckout] = useState([]);
  const [cartItemProductData, setCartItemProductData] = useState([]);
  const [cartItemAvailableStock, setCartItemAvailableStock] = useState([]);
  const [cartItemAvailability, setCartItemAvailability] = useState([]);
  const [checkoutErrorInfo, setCheckoutErrorInfo] = useState(false);

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
        const currentCart = response.data;

        setCartList(currentCart);

        const cartProductID = currentCart.map((data) => {
          return data.productID;
        });

        const endpoints = cartProductID.map((id) => {
          return Axios.get(`${API_URL}/products/${id}`);
        });

        Axios.all(endpoints)
          .then((response) => {
            const cartListProductData = response;

            setCartItemProductData(cartListProductData);

            const currentCartItemStock = cartListProductData.map((item) => {
              return item.data.stock;
            });

            setCartItemAvailableStock(currentCartItemStock);

            const currentCartItemAvailability = cartListProductData.map((item) => {
              return item.data.available;
            });

            setCartItemAvailability(currentCartItemAvailability);

            Axios.get(`${API_URL}/users/`, {
              params: {
                id: userData.id,
              },
            })
              .then((response) => {
                const checkoutItemsID = response.data[0].checkoutItems;

                console.log(checkoutItemsID);

                setInitialCheckoutData(checkoutItemsID);

                if (checkoutItemsID.length) {
                  const checkoutItemsData = cartProductID.map((itemID) => {
                    return currentCart.find((cartItem) => cartItem.productID == itemID);
                  });

                  const checkoutItemsQty = checkoutItemsData.map((item) => {
                    return item.productQty;
                  });

                  const stockComparator = checkoutItemsQty.filter((itemQty, index) => {
                    return itemQty > currentCartItemStock[index];
                  });

                  const checkoutItemsProductData = checkoutItemsID.map((id) => {
                    return currentCart.find((cartItem) => cartItem.id === id);
                  });

                  const checkoutItemsProductID = checkoutItemsData.map((data) => {
                    return data.productID;
                  });

                  const checkoutItemsProductIDData = checkoutItemsProductID.map((id) => {
                    return cartListProductData.find((cartItem) => cartItem.data.id === id);
                  });

                  const checkoutItemsIDAvailability = checkoutItemsProductIDData.filter((itemData) => {
                    return !itemData.data.available;
                  });

                  console.log(checkoutItemsIDAvailability);

                  if (stockComparator.length || checkoutItemsIDAvailability.length) {
                    Axios.patch(`${API_URL}/users/${userData.id}`, {
                      checkoutItems: [],
                    })
                      .then(() => {
                        setInitialCheckoutData([]);
                        setCheckoutErrorInfo(true);
                      })
                      .catch(() => {
                        toast.error('Unable to clear checkout items due to item(s) unavailability', {
                          position: 'bottom-left',
                          theme: 'colored',
                        });
                      });
                  } else {
                    return;
                  }
                }
              })
              .catch(() => {
                toast.warn('Unable to get user checkout items data', { position: 'bottom-left', theme: 'colored' });
              });
          })
          .catch(() => {
            toast.warn('Unable to get cart product data!', { position: 'bottom-left', theme: 'colored' });
          });
      })
      .catch(() => {
        toast.warn('Unable to get user cart data!', { position: 'bottom-left', theme: 'colored' });
      });
  };

  const qtyBtnHandler = (val, cartID, productID, productQty) => {
    Axios.get(`${API_URL}/products`, {
      params: {
        id: productID,
      },
    }).then((response) => {
      const currentStock = response.data[0].stock;
      Axios.get(`${API_URL}/carts`, {
        params: {
          id: cartID,
        },
      })
        .then((response) => {
          if (val === 'plus') {
            const newVal = parseInt(productQty + 1);
            if (newVal <= currentStock) {
              Axios.patch(`${API_URL}/carts/${response.data[0].id}`, {
                productQty: response.data[0].productQty + 1,
              })
                .then(() => {
                  fetchCartData();
                })
                .catch(() => {
                  toast.error('Unable to update this product database quantity!', { position: 'bottom-left', theme: 'colored' });
                });
            } else {
              toast.warn(`Maximum quantity reached!`, {
                position: 'bottom-left',
                theme: 'colored',
              });
            }
          } else {
            const newVal = parseInt(productQty - 1);

            if (newVal < currentStock) {
              setCheckoutErrorInfo(false);
            }
            Axios.patch(`${API_URL}/carts/${response.data[0].id}`, {
              productQty: response.data[0].productQty - 1,
            })
              .then(() => {
                fetchCartData();
              })
              .catch(() => {
                toast.error('Unable to update this product database quantity!', { position: 'bottom-left', theme: 'colored' });
              });
          }
        })
        .catch(() => {
          notify('fail', 'Unable to get product data');
        });
    });
  };

  const inputTypeHandler = (e, cartID, productID) => {
    const amount = parseInt(e.target.value);
    if (amount < 1) {
      toast.warn('The minimun quantity you can put is 1', { position: 'bottom-left', theme: 'colored' });
    } else {
      Axios.get(`${API_URL}/products`, {
        params: {
          id: productID,
        },
      })
        .then((response) => {
          const currentStock = response.data[0].stock;
          if (response.data[0].stock > amount) {
            Axios.patch(`${API_URL}/carts/${cartID}`, {
              productQty: amount,
            })
              .then(() => {
                Axios.patch(`${API_URL}/products/${productID}`, {
                  stock: currentStock - amount,
                });
                fetchCartData();
              })
              .catch(() => {
                toast.warn('Unable to update product quantity', { position: 'bottom-left', theme: 'colored' });
              });
          } else {
            toast.warn(`Cannot go more than the available stock quantity, which is ${response.data[0].stock}`, {
              position: 'bottom-left',
              theme: 'colored',
            });
          }
        })
        .catch(() => {
          toast.error('Unable to get product data to update');
        });
    }
  };

  const deleteBtnHandler = (cartID, productID, productQty) => {
    if (initialCheckoutData.includes(cartID)) {
      toast.warn('This item is currently in checkout, please continue this item checkout process', {
        position: 'bottom-left',
        theme: 'colored',
      });
    } else {
      Axios.get(`${API_URL}/products`, {
        params: {
          id: productID,
        },
      })
        .then((response) => {
          Axios.patch(`${API_URL}/products/${response.data[0].id}`, {
            stock: response.data[0].stock + productQty,
          }).then(() => {
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
          });
        })
        .catch(() => {
          toast.error('Unable to get product data!', { position: 'bottom-left', theme: 'colored' });
        });
    }
  };

  const proceedCheckoutHandler = () => {
    const toCheckoutItemData = toCheckout.map((id) => {
      return cartList.find((cartItem) => {
        return cartItem.id === id;
      });
    });

    console.log(toCheckoutItemData);

    const toCheckoutItemQty = toCheckoutItemData.map((data) => {
      return data.productQty;
    });

    console.log(toCheckoutItemQty);

    const stockComparator = toCheckoutItemQty.filter((qty, index) => {
      return qty > cartItemAvailableStock[index];
    });

    console.log(stockComparator);

    const toCheckoutProductID = toCheckoutItemData.map((data) => {
      return data.productID;
    });

    console.log(toCheckoutProductID);

    const toCheckoutProductData = toCheckoutProductID.map((id, index) => {
      return cartItemProductData.find((item) => {
        return item.data.id === id;
      });
    });

    console.log(toCheckoutProductData);

    const toCheckoutProductAvailability = toCheckoutProductData.filter((item) => {
      return !item.data.available;
    });

    if (stockComparator.length || toCheckoutProductAvailability.length) {
      toast.warn('Please check one or more status of your checkout item(s)!', {
        position: 'bottom-left',
        theme: 'colored',
      });
    } else {
      Axios.patch(`${API_URL}/users/${userData.id}`, {
        checkoutItems: toCheckout,
      })
        .then(() => {
          navigate('/Checkout');
        })
        .catch(() => {
          toast.error('Unable to proceed to checkout page!', { position: 'bottom-left', theme: 'colored' });
        });
    }
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
            <span>Item Details:</span>
            {!cartItemAvailability[index] ? <span className="quantity-error-message">(This item is currently unavailable)</span> : null}
            {cart.productQty > cartItemAvailableStock[index] ? (
              <span className="quantity-error-message">
                (This item quantity exceeded the currently available stock: {cartItemAvailableStock[index]})
              </span>
            ) : null}
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
              <span>{index + 1}.</span>
              <div className="image-container">
                <img src={cart.productImage} />
              </div>
            </div>
            <div className="items-content-details-container">
              <span
                className="items-content-name-header"
                onClick={() => {
                  navigate(`/ProductDetails/${cart.productID}`);
                }}
              >
                {cart.productName}
              </span>
              <span>Rp. {cart.productPrice.toLocaleString()}</span>
            </div>
            <div className="items-content-qty-container">
              <button
                onClick={() => {
                  qtyBtnHandler('plus', cart.id, cart.productID, cart.productQty);
                }}
              >
                +
              </button>
              <div className="qty-container">
                <input
                  type="number"
                  value={cart.productQty}
                  // onKeyDown={(e) => {
                  //   const key = e.key;
                  //   const val = e.target.value;

                  //   if (key === 'Backspace') {
                  //     console.log(`Jam${e.target.value}bu`);
                  //   }
                  // }}
                  onChange={(e) => {
                    inputTypeHandler(e, cart.id, cart.productID);
                  }}
                />
              </div>
              <button
                onClick={() => {
                  qtyBtnHandler('min', cart.id, cart.productID);
                }}
                disabled={cart.productQty < 2}
              >
                -
              </button>
            </div>
            <div className="items-content-delete-container">
              <button
                onClick={() => {
                  deleteBtnHandler(cart.id, cart.productID, cart.productQty);
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
          <span>
            {index + 1}. {item.productName}
          </span>
          <div className="cart-transaction-quantity-container">
            <div className="q1">
              <span>Qty:</span>
            </div>
            <div className="q2">
              <span>{item.productQty}</span>
            </div>
          </div>
          <div className="cart-transaction-quantity-container">
            <div className="q1">
              <span>Price:</span>
            </div>
            <div className="q2">
              <span>Rp. {item.productPrice.toLocaleString()}</span>
            </div>
          </div>
          <div className="cart-transaction-quantity-container top-border">
            <div className="q1">
              <span>Subtotal:</span>
            </div>
            <div className="q2">
              <span>Rp. {(item.productQty * item.productPrice).toLocaleString()}</span>
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

  console.log(cartItemProductData);

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
        {checkoutErrorInfo ? (
          <div className="cart-header-info-container-error">
            <FiAlertTriangle />
            <span className="error-subtext">
              We couldn't continue your previous checkout process due to one or more item(s) unavailability
            </span>
            <span
              className="error-ok"
              onClick={() => {
                setCheckoutErrorInfo(false);
              }}
            >
              <FcCheckmark />
            </span>
          </div>
        ) : null}
      </div>
      <div className="row">
        <div className="col-9">
          {cartList.length ? (
            <>
              <div className="cart-header-container">
                <span className="cart-text-header">Item List(s)</span>
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
                <span className="empty-cart-header">Your cart is still empty</span>
              </div>
              <div className="empty-cart-container">
                <span
                  className="empty-cart-link"
                  onClick={() => {
                    navigate('/AllProducts', { state: { passed_key: '' } });
                  }}
                >
                  Browse All Products
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="col-3">
          <div className="cart-header-container-transaction">
            <span className="cart-text-header">Transaction Details</span>
          </div>
          <div className="cart-transaction-details-container">
            <div className="cart-transaction-content-container">
              <div className="cart-transaction-content-header">
                <span>Summary</span>
              </div>
              <div className="cart-transaction-content-body py-2">
                {toCheckout.length ? renderCartDetails() : <span className="mx-2">Please select item(s) from your cart</span>}
              </div>
              <div className="cart-transaction-quantity-container bigger">
                <div className="q2">
                  <span>Total:</span>
                </div>
                <div className="q2 total">
                  <span>{toCheckout.length ? `Rp. ${renderTotal().toLocaleString()}` : `-`}</span>
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
