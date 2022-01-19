import React, { useState, useEffect } from 'react';

import '../assets/styles/Home.css';

import Carousel from 'react-bootstrap/Carousel';
import banner1 from '../assets/images/banner1.png';
import banner2 from '../assets/images/banner2.jpg';
import banner3 from '../assets/images/banner3.jpg';

import ProductCardHome from '../components/ProductCardHome';

import { useNavigate, Link } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

const Home = () => {
  const navigate = useNavigate();
  const navigateTo = () => {
    navigate(`AllProducts`);
  };

  const [productListNew, setProductListNew] = useState([]);
  const [productListBest, setProductListBest] = useState([]);

  const fetchProductList = (val) => {
    Axios.get(`${API_URL}/products`, {
      params: {
        [val]: true,
      },
    })
      .then((response) => {
        console.log(response.data);
        if (val === 'new') {
          setProductListNew(response.data);
        } else if (val === 'best') {
          setProductListBest(response.data);
        }
      })
      .catch(() => {
        alert('Unable to load products');
      });
  };

  const renderProductsBest = () => {
    return productListBest.map((product) => {
      return <ProductCardHome key={product.id} product={product} />;
    });
  };

  const renderProductsNew = () => {
    return productListNew.map((product) => {
      return <ProductCardHome key={product.id} product={product} />;
    });
  };

  useEffect(() => {
    fetchProductList('new');
  }, []);

  useEffect(() => {
    fetchProductList('best');
  }, []);

  return (
    <>
      <div style={{ marginTop: '10px' }}>
        <Carousel>
          <Carousel.Item>
            <img className="d-block w-100" src={banner1} alt="First slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src={banner2} alt="Second slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src={banner3} alt="Third slide" />
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="d-flex justify-content-center gap-3 px-5 mt-3" style={{ height: '10rem' }}>
        <button className="shop processors d-flex justify-content-center align-items-center shadow" onClick={navigateTo}>
          Shop Processors
        </button>
        <button className="shop motherboard d-flex justify-content-center align-items-center shadow" onClick={navigateTo}>
          Shop Motherboard
        </button>
        <button className="shop gpu d-flex justify-content-center align-items-center shadow" onClick={navigateTo}>
          Shop Graphic Cards
        </button>
      </div>
      <div className="container mt-3">
        <div className="row">
          <div className="col-11 mx-auto">
            <div style={{ padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="content-header">New Products</h3>
            </div>
            <div className="product-container">
              {renderProductsNew()}
              <div className="product-link">
                <Link to="AllProducts" style={{ textDecoration: 'none' }}>
                  <h6>See All Products</h6>
                </Link>
              </div>
            </div>
            <div style={{ padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="content-header">Best Sellers</h3>
            </div>
            <div className="product-container">
              {renderProductsBest()}
              <div className="product-link">
                <Link to="AllProducts" style={{ textDecoration: 'none' }}>
                  <h6>See All Products</h6>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
