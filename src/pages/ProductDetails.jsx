import React, { useEffect, useState } from 'react';

import '../assets/styles/ProductDetails.css';

import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useSelector } from 'react-redux';

const ProductDetails = () => {
  const params = useParams();
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
        console.log(response.data);
        setProductData(response.data[0]);
      })
      .catch(() => {
        alert('Unable to load product data');
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
            </div>
            <div className="product-info-container">
              <span className="product-info">{productData.description}</span>
            </div>
            <div className="product-metadata-container">
              {productData.new ? <span className="product-metadata best">Best</span> : null}
              {productData.new ? <span className="product-metadata new">New</span> : null}
              {productData.price > 10000000 ? <span className="product-metadata free">Free Shipping</span> : null}
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
                +
              </button>
              <div className="qty-container">
                <span>{qty}</span>
              </div>
              <button
                className="btn-min"
                onClick={() => {
                  setQty(qty - 1);
                }}
                disabled={qty === 1}
              >
                -
              </button>
            </div>
            <div className="button-buy-container">
              <button
                className="cart-btn"
                disabled={!userGlobal.username}
                style={{ cursor: !userGlobal.username ? 'not-allowed' : 'pointer' }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
