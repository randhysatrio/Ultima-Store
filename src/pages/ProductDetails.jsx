import React, { useEffect, useState } from 'react';

import '../assets/styles/ProductDetails.css';
import { FaShippingFast } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { GiDeliveryDrone } from 'react-icons/gi';
import { MdOutlineRecommend } from 'react-icons/md';
import { GoPlus } from 'react-icons/go';
import { HiMinus } from 'react-icons/hi';
import { RiArrowGoBackLine } from 'react-icons/ri';

import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

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
        alert('Unable to load product data');
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
        alert('Unable to update cart data');
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
              <text className="product-title">{productData.name}</text>
              <text className="product-price">{productData.price ? `Rp. ${productData.price.toLocaleString('id')}` : null}</text>
            </div>
            <div className="product-info-container">
              <text className="product-info">{productData.description}</text>
            </div>
            <div className="product-metadata-container">
              {productData.price > 10000000 ? (
                <div className="product-metadata free">
                  <FaShippingFast />
                  <text>Free Shipping</text>
                </div>
              ) : null}
              {productData.best ? (
                <div className="product-metadata">
                  <MdOutlineRecommend />
                  <AiFillStar />
                  <text>Store Recommended</text>
                </div>
              ) : null}
              <div className="product-metadata">
                <GiDeliveryDrone />
                <text>Drone Delivery</text>
              </div>
            </div>
          </div>
          <div className="product-details-action">
            <div className="button-container">
              <button
                className="btn-plus"
                onClick={() => {
                  setQty(qty + 1);
                }}
              >
                <GoPlus />
              </button>
              <div className="qty--container">
                <span>{qty}</span>
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
                  addToCartHandler();
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
    </div>
  );
};

export default ProductDetails;
