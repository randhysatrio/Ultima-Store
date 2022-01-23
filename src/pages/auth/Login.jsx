import React, { useState } from 'react';

import '../../assets/styles/Login.css';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../../assets/constants';

const Login = () => {
  const [loginState, setLoginState] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState(false);

  const eventHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setLoginState({
      ...loginState,
      [name]: value,
    });
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const updateCartData = (userID) => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userID,
      },
    })
      .then((response) => {
        console.log(response.data);
        dispatch({
          type: 'FILL_CART',
          payload: response.data,
        });
      })
      .catch(() => {
        alert('Unable to update cart data');
      });
  };
  const loginBtnHandler = () => {
    Axios.get(`${API_URL}/users`, {
      params: {
        username: loginState.username,
        password: loginState.password,
      },
    })
      .then((response) => {
        if (response.data.length) {
          delete response.data[0].password;

          localStorage.setItem('emmerceData', JSON.stringify(response.data[0]));

          dispatch({
            type: 'USER_REGISTER',
            payload: response.data[0],
          });
          updateCartData(response.data[0].id);

          navigate(`/`);
        } else {
          setErrorMessage(true);
        }
      })
      .catch(() => {
        alert('Server Error');
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem', height: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '0.2rem', width: '28vw', height: '3.5rem' }}>
        <h3 className="header">Login</h3>
      </div>
      <div className="login-container">
        {errorMessage ? (
          <div className="alert alert-danger" style={{ marginBottom: '2rem', borderRadius: '1.5rem', maxWidth: '90%' }}>
            Wrong username or password! Please try again
          </div>
        ) : null}
        <div className="form-floating" style={{ width: '90%' }}>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            placeholder="Your username here"
            style={{
              width: '100%',
              borderRadius: '2rem',
              border: 'none',
              outline: 'none',
              paddingLeft: '1.5rem',
              backgroundColor: 'lightgray',
            }}
            onChange={eventHandler}
          />
          <label htmlFor="username">Username</label>
        </div>
        <div className="form-floating" style={{ width: '90%', marginTop: '3.5rem' }}>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="Password"
            style={{
              width: '100%',
              borderRadius: '2rem',
              border: 'none',
              outline: 'none',
              paddingLeft: '1.5rem',
              backgroundColor: 'lightgray',
            }}
            onChange={eventHandler}
          />
          <label htmlFor="password">Password</label>
        </div>
        <div style={{ marginTop: '2.5rem' }}>
          <button className="loginBtn" onClick={loginBtnHandler}>
            Login
          </button>
        </div>
        <div style={{ marginTop: '3rem' }}>
          <Link to="/Register" style={{ textDecoration: 'none' }}>
            <p className="bottomLink">Dont have an account?</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
