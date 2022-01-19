import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyNavbar from './components/MyNavbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AllProducts from './pages/AllProducts';
import Footer from './components/Footer';

import Axios from 'axios';
import { API_URL } from './assets/constants';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();
  const userKeepLogin = () => {
    const data = localStorage.getItem('emmerceData');

    if (data) {
      const userData = JSON.parse(data);

      Axios.get(`${API_URL}/users`, {
        params: {
          username: userData.username,
        },
      })
        .then((response) => {
          dispatch({
            type: 'USER_REGISTER',
            payload: response.data[0],
          });
        })
        .catch(() => {
          alert('Server Error');
        });
    } else {
      return;
    }
  };

  useEffect(() => {
    userKeepLogin();
  }, []);

  return (
    <BrowserRouter>
      <MyNavbar />
      <Routes>
        <Route path="Login" element={<Login />} />
        <Route path="Register" element={<Register />} />
        <Route path="AllProducts" element={<AllProducts />}>
          <Route path=":params" element={<AllProducts />} />
        </Route>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
