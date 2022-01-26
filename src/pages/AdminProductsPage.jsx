import React, { useState, useEffect } from 'react';

import '../assets/styles/AdminProductsPage.css';

import Axios from 'axios';
import { API_URL } from '../assets/constants';

const AdminProductsPage = () => {
  const [productList, setProductList] = useState([]);
  const [searchWord, setSeachword] = useState('');
  const [sortVal, setSortVal] = useState('asc');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(20);
  const [maxPage, setMaxPage] = useState(0);

  const fetchProductData = () => {
    Axios.get(`${API_URL}/products`)
      .then((response) => {
        setProductList(response.data);
        setMaxPage(Math.ceil(response.data.length / itemPerPage));
      })
      .catch(() => {
        alert('Unable to get product data!');
      });
  };

  const renderProductData = () => {
    const dataToRender = productList.filter((data) => {
      return data.name.toLowerCase().includes(searchWord.toLowerCase()) && data.category.toLowerCase().includes(category.toLowerCase());
    });

    const sorter = (a, b) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    };

    switch (sortVal) {
      case 'asc':
        dataToRender.sort((a, b) => sorter(a.name, b.name));
        break;
      case 'dsc':
        dataToRender.sort((a, b) => sorter(b.name, a.name));
        break;
      default:
        break;
    }

    const beginningIndex = (currentPage - 1) * itemPerPage;

    const finalData = dataToRender.slice(beginningIndex, beginningIndex + itemPerPage);

    return finalData.map((product, index) => {
      return (
        <div className="admin-products-container">
          <div className="admin-product-index">
            <span>{index + 1}. </span>
          </div>
          <div className="admin-product-category">
            <span className="admin-subtext">Category:</span>
            <span className="admin-maintext">{product.category}</span>
          </div>
          <div className="admin-product-name">
            <span className="admin-subtext">Product Name: </span>
            <span>{product.name}</span>
          </div>
          <div className="admin-product-image">
            <div className="image-container">
              <img src={product.image} />
            </div>
          </div>
          <div className="admin-product-button">
            <button>Edit Product</button>
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <div className="admin-products-page-body">
      <div className="admin-products-page-header">
        <span>Products List</span>
      </div>
      <div className="admin-products-main-container">
        <div className="admin-products-header-container">
          <div className="admin-filter-search-container">
            <input
              id="search-input"
              type="text"
              placeholder="Search Products..."
              name="searchWord"
              onChange={(e) => {
                setSeachword(e.target.value);
              }}
            />
          </div>
          <div className="admin-filter-container">
            <label htmlFor="category" className="filter-label-text">
              Categories:
            </label>
            <select
              id="category"
              onChange={(e) => {
                setCurrentPage(1);
                setCategory(e.target.value);
              }}
            >
              <option value="">All Category</option>
              <option value="Processor">Processors</option>
              <option value="Motherboard">Motherboard</option>
              <option value="Graphic Card">Graphics Card</option>
              <option value="Memory">Memory</option>
            </select>
          </div>
          <div className="admin-filter-container">
            <label htmlFor="sort" className="filter-label-text">
              Sort by:
            </label>
            <select
              id="sort"
              onChange={(e) => {
                setSortVal(e.target.value);
              }}
            >
              <option value="asc">A to Z</option>
              <option value="dsc">Z to A</option>
            </select>
          </div>
          <div className="admin-filter-container">
            <label htmlFor="sort" className="filter-label-text">
              Show:
            </label>
            <select
              id="sort"
              onChange={(e) => {
                setItemPerPage(e.target.value);
                setMaxPage(Math.ceil(productList.length / e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={20}>20</option>
              <option value={40}>40</option>
              <option value={60}>60</option>
              <option value={productList.length}>All</option>
            </select>
          </div>
          <button className="admin-filter-container-button">Add Products</button>
        </div>
        <div className="admin-products-list-container">
          <div className="admin-products-list">{renderProductData()}</div>
        </div>
        <div className="admin-products-nav-container">
          <button
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
            disabled={currentPage === 1}
          >
            -
          </button>
          <span>
            {currentPage} of {maxPage}
          </span>
          <button
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
            disabled={currentPage === maxPage}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;
