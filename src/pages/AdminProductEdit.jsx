import React, { useEffect, useState } from 'react';
import '../assets/styles/AdminProductEdit.css';
import Switch from 'react-switch';

import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import { toast } from 'react-toastify';

const AdminProductEdit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [newImage, setNewImage] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState('https://www.femtoscientific.com/wp-content/uploads/2014/12/default_image_01.png');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productNew, setProductNew] = useState(false);
  const [productBest, setProductBest] = useState(false);

  const [errCategory, setErrCategory] = useState(false);
  const [errName, setErrName] = useState(false);
  const [errImage, setErrImage] = useState(false);
  const [errDescription, setErrDescription] = useState(false);
  const [errPrice, setErrPrice] = useState(false);

  const fetchProductData = () => {
    if (state.passed_id) {
      Axios.get(`${API_URL}/products`, {
        params: {
          id: state.passed_id,
        },
      })
        .then((response) => {
          setProductCategory(response.data[0].category);
          setProductName(response.data[0].name);
          setProductImage(response.data[0].image);
          setProductDescription(response.data[0].description);
          setProductPrice(response.data[0].price);
          setProductNew(response.data[0].new);
          setProductBest(response.data[0].best);
        })
        .catch(() => {
          toast.warn('Unable to get product data!', { position: 'bottom-left', theme: 'colored' });
        });
    } else {
      return;
    }
  };

  const errClear = () => {
    setErrName(false);
    setErrCategory(false);
    setErrImage(false);
    setErrDescription(false);
    setErrPrice(false);
  };

  const validator = () => {
    if (!productName) {
      setErrName(true);
    }

    if (!productCategory) {
      setErrCategory(true);
    }

    if (!productImage) {
      setErrImage(true);
    }

    if (!productDescription) {
      setErrDescription(true);
    }

    if (!productPrice) {
      setErrPrice(true);
    }
  };

  const addProductHandler = () => {
    if (!productCategory) {
      return;
    } else if (!productName) {
      return;
    } else if (!productImage) {
      return;
    } else if (!productPrice) {
      return;
    } else if (!productDescription) {
      return;
    } else {
      Axios.post(`${API_URL}/products`, {
        category: productCategory,
        name: productName,
        image: productImage,
        description: productDescription,
        price: parseInt(productPrice),
        new: productNew,
        best: productBest,
      })
        .then(() => {
          toast.success('Successfully add product!', { position: 'bottom-left', theme: 'colored' });
          navigate(-1);
        })
        .catch(() => {
          toast.error('Failed to add product!', { position: 'bottom-left', theme: 'colored' });
        });
    }
  };

  const updateProductHandler = () => {
    if (!productCategory) {
      return;
    } else if (!productName) {
      return;
    } else if (!productImage) {
      return;
    } else if (!productPrice) {
      return;
    } else if (!productDescription) {
      return;
    } else {
      Axios.get(`${API_URL}/products`, {
        params: {
          id: state.passed_id,
        },
      })
        .then((response) => {
          Axios.patch(`${API_URL}/products/${response.data[0].id}`, {
            category: productCategory,
            name: productName,
            image: productImage,
            description: productDescription,
            price: parseInt(productPrice),
            new: productNew,
            best: productBest,
          })
            .then(() => {
              toast.success('Updated product data!', { position: 'bottom-left', theme: 'colored' });
              navigate(-1);
            })
            .catch(() => {
              toast.error('Unable to update product data!', { position: 'bottom-left', theme: 'colored' });
              alert('Unable to update product data');
            });
        })
        .catch(() => {
          toast.warn('Unable to get product data!', { position: 'bottom-left', theme: 'colored' });
        });
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <div className="product-edit-page-body">
      <div className="product-edit-page-header-container">{state.passed_id ? <span>Edit Products</span> : <span>Add Products</span>}</div>
      <div className="product-edit-page-content-container">
        <div className="product-edit-image-container">
          <div className="product-image-container">
            <img src={productImage} />
          </div>
          {state.passed_id ? (
            <>
              <div className="product-image-input-container">
                <label htmlFor="product-image">Product Image:</label>
                <input
                  type="text"
                  name="productImage"
                  value={productImage}
                  id="product-image"
                  onChange={(e) => setProductImage(e.target.value)}
                  style={{ width: '20rem', marginLeft: '1rem' }}
                />
              </div>
              {errImage ? <span>Please use a proper image address</span> : null}
            </>
          ) : (
            <>
              <div className="product-image-input-container">
                <label htmlFor="product-image">Product Image:</label>
                <input
                  type="text"
                  name="productImage"
                  defaultValue={productImage}
                  id="product-image"
                  onChange={(e) => setNewImage(e.target.value)}
                />
                <button
                  onClick={() => setProductImage(newImage)}
                  disabled={!newImage}
                  style={{ cursor: !newImage ? 'not-allowed' : 'pointer' }}
                >
                  Change
                </button>
              </div>
              {errImage ? <span>Please use a proper image address</span> : null}
            </>
          )}
        </div>
        <div className="product-edit-name-container">
          <label htmlFor="product-name">Product Name:</label>
          <input
            type="text"
            name="name"
            id="product-name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Insert product name.."
          />
          {errName ? <span>This field is required</span> : null}
        </div>
        <div className="product-edit-multi-container">
          <div className="product-edit-price-container">
            <label htmlFor="product-price">Product Price:</label>
            <input
              type="number"
              id="product-price"
              placeholder="Insert product price.."
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
            {errPrice ? <span>Price cannot be 0!</span> : null}
          </div>
          <div className="product-edit-category-container">
            <label htmlFor="product-category">Product Category:</label>
            <select id="product-category" name="category" value={productCategory} onChange={(e) => setProductCategory(e.target.value)}>
              <option value="">Select Categories</option>
              <option value="Processor">Processors</option>
              <option value="Motherboard">Motherboard</option>
              <option value="Graphic Card">Graphics Card</option>
              <option value="Memory">Memory</option>
            </select>
            {errCategory ? <span>Please choose this product category</span> : null}
          </div>
        </div>
        <div className="product-edit-desc-container">
          <label htmlFor="product-desc">Product Description:</label>
          <textarea
            id="product-desc"
            name="description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Insert product description.."
          ></textarea>
          {errDescription ? <span>This field is required</span> : null}
        </div>
        <div className="product-meta-container">
          <div className="meta-container">
            <span>Product is New?</span>
            <Switch name="new" checked={productNew} onChange={() => setProductNew(!productNew)} />
          </div>
          <div className="meta-container">
            <span>Product is Best?</span>
            <Switch name="best" checked={productBest} onChange={() => setProductBest(!productBest)} />
          </div>
        </div>
        <div className="product-edit-button-container">
          <button
            className="cancel"
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </button>
          {state.passed_id ? (
            <button
              className="save"
              onClick={() => {
                errClear();
                validator();
                updateProductHandler();
              }}
            >
              Save
            </button>
          ) : (
            <button
              className="add"
              onClick={() => {
                errClear();
                validator();
                addProductHandler();
              }}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductEdit;
