import React from 'react';

import '../assets/styles/AllProducts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faMemory } from '@fortawesome/free-solid-svg-icons';

import { FaMemory } from 'react-icons/fa';
import { GiCircuitry } from 'react-icons/gi';
import { SiGraphql } from 'react-icons/si';

const AllProducts = () => {
  return (
    <div className="container">
      <div className="row">
        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '2rem', margin: '1rem 0' }}>
          <h3 className="page-header">Our Products</h3>
        </div>
        <div className="col-2">
          <div className="category-container">
            <span>Categories</span>
            <div className="line" />
            <button className="category-btn">
              <span>
                <FontAwesomeIcon icon={faMicrochip} style={{ textShadow: '0px 1px 6px #000000' }} />
              </span>
              Processors
            </button>
            <button className="category-btn">
              <span>
                <GiCircuitry />
              </span>
              Motherboard
            </button>
            <button className="category-btn">
              <span>
                <SiGraphql />
              </span>
              Graphic Cards
            </button>
            <button className="category-btn">
              <span>
                <FaMemory />
              </span>
              Memory
            </button>
          </div>
          <div className="category-container">
            <h6>Sort Products</h6>
            <div className="line" />
          </div>
        </div>
        <div className="col-10">
          <div className="card ">
            <div className="card-header">
              <strong>Available</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
