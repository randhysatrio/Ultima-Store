import React, { useEffect, useState } from 'react';

import '../assets/styles/ProductDetails.css';
import { FaShippingFast } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { GiDeliveryDrone } from 'react-icons/gi';
import { MdOutlineRecommend, MdOutlineSell } from 'react-icons/md';
import { GoPlus } from 'react-icons/go';
import { HiMinus } from 'react-icons/hi';
import { RiArrowGoBackLine } from 'react-icons/ri';
import { BsCartCheck } from 'react-icons/bs';
import { toast } from 'react-toastify';

import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useDispatch, useSelector } from 'react-redux';

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const userGlobal = useSelector((state) => state.user);
  const [productData, setProductData] = useState({});
  const [qty, setQty] = useState(1);

  const fetchProductData = () => {
    Axios.get(`${API_URL}/products`, {
      params: {
        id: params.productID,
      },
    })
      .then((response) => {
        setProductData(response.data[0]);
      })
      .catch(() => {
        toast.error('Unable to load product data', { position: 'bottom-left', theme: 'colored' });
      });
  };

  const notify = (val, msg) => {
    if (val === 'ok') {
      toast.success(msg, {
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

  const dispatch = useDispatch();
  const updateCartData = (userID) => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userID,
      },
    })
      .then((response) => {
        dispatch({
          type: 'FILL_CART',
          payload: response.data,
        });
      })
      .catch(() => {
        toast.error('Unable to update cart data', { position: 'bottom-left', theme: 'colored' });
      });
  };

  const addToCartHandler = () => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userID: userGlobal.id,
        productID: productData.id,
      },
    })
      .then((response) => {
        if (response.data.length) {
          Axios.patch(`${API_URL}/carts/${response.data[0].id}`, {
            productQty: response.data[0].productQty + qty,
          })
            .then(() => {
              notify('ok', 'Updated cart product quantity!');
              updateCartData(userGlobal.id);
            })
            .catch(() => {
              notify('fail', 'Failed to update product quantity!');
            });
        } else {
          Axios.post(`${API_URL}/carts`, {
            userID: userGlobal.id,
            username: userGlobal.username,
            productID: productData.id,
            productName: productData.name,
            productImage: productData.image,
            productPrice: productData.price,
            productQty: qty,
          })
            .then(() => {
              notify('ok', 'Added product to your cart!');
              updateCartData(userGlobal.id);
            })
            .catch(() => {
              notify('fail', 'Unable to add product to your cart!');
            });
        }
      })
      .catch(() => {
        notify('fail', 'Unable to get user cart data!');
      });
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <div className="product-details-body">
      <div className="product-details-container">
        <div className="product-details-image-container">
          <img src={productData.image} />
        </div>
        <div className="product-details-content-container">
          <div className="product-details-info">
            <div className="product-title-container">
              <span className="product-title">{productData.name}</span>
              <span className="product-price">{productData.price ? `Rp. ${productData.price.toLocaleString('id')}` : null}</span>
              <div className="product-title-subtext-container">
                <BsCartCheck style={{ marginRight: '0.2rem' }} />
                <span className="product-stock me-3">{productData.stock} in stock</span>
                <MdOutlineSell style={{ marginRight: '0.2rem' }} />
                <span className="product-stock">{productData.sold} sold</span>
              </div>
            </div>
            <div className="product-info-container">
              <span className="product-info">{productData.description}</span>
            </div>
            <div className="product-metadata-container">
              {productData.price > 10000000 ? (
                <div className="product-metadata free">
                  <FaShippingFast />
                  <span>Free Shipping</span>
                </div>
              ) : null}
              {productData.best ? (
                <div className="product-metadata">
                  <MdOutlineRecommend />
                  <AiFillStar />
                  <span>ULTIMA Recommend</span>
                </div>
              ) : null}
              <div className="product-metadata">
                <GiDeliveryDrone />
                <span>Drone Delivery</span>
              </div>
            </div>
          </div>
          <div className="product-details-action">
            <div className="product-details-button-container">
              <button
                className="btn-plus"
                onClick={() => {
                  if (qty < productData.stock) {
                    setQty(qty + 1);
                  } else {
                    toast.warn('Maximum quantity reached!', { position: 'bottom-left', theme: 'colored' });
                  }
                }}
              >
                <GoPlus />
              </button>
              <div className="qty--container">
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => {
                    const amount = parseInt(e.target.value);
                    if (amount < 1) {
                      toast.warn('The minimum amount is 1!', { position: 'bottom-left', theme: 'colored' });
                    } else if (amount > productData.stock) {
                      toast.warn('Cannot go above maximum stock quantity!', { position: 'bottom-left', theme: 'colored' });
                    } else {
                      setQty(amount);
                    }
                  }}
                />
              </div>
              <button
                className="btn-min"
                onClick={() => {
                  if (qty > 1) {
                    setQty(qty - 1);
                  }
                }}
              >
                <HiMinus />
              </button>
            </div>
            <div className="button-buy-container">
              <button
                className="cart-btn"
                onClick={() => {
                  if (!qty) {
                    toast.error('Item quantity cannot be empty!', { position: 'bottom-left', theme: 'colored' });
                    setQty(1);
                  } else {
                    addToCartHandler();
                  }
                }}
                disabled={!userGlobal.username}
                style={{ cursor: !userGlobal.username ? 'not-allowed' : 'pointer' }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="previous-links-container">
        <span
          onClick={() => {
            navigate(-1);
          }}
        >
          <RiArrowGoBackLine /> Back
        </span>
      </div>
      <div className="product-details-review-section-container">
        <div className="product-details-post-header">
          <span>User Reviews</span>
        </div>
        <div className="product-details-review-container">
          <div className="product-details-review-header">
            <span className="product-details-review-header-text">Works great.. if you manage to get one</span>
            <span className="product-details-review-header-subtext">by</span>
            <span>randhysatrio</span>
          </div>
          <div className="product-details-review-content-container">
            <div className="product-details-review-content">
              <span>
                After visciouly fighting all those scalper bots, I finally managed to snubbed one! Never ever have I imagined my pc could
                run Crysis at 4k120. Its a shame my previous 750w gold power supply also needs an upgrade because this card is one hungry
                beast!
              </span>
            </div>
          </div>
          <div className="product-details-review-footer-container">
            <span>2022/2/2 19:31:01</span>
            <button>Delete Review</button>
          </div>
        </div>
      </div>
      <div className="product-details-post-section">
        <div className="product-details-post-header">
          <span>Write your reviews</span>
        </div>
        <div className="product-details-post-input-container">
          <div className="product-details-post-header-input-container">
            <label htmlFor="review-title-input">Title:</label>
            <input type="text" id="review-title-input" />
          </div>
          <div className="product-details-post-header-textarea-container">
            <label htmlFor="product-details-review-input">Review:</label>
            <textarea id="product-details-review-input"></textarea>
          </div>
          <div className="product-details-post-header-button-container">
            <button>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
