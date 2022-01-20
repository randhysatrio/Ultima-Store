import React from 'react';
import '../../src/assets/styles/ProductCardAll.css';

import { FaShippingFast } from 'react-icons/fa';
import { BiRightArrowAlt } from 'react-icons/bi';
import { BsCartPlus, BsGlobe } from 'react-icons/bs';

const ProductCardAll = ({ product }) => {
  return (
    <div className="items-card">
      <div className="items-card-product-button details">
        <span>Product Details</span>
        <BiRightArrowAlt />
      </div>
      <div className="items-card-product-button cart">
        <span>Add to Cart</span>
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
          <span className="items-header">{product.name}</span>
          <span className="items-subtext">Rp. {product.price.toLocaleString()}</span>
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
