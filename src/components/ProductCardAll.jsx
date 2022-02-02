import React from 'react';
import '../../src/assets/styles/ProductCardAll.css';

import { FaShippingFast } from 'react-icons/fa';
import { BiRightArrowAlt } from 'react-icons/bi';
import { BsCartPlus, BsGlobe } from 'react-icons/bs';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import { toast } from 'react-toastify';

const ProductCardAll = ({ product }) => {
  const userGlobal = useSelector((state) => state.user);
  const navigate = useNavigate();
  const navigateTo = () => {
    navigate(`/ProductDetails/${product.id}`);
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
        toast.error('Unable to get cart data!', { position: 'bottom-left', theme: 'colored' });
      });
  };

  const addToCartHandler = () => {
    if (userGlobal.username) {
      Axios.get(`${API_URL}/carts`, {
        params: {
          userID: userGlobal.id,
          productName: product.name,
        },
      })
        .then((response) => {
          if (response.data.length) {
            Axios.patch(`${API_URL}/carts/${response.data[0].id}`, {
              productQty: response.data[0].productQty + 1,
            })
              .then(() => {
                notify('ok', 'Added product to your cart!');
                updateCartData(userGlobal.id);
              })
              .catch(() => {
                notify('fail', 'Failed to add product to your cart!');
              });
          } else {
            Axios.post(`${API_URL}/carts`, {
              userID: userGlobal.id,
              username: userGlobal.username,
              productID: product.id,
              productName: product.name,
              productImage: product.image,
              productPrice: product.price,
              productQty: 1,
            })
              .then(() => {
                notify('ok', 'Added product to your cart!');
                updateCartData(userGlobal.id);
              })
              .catch(() => {
                notify('fail', 'Failed to add product to your cart!');
              });
          }
        })
        .catch(() => {
          notify('fail', 'Unable to find user data!');
        });
    } else {
      notify('fail', 'Please sign-in to add this cart to your item');
    }
  };

  return (
    <div className="items-card">
      <div className="items-card-product-button details">
        <span onClick={navigateTo}>Product Details</span>
        <BiRightArrowAlt />
      </div>
      <div className="items-card-product-button cart">
        <span onClick={addToCartHandler}>Add to Cart</span>
        <BsCartPlus />
      </div>
      <div className="item-content-container">
        <div className="items-card-header">
          {product.price > 10000000 ? <span className="shipping">Free Shipping</span> : null}
          {product.best ? <span className="best">Best</span> : null}
          {product.new ? <span className="new"> New</span> : null}
        </div>
        <div className="items-card-image">
          <img src={product.image} alt="product-image" />
        </div>
        <div className="items-card-content">
          <div className="header-text-container">
            <text className="items-header">{product.name}</text>
          </div>
          <text className="items-subtext">Rp. {product.price.toLocaleString()}</text>
        </div>
        <div className="items-card-info">
          <div className="item-info-container">
            <BsGlobe />
            <span>Worldwide Shipping</span>
          </div>
          <div className="item-info-container">
            <FaShippingFast />
            <span>Same-Day Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardAll;
