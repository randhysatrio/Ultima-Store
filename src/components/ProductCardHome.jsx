import React from 'react';
import '../../src/assets/styles/ProductCardHome.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { useNavigate, Link } from 'react-router-dom';

const ProductCardHome = ({ product }) => {
  const navigate = useNavigate();
  const navigateTo = () => {
    navigate(`/ProductDetails/${product.id}`);
  };

  return (
    <div className="product-card" onClick={navigateTo}>
      <div className="card-image">
        <img src={product.image} />
      </div>
      <div className="card-info">
        <h6 className="card-title">{product.name}</h6>
        <p className="card-subtitle">Rp. {product.price.toLocaleString('id')}</p>
      </div>
      <div className="card-link">
        <FontAwesomeIcon icon={faArrowRight} style={{ marginRight: '0.2rem' }} />
        <span className="details-link">More Details</span>
      </div>
    </div>
  );
};

export default ProductCardHome;
