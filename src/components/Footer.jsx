import React from 'react';

import '../../src/assets/styles/Footer.css';
import Logo from '../assets/images/logo.png';
import { FaTwitterSquare, FaFacebook, FaInstagram } from 'react-icons/fa';
import { ImYoutube2 } from 'react-icons/im';

import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const navigateTo = (val) => {
    navigate(`/AllProducts`, { state: { passed_category: val } });
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="footer-upper">
        <div className="footer-upper-links">
          <div className="links-container">
            <h6>SHOP</h6>
            <text
              onClick={() => {
                navigateTo('Processor');
              }}
            >
              Processors
            </text>
            <text
              onClick={() => {
                navigateTo('Motherboard');
              }}
            >
              Motherboard
            </text>
            <text
              onClick={() => {
                navigateTo('Graphic Card');
              }}
            >
              Graphics Card
            </text>
            <text
              onClick={() => {
                navigateTo('Memory');
              }}
            >
              Memory
            </text>
          </div>
          <div className="links-container">
            <h6>ULTIMA</h6>
            <text href="#">About</text>
            <text href="#">Investor</text>
            <text href="#">Partner</text>
            <text href="#">Careers</text>
            <text href="#">Blog</text>
          </div>
          <div className="links-container">
            <h6>CUSTOMERS</h6>
            <text href="#">Contact Us</text>
            <text href="#">Track Your Order</text>
            <text href="#">Return Item</text>
            <text href="#">Privacy and Security</text>
          </div>
        </div>
        <div className="footer-upper-logo">
          <img src={Logo} />
        </div>
      </div>
      <div className="footer-lower">
        <span>© Ultima Inc., 2021 - 2022. All Rights Reserved</span>
        <div style={{ marginLeft: 'auto' }}>
          <FaTwitterSquare style={{ marginRight: '1rem' }} />
          <FaInstagram style={{ marginRight: '1rem' }} />
          <FaFacebook style={{ marginRight: '1rem' }} />
          <ImYoutube2 />
        </div>
      </div>
    </div>
  );
};

export default Footer;
