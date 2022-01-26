import React, { useEffect, useState } from 'react';

import '../assets/styles/Navbar.css';
import Logo from '../assets/images/logo.png';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

const MyNavbar = () => {
  const userGlobal = useSelector((state) => state.user);
  const cartGlobal = useSelector((state) => state.cart);
  const [searchkey, setSearchkey] = useState('');

  const navigate = useNavigate();
  const navigateTo = (val) => {
    if (val) {
      navigate(`/${val}`);
    } else {
      navigate(`/`);
    }
  };

  const navigate_search = (val) => {
    navigate(`/AllProducts`, { state: { search_key: val } });
  };

  const dispatch = useDispatch();
  const userLogout = () => {
    localStorage.removeItem('emmerceData');

    dispatch({
      type: 'USER_LOGOUT',
    });
    navigateTo();
  };

  return (
    <Navbar expand="lg" variant="dark" className="px-5 mb-0 navbar">
      <Navbar.Brand as={Link} to="/">
        <img src={Logo} width="110" height="30" className="d-inline-block align-top" alt="React Bootstrap logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      {userGlobal.username ? (
        <Navbar.Collapse id="basic-navbar-nav">
          <Form className="d-flex mx-auto">
            <FormControl
              type="search"
              placeholder="Search PC parts.."
              className="me-2 rounded-pill col-lg-4"
              aria-label="Search"
              onChange={(event) => {
                setSearchkey(event.target.value);
              }}
            />
            <Button
              variant="light"
              className="rounded-pill"
              onClick={() => {
                navigate_search(searchkey);
              }}
            >
              Search
            </Button>
          </Form>
          <Nav>
            <NavDropdown title={`Hello, ${userGlobal.username}!`} id="basic-nav-dropdown" variant="dark">
              <NavDropdown.Item
                onClick={() => {
                  navigateTo('Cart');
                }}
              >
                Cart ({cartGlobal.cartList.length})
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">History</NavDropdown.Item>
              {userGlobal.role === 'admin' ? (
                <NavDropdown.Item
                  onClick={() => {
                    navigateTo('Admin');
                  }}
                >
                  Admin Page
                </NavDropdown.Item>
              ) : null}
              <NavDropdown.Item href="#action/3.3">My Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <div className="d-grid gap-2 px-3">
                <Button variant="danger" onClick={userLogout}>
                  Sign Out
                </Button>
              </div>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      ) : (
        <>
          <Form className="d-flex mx-auto">
            <FormControl
              type="search"
              placeholder="Search PC parts.."
              className="me-2 rounded-pill col-lg-4"
              aria-label="Search"
              onChange={(event) => {
                setSearchkey(event.target.value);
              }}
            />
            <Button
              variant="light"
              className="rounded-pill"
              onClick={() => {
                navigate_search(searchkey);
              }}
            >
              Search
            </Button>
          </Form>
          <div className="d-flex">
            <Button
              variant="secondary"
              className="me-3 rounded-pill"
              onClick={() => {
                navigateTo('login');
              }}
            >
              <strong>Login</strong>
            </Button>
            <Button
              variant="secondary"
              className="rounded-pill"
              onClick={() => {
                navigateTo('register');
              }}
            >
              <strong>Register</strong>
            </Button>
          </div>
        </>
      )}
    </Navbar>
  );
};

export default MyNavbar;
