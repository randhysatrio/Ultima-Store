import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../../assets/constants';

import '../../assets/styles/Register.css';

const errMsg = 'Please fill out your';

const Register = () => {
  const [userRegister, setUserRegister] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const eventHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setUserRegister({
      ...userRegister,
      [name]: value,
    });
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const registerBtnHandler = () => {
    Axios.get(`${API_URL}/users`, {
      params: {
        username: userRegister.username,
      },
    })
      .then((response) => {
        if (response.data.length) {
          setErrorMessage('Username is already been taken!');
        } else {
          Axios.get(`${API_URL}/users`, {
            params: {
              email: userRegister.email,
            },
          })
            .then((response) => {
              console.log(response.data);
              if (response.data.length) {
                setErrorMessage('This email has already been registered!');
              } else {
                if (userRegister.username === '') {
                  setErrorMessage(`${errMsg} username!`);
                } else if (userRegister.username.includes(' ')) {
                  setErrorMessage(`Username cannot contain spaces!`);
                } else if (userRegister.email === '') {
                  setErrorMessage(`${errMsg} email address!`);
                } else if (userRegister.email.includes(' ') || !userRegister.email.includes('@') || !userRegister.email.includes('.co')) {
                  setErrorMessage('Please enter a valid email address!');
                } else if (userRegister.firstname === '') {
                  setErrorMessage(`${errMsg} first name!`);
                } else if (userRegister.lastname === '') {
                  setErrorMessage(`${errMsg} last name!`);
                } else if (userRegister.password.length < 4) {
                  setErrorMessage('Password needs to be more than 3 characters!');
                } else {
                  Axios.post(`${API_URL}/users`, userRegister)
                    .then((response) => {
                      setErrorMessage(false);
                      delete response.data.password;

                      localStorage.setItem('emmerceData', JSON.stringify(response.data));
                      console.log(response.data);

                      dispatch({
                        type: 'USER_REGISTER',
                        payload: response.data,
                      });

                      navigate(`/`, { replace: true });
                    })
                    .catch(() => {
                      alert('Server Error 1');
                    });
                }
              }
            })
            .catch(() => {
              alert('Server Error 2');
            });
        }
      })
      .catch(() => {
        alert('Server Error 3');
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1.5rem', height: '110vh' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '0.2rem', width: '28vw', height: '3.5rem' }}>
        <h3 className="header">Register</h3>
      </div>
      <div className="register-container">
        {errorMessage ? (
          <div className="alert alert-danger" style={{ marginTop: '1rem', marginBottom: '1rem', borderRadius: '1.5rem', maxWidth: '90%' }}>
            {errorMessage}
          </div>
        ) : null}
        <div className="form-floating input-container" style={{ width: '90%' }}>
          <input
            type="text"
            id="firstname"
            name="firstname"
            className="form-control"
            placeholder="Your First Name here"
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
          <label htmlFor="firstname">First Name</label>
        </div>
        <div className="form-floating input-container" style={{ width: '90%' }}>
          <input
            type="text"
            id="lastname"
            name="lastname"
            className="form-control"
            placeholder="Your Last Name here"
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
          <label htmlFor="lastname">Last Name</label>
        </div>
        <div className="form-floating input-container" style={{ width: '90%' }}>
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

        <div className="form-floating input-container" style={{ width: '90%' }}>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="email"
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
          <label htmlFor="email">Email</label>
        </div>
        <div className="form-floating input-container" style={{ width: '90%' }}>
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
        <div style={{ marginTop: '1rem' }}>
          <button className="registerBtn" onClick={registerBtnHandler}>
            Sign Up
          </button>
        </div>
        <div style={{ marginTop: '1.3rem' }}>
          <Link to="/Login" style={{ textDecoration: 'none' }}>
            <p className="bottomLink">Already have an account?</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
