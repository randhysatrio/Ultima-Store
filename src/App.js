import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyNavbar from './components/MyNavbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AllProducts from './pages/AllProducts';
import Footer from './components/Footer';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import AdminMain from './pages/AdminMain';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminProductEdit from './pages/AdminProductEdit';
import UserProfile from './pages/UserProfile';
import UserProfileMain from './pages/UserProfileMain';
import History from './pages/History';

import Axios from 'axios';
import { API_URL } from './assets/constants';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const updateCartData = (userID) => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userID,
      },
    })
      .then((response) => {
        dispatch({
          type: 'FILL_CART',
          payload: response.data,
        });
      })
      .catch(() => {
        alert('Unable to update cart data');
      });
  };

  const userKeepLogin = () => {
    const data = localStorage.getItem('emmerceData');

    if (data) {
      const userData = JSON.parse(data);

      Axios.get(`${API_URL}/users`, {
        params: {
          id: userData.id,
        },
      })
        .then((response) => {
          dispatch({
            type: 'USER_REGISTER',
            payload: response.data[0],
          });
          updateCartData(response.data[0].id);
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
        <Route path="/" element={<Home />} />
        <Route path="Login" element={<Login />} />
        <Route path="Register" element={<Register />} />
        <Route path="AllProducts" element={<AllProducts />} />
        <Route path="ProductDetails/:productID" element={<ProductDetails />} />
        <Route path="Cart" element={<Cart />} />
        <Route path="Checkout" element={<Checkout />} />
        <Route path="Admin" element={<Admin />}>
          <Route index element={<AdminMain />} />
          <Route path="AdminProductsPage" element={<AdminProductsPage />} />
          <Route path="AdminProductEdit" element={<AdminProductEdit />} />
        </Route>
        <Route path="UserProfile" element={<UserProfile />}>
          <Route index element={<UserProfileMain />} />
          <Route path="History" element={<History />} />
        </Route>
      </Routes>
      <ToastContainer />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
