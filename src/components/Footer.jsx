import React from 'react';

import '../../src/assets/styles/Footer.css';
import Logo from '../assets/images/logo.png';

import { FaTwitterSquare, FaFacebook, FaInstagram } from 'react-icons/fa';
import { ImYoutube2 } from 'react-icons/im';

const Footer = () => {
  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="footer-upper">
        <div className="footer-upper-links">
          <div className="links-container">
            <h6>SHOP</h6>
            <a href="#">Processors</a>
            <a href="#">Motheboard</a>
            <a href="#">Graphics Card</a>
            <a href="#">Memory</a>
          </div>
          <div className="links-container">
            <h6>ULTIMA</h6>
            <a href="#">About</a>
            <a href="#">Investor</a>
            <a href="#">Partner</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
          </div>
          <div className="links-container">
            <h6>CUSTOMERS</h6>
            <a href="#">Contact Us</a>
            <a href="#">Track Your Order</a>
            <a href="#">Return Item</a>
            <a href="#">Privacy and Security</a>
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
