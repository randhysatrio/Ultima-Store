import React, { useState, useEffect } from 'react';

import '../assets/styles/AdminProductsPage.css';
import { RiEdit2Line, RiDeleteBin5Line } from 'react-icons/ri';
import { IoMdClose, IoMdCheckmark } from 'react-icons/io';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useNavigate } from 'react-router-dom';

const AdminProductsPage = () => {
  const [productList, setProductList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchWord, setSeachword] = useState('');
  const [sortVal, setSortVal] = useState('asc');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(20);
  const [maxPage, setMaxPage] = useState(0);
  const navigate = useNavigate();

  const fetchProductData = () => {
    Axios.get(`${API_URL}/products`)
      .then((response) => {
        setProductList(response.data);
        setFilteredList(response.data);
        setMaxPage(Math.ceil(response.data.length / itemPerPage));
        setCurrentPage(1);
      })
      .catch(() => {
        toast.warn('Unable to get product data!', { position: 'bottom-left', theme: 'colored' });
      });
  };

  // const deleteBtnHandler = (val) => {
  //   Axios.delete(`${API_URL}/products/${val}`)
  //     .then(() => {
  //       toast.warn('Deleted Product', { position: 'bottom-left', theme: 'colored' });
  //       fetchProductData();
  //     })
  //     .catch(() => {
  //       toast.error('Failed to delete product', { position: 'bottom-left', theme: 'colored' });
  //     });
  // };

  const deleteBtnHandler = (val) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <span>Are you sure you want to delete this item?</span>
            <div className="close-button-container">
              <button className="close-button" onClick={onClose}>
                <IoMdClose />
              </button>
              <button
                onClick={() => {
                  Axios.delete(`${API_URL}/products/${val}`)
                    .then(() => {
                      toast.warn('Deleted Product', { position: 'bottom-left', theme: 'colored' });
                      fetchProductData();
                      onClose();
                    })
                    .catch(() => {
                      toast.error('Failed to delete product', { position: 'bottom-left', theme: 'colored' });
                    });
                }}
                className="check-button"
              >
                <IoMdCheckmark />
              </button>
            </div>
          </div>
        );
      },
    });
  };

  const filterHandler = () => {
    const dataToRender = productList.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchWord.toLowerCase()) && product.category.toLowerCase().includes(category.toLowerCase())
      );
    });

    setFilteredList(dataToRender);
    setMaxPage(Math.ceil(dataToRender.length / itemPerPage));
    setCurrentPage(1);
  };

  const renderProductData = () => {
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
        filteredList.sort((a, b) => sorter(a.name, b.name));
        break;
      case 'dsc':
        filteredList.sort((a, b) => sorter(b.name, a.name));
        break;
      default:
        break;
    }

    const beginningIndex = (currentPage - 1) * itemPerPage;
    const finalIndex = beginningIndex + parseInt(itemPerPage);

    const finalData = filteredList.slice(beginningIndex, finalIndex);

    return finalData.map((product, index) => {
      return (
        <div className="admin-products-container" key={product.id}>
          <div className="admin-product-index">
            <span>{beginningIndex ? index + 1 + beginningIndex : index + 1}. </span>
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
            <button
              onClick={() => {
                navigate('/Admin/AdminProductEdit', { state: { passed_id: product.id } });
              }}
              className="edit-button"
            >
              <RiEdit2Line />
            </button>
            <button
              onClick={() => {
                deleteBtnHandler(product.id);
              }}
              className="delete-button"
            >
              <RiDeleteBin5Line />
            </button>
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    filterHandler();
  }, [category, searchWord]);

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
              placeholder="Search Product Name..."
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
              onClick={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option className="cat-options" value="">
                All Category
              </option>
              <option className="cat-options" value="Processor">
                Processors
              </option>
              <option className="cat-options" value="Motherboard">
                Motherboard
              </option>
              <option className="cat-options" value="Graphic Card">
                Graphics Card
              </option>
              <option className="cat-options" value="Memory">
                Memory
              </option>
            </select>
          </div>
          <div className="admin-filter-container">
            <label htmlFor="sort" className="filter-label-text">
              Sort:
            </label>
            <select
              id="sort"
              onChange={(e) => {
                setSortVal(e.target.value);
              }}
            >
              <option className="cat-options" value="asc">
                A to Z
              </option>
              <option className="cat-options" value="dsc">
                Z to A
              </option>
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
                setMaxPage(Math.ceil(filteredList.length / e.target.value));
                setCurrentPage(1);
              }}
            >
              <option className="cat-options" value={20}>
                20
              </option>
              <option className="cat-options" value={40}>
                40
              </option>
              <option className="cat-options" value={60}>
                60
              </option>
              <option className="cat-options" value={filteredList.length}>
                All
              </option>
            </select>
          </div>
          <button
            className="admin-filter-container-button"
            onClick={() => {
              navigate('/Admin/AdminProductEdit', { state: { passed_id: '' } });
            }}
          >
            Add Products
          </button>
        </div>
        <div className="admin-products-list-container">
          <div className="admin-products-list">{renderProductData()}</div>
        </div>
        <div className="admin-products-nav-container">
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
              document.body.scrollIntoView();
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
              if (currentPage < maxPage) {
                setCurrentPage(currentPage + 1);
              }
              document.body.scrollIntoView();
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
