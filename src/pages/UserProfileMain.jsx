import React, { useState, useEffect } from 'react';
import '../assets/styles/UserProfileMain.css';
import { BsCheckLg } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Switch from 'react-switch';

import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useDispatch } from 'react-redux';

const UserProfileMain = () => {
  const userData = JSON.parse(localStorage.getItem('emmerceData'));
  const dispatch = useDispatch();
  const [oldUserData, setOldUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [address, setAddress] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [fullnamePref, setFullnamePref] = useState(false);
  const [checkoutDataPref, setCheckoutDataPref] = useState(false);

  const [checkoutPrefError, setCheckoutPrefError] = useState(false);

  const fetchUserData = () => {
    Axios.get(`${API_URL}/users/${userData.id}`)
      .then((response) => {
        setOldUserData(response.data);
        setFirstname(response.data.firstname);
        setLastname(response.data.lastname);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setTelephone(response.data.telephone);
        setAddress(response.data.address);
        setProfilePic(response.data.profilePic);
        setFullnamePref(response.data.fullnamePref);
        setCheckoutDataPref(response.data.checkoutDataPref);
      })
      .catch(() => {
        alert('Unable to fetch user data!');
      });
  };

  const saveBtnHandler = () => {
    if (!firstname) {
      toast.warn('Please fill out your first name', { position: 'bottom-left', theme: 'colored' });
    } else if (!lastname) {
      toast.warn('Please fill out your last name', { position: 'bottom-left', theme: 'colored' });
    } else if (!email) {
      toast.warn('Please fill out your email address', { position: 'bottom-left', theme: 'colored' });
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      toast.warn('Please use a valid email address', { position: 'bottom-left', theme: 'colored' });
    } else if (!username) {
      toast.warn('Please fill out your username', { position: 'bottom-left', theme: 'colored' });
    } else if (!profilePic) {
      toast.warn('Default profile picture used', { position: 'bottom-left', theme: 'colored' });
      setProfilePic(oldUserData.profilePic);
    } else if (username !== oldUserData.username) {
      Axios.get(`${API_URL}/users`, {
        params: {
          username: username,
        },
      })
        .then((response) => {
          if (response.data.length) {
            toast.warn('This username has been taken!', { position: 'bottom-left', theme: 'colored' });
            setUsername(oldUserData.username);
          } else {
            if (email !== oldUserData.email) {
              Axios.get(`${API_URL}/users`, {
                params: {
                  email: email,
                },
              }).then((response) => {
                if (response.data.length) {
                  toast.warn('This email has already been registered!', { position: 'bottom-left', theme: 'colored' });
                  setEmail(oldUserData.email);
                } else {
                  Axios.patch(`${API_URL}/users/${userData.id}`, {
                    firstname,
                    lastname,
                    username,
                    email,
                    telephone,
                    address,
                    profilePic,
                    fullnamePref,
                    checkoutDataPref,
                  })
                    .then((response) => {
                      delete response.data.password;

                      localStorage.setItem('emmerceData', JSON.stringify(response.data));

                      dispatch({
                        type: 'USER_REGISTER',
                        payload: response.data,
                      });

                      setEditMode(!editMode);
                      document.body.scrollIntoView();
                    })
                    .catch(() => {
                      toast.warn('Unable to update user data!', { position: 'bottom-left', theme: 'colored' });
                    });
                }
              });
            } else {
              Axios.patch(`${API_URL}/users/${userData.id}`, {
                firstname,
                lastname,
                username,
                email,
                telephone,
                address,
                profilePic,
                fullnamePref,
                checkoutDataPref,
              })
                .then((response) => {
                  delete response.data.password;

                  localStorage.setItem('emmerceData', JSON.stringify(response.data));

                  dispatch({
                    type: 'USER_REGISTER',
                    payload: response.data,
                  });

                  setEditMode(!editMode);
                  document.body.scrollIntoView();
                })
                .catch(() => {
                  toast.warn('Unable to update user data!', { position: 'bottom-left', theme: 'colored' });
                });
            }
          }
        })
        .catch(() => {
          toast.error('Unable to get usernames data!');
        });
    } else if (email !== oldUserData.email) {
      Axios.get(`${API_URL}/users`, {
        params: {
          email: email,
        },
      })
        .then((response) => {
          if (response.data.length) {
            toast.warn('This email has already been registered!', { position: 'bottom-left', theme: 'colored' });
            setEmail(oldUserData.email);
          } else {
            if (username !== oldUserData.username) {
              Axios.get(`${API_URL}/users`, {
                params: {
                  username: username,
                },
              }).then((response) => {
                if (response.data.length) {
                  toast.warn('This username has been taken!', { position: 'bottom-left', theme: 'colored' });
                  setUsername(oldUserData.username);
                } else {
                  Axios.patch(`${API_URL}/users/${userData.id}`, {
                    firstname,
                    lastname,
                    username,
                    email,
                    telephone,
                    address,
                    profilePic,
                    fullnamePref,
                    checkoutDataPref,
                  })
                    .then((response) => {
                      delete response.data.password;

                      localStorage.setItem('emmerceData', JSON.stringify(response.data));

                      dispatch({
                        type: 'USER_REGISTER',
                        payload: response.data,
                      });

                      setEditMode(!editMode);
                      document.body.scrollIntoView();
                    })
                    .catch(() => {
                      toast.warn('Unable to update user data!', { position: 'bottom-left', theme: 'colored' });
                    });
                }
              });
            } else {
              Axios.patch(`${API_URL}/users/${userData.id}`, {
                firstname,
                lastname,
                username,
                email,
                telephone,
                address,
                profilePic,
                fullnamePref,
                checkoutDataPref,
              })
                .then((response) => {
                  delete response.data.password;

                  localStorage.setItem('emmerceData', JSON.stringify(response.data));

                  dispatch({
                    type: 'USER_REGISTER',
                    payload: response.data,
                  });

                  setEditMode(!editMode);
                  document.body.scrollIntoView();
                })
                .catch(() => {
                  toast.warn('Unable to update user data!', { position: 'bottom-left', theme: 'colored' });
                });
            }
          }
        })
        .catch(() => {
          toast.error('Unable to get usernames data!');
        });
    } else {
      Axios.patch(`${API_URL}/users/${userData.id}`, {
        firstname,
        lastname,
        username,
        email,
        telephone,
        address,
        profilePic,
        fullnamePref,
        checkoutDataPref,
      })
        .then((response) => {
          delete response.data.password;

          localStorage.setItem('emmerceData', JSON.stringify(response.data));
          dispatch({
            type: 'USER_REGISTER',
            payload: response.data,
          });

          setEditMode(!editMode);
          document.body.scrollIntoView();
        })
        .catch(() => {
          toast.warn('Unable to update user data!', { position: 'bottom-left', theme: 'colored' });
        });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="user-profile-page-body">
      <div className="user-profile-page-header">
        <span>{userData.fullnamePref ? `${userData.firstname} ${userData.lastname}` : `${userData.username}`}'s Profile Page</span>
      </div>
      <div className="user-profile-page-content-container">
        <div className="user-profile-picture-container">
          <div className="user-profile-picture">
            <img src={profilePic} />
          </div>
          {editMode ? (
            <input
              type="url"
              id="profilePic"
              value={profilePic}
              onChange={(e) => {
                setProfilePic(e.target.value);
              }}
            />
          ) : null}
        </div>
        <div className="user-profile-detail-container">
          {editMode ? <label htmlFor="firstName">First Name:*</label> : <label htmlFor="firstName">First Name:</label>}
          {editMode ? (
            <input
              id="firstName"
              type="text"
              value={firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
            />
          ) : (
            <div className="huge-subtext">
              <span>{firstname}</span>
            </div>
          )}
        </div>
        <div className="user-profile-detail-container">
          {editMode ? <label htmlFor="lastName">Last Name:*</label> : <label htmlFor="lastName">Last Name:</label>}
          {editMode ? (
            <input
              id="lastName"
              type="text"
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
              }}
            />
          ) : (
            <div className="huge-subtext">
              <span>{lastname}</span>
            </div>
          )}
        </div>
        <div className="user-profile-detail-container">
          {editMode ? <label htmlFor="username">Username:*</label> : <label htmlFor="username">Username:</label>}
          {editMode ? (
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          ) : (
            <div className="huge-subtext">
              <span>{username}</span>
            </div>
          )}
        </div>
        <div className="user-profile-detail-container">
          {editMode ? <label htmlFor="email">Email:*</label> : <label htmlFor="email">Email:</label>}
          {editMode ? (
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          ) : (
            <span className="small-subtext">{email}</span>
          )}
        </div>
        <div className="user-profile-detail-container">
          <label htmlFor="telephone">Phone:</label>
          {editMode ? (
            <input
              id="telephone"
              type="tel"
              value={telephone}
              onChange={(e) => {
                setTelephone(e.target.value);
              }}
              placeholder="Your telephone number here.."
            />
          ) : (
            <span className="small-subtext">{telephone ? telephone : 'Please fill out your phone number..'}</span>
          )}
        </div>
        <div className="user-profile-detail-container">
          <label htmlFor="address">Address:</label>
          {editMode ? (
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              placeholder="Your address here.."
            />
          ) : (
            <span className="small-subtext">{address ? address : 'Please fill out your address..'}</span>
          )}
        </div>
        <span className="preference-header">Preference:</span>
        <div className="user-preference-container">
          <div className="user-preference">
            <span>Show full name instead of username?</span>
            {editMode ? (
              <Switch
                checked={fullnamePref}
                onChange={() => {
                  setFullnamePref(!fullnamePref);
                }}
              />
            ) : (
              <div>{fullnamePref ? <BsCheckLg style={{ color: 'lightgreen' }} /> : <AiOutlineClose style={{ color: 'red' }} />}</div>
            )}
          </div>
          <div className="user-preference d-flex flex-column">
            <div className="preference-switch-container">
              <span>Always use my data at checkout page?</span>
              {editMode ? (
                <Switch
                  checked={checkoutDataPref}
                  onChange={() => {
                    setCheckoutDataPref(false);
                    setCheckoutPrefError(false);
                    if (!firstname || !lastname || !username || !email || !telephone || !address) {
                      setCheckoutPrefError(true);
                    } else if (firstname && lastname && username && email && telephone && address) {
                      setCheckoutPrefError(false);
                      setCheckoutDataPref(!checkoutDataPref);
                    }
                  }}
                />
              ) : (
                <div>{checkoutDataPref ? <BsCheckLg style={{ color: 'lightgreen' }} /> : <AiOutlineClose style={{ color: 'red' }} />}</div>
              )}
            </div>
            {checkoutPrefError ? (
              <span className="user-checkout-preference-error-message">Please complete your form to use this feature</span>
            ) : null}
          </div>
        </div>
        <div className="button-container">
          {editMode ? (
            <div className="d-flex">
              <button
                className="edit-cancel-button"
                onClick={() => {
                  setEditMode(!editMode);
                  setCheckoutPrefError(false);
                  document.body.scrollIntoView();
                }}
              >
                Cancel
              </button>
              <button
                className="edit-save-button"
                onClick={() => {
                  if (!firstname || !lastname || !username || !email || !telephone || !address) {
                    setCheckoutDataPref(false);
                    Axios.patch(`${API_URL}/users/${userData.id}`, {
                      checkoutDataPref: false,
                    });
                  }
                  setCheckoutPrefError(false);
                  saveBtnHandler();
                }}
              >
                Save
              </button>
            </div>
          ) : (
            <button
              className="edit-profile-button"
              onClick={() => {
                setEditMode(!editMode);
                document.body.scrollIntoView();
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileMain;
