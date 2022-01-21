import React, { useState, useEffect } from 'react';

import '../assets/styles/AllProducts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';

import { FaMemory } from 'react-icons/fa';
import { GiCircuitry } from 'react-icons/gi';
import { SiGraphql } from 'react-icons/si';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';

import ProductCardAll from '../components/ProductCardAll';

import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useLocation } from 'react-router-dom';

const AllProducts = () => {
  const { state } = useLocation();

  const [productList, setProductList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [sortVal, setSortVal] = useState('');
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [itemPerPage, setItemPerPage] = useState(15);

  const fetchProductList = () => {
    if (state.passed_key) {
      Axios.get(`${API_URL}/products`, {
        params: {
          category: state.passed_key,
        },
      })
        .then((response) => {
          delete state.passed_key;
          setProductList(response.data);
          setMaxPage(Math.ceil(response.data.length / itemPerPage));
        })
        .catch(() => {
          alert('Unable to load product data!');
        });
    } else if (keyword) {
      Axios.get(`${API_URL}/products`, {
        params: {
          category: keyword,
        },
      })
        .then((response) => {
          delete state.passed_key;
          setProductList(response.data);
          setMaxPage(Math.ceil(response.data.length / itemPerPage));
        })
        .catch(() => {
          alert('Unable to load product data!');
        });
    } else {
      Axios.get(`${API_URL}/products`)
        .then((response) => {
          delete state.passed_key;
          setProductList(response.data);
          setMaxPage(Math.ceil(response.data.length / itemPerPage));
        })
        .catch(() => {
          alert('Unable to load product data!');
        });
    }
  };

  const renderProduct = () => {
    const dataToRender = [...productList];

    const asc = (a, b) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    };

    switch (sortVal) {
      case 'low':
        dataToRender.sort((a, b) => a.price - b.price);
        break;
      case 'high':
        dataToRender.sort((a, b) => b.price - a.price);
        break;
      case 'asc':
        dataToRender.sort((a, b) => asc(a.name, b.name));
        break;
      case 'dsc':
        dataToRender.sort((a, b) => asc(b.name, a.name));
        break;
      default:
        break;
    }

    const beginningIndex = (page - 1) * itemPerPage;

    const finalData = dataToRender.slice(beginningIndex, beginningIndex + itemPerPage);

    return finalData.map((product) => {
      return <ProductCardAll key={product.id} product={product} />;
    });
  };

  const prevPageHandler = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const nextPageHandler = () => {
    if (page < maxPage) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, [keyword]);

  return (
    <div className="container">
      <div className="row">
        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '2rem', margin: '1rem 0' }}>
          <h3
            className="page-header"
            onClick={() => {
              setKeyword();
              setPage(1);
            }}
          >
            Our Products
          </h3>
        </div>
        <div className="col-2">
          <div className="category-container">
            <span className="category-title-header">Categories</span>
            <div className="line" />
            <button
              className="category-btn"
              onClick={() => {
                setKeyword('Processor');
                setPage(1);
              }}
            >
              <span>
                <FontAwesomeIcon icon={faMicrochip} style={{ textShadow: '0px 1px 6px #000000' }} />
              </span>
              Processors
            </button>
            <button
              className="category-btn"
              onClick={() => {
                setKeyword('Motherboard');
                setPage(1);
              }}
            >
              <span>
                <GiCircuitry />
              </span>
              Motherboard
            </button>
            <button
              className="category-btn"
              onClick={() => {
                setKeyword('Graphic Card');
                setPage(1);
              }}
            >
              <span>
                <SiGraphql />
              </span>
              Graphic Cards
            </button>
            <button
              className="category-btn"
              onClick={() => {
                setKeyword('Memory');
                setPage(1);
              }}
            >
              <span>
                <FaMemory />
              </span>
              Memory
            </button>
          </div>
          <div className="category-container">
            <span>Sort Products</span>
            <div className="line" />
            <select
              onChange={(event) => {
                setSortVal(event.target.value);
              }}
              className="sort-select"
            >
              <option value="">Default</option>
              <option value="low">Lowest Price</option>
              <option value="high">Highest Price</option>
              <option value="asc">A to Z</option>
              <option value="dsc">Z to A</option>
            </select>
          </div>
          <div className="category-container">
            <span>Show Products</span>
            <div className="line" />
            <select
              className="sort-select"
              onChange={(event) => {
                setItemPerPage(event.target.value);
                setMaxPage(Math.ceil(productList.length / event.target.value));
                setPage(1);
              }}
            >
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={45}>45</option>
              <option value={productList.length}>All</option>
            </select>
          </div>
        </div>
        <div className="col-10">
          <div className="items-container">{renderProduct()}</div>
          <div className="page-container">
            <div className="page-button-container">
              <button onClick={prevPageHandler} disabled={page === 1} className="btn-page">
                <GrFormPrevious />
              </button>
              <span className="page-display">
                {page} of {maxPage}
              </span>
              <button onClick={nextPageHandler} disabled={page === maxPage} className="btn-page">
                <GrFormNext />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
