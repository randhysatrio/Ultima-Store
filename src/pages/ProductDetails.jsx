import React, { useEffect, useState } from 'react';

import '../assets/styles/ProductDetails.css';
import { FaShippingFast } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { GiDeliveryDrone } from 'react-icons/gi';
import { MdOutlineRecommend, MdOutlineSell } from 'react-icons/md';
import { GoPlus } from 'react-icons/go';
import { HiMinus } from 'react-icons/hi';
import { RiArrowGoBackLine } from 'react-icons/ri';
import { BsCartCheck } from 'react-icons/bs';
import { toast } from 'react-toastify';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useDispatch, useSelector } from 'react-redux';

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const d = new Date();
  const userGlobal = useSelector((state) => state.user);
  const [productData, setProductData] = useState({});
  const [qty, setQty] = useState(1);
  const [reviewList, setReviewList] = useState([]);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [stars, setStars] = useState(1);
  const [anonymus, setAnonymus] = useState(false);

  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');

  // const fetchProductData = () => {
  //   Axios.get(`${API_URL}/products`, {
  //     params: {
  //       id: params.productID,
  //     },
  //   })
  //     .then((response) => {
  //       setProductData(response.data[0]);
  //     })
  //     .catch(() => {
  //       toast.error('Unable to load product data', { position: 'bottom-left', theme: 'colored' });
  //     });
  // };

  const fetchProductData = async () => {
    try {
      const response = await Axios.get(`${API_URL}/products`, {
        params: {
          id: params.productID,
        },
      });
      setProductData(response.data[0]);
    } catch (err) {
      toast.error('Unable to load product data', { position: 'bottom-left', theme: 'colored' });
    }
  };

  const notify = (val, msg) => {
    if (val === 'ok') {
      toast.success(msg, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } else {
      toast.error(msg, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  const updateCartData = async (userID) => {
    try {
      const response = await Axios.get(`${API_URL}/carts`, {
        params: {
          userID,
        },
      });
      dispatch({
        type: 'FILL_CART',
        payload: response.data,
      });
    } catch (err) {
      toast.error('Unable to update cart data', { position: 'bottom-left', theme: 'colored' });
    }
  };

  const addToCartHandler = async () => {
    try {
      const response = await Axios.get(`${API_URL}/carts`, {
        params: {
          userID: userGlobal.id,
          productID: productData.id,
        },
      });
      if (response.data.length) {
        await Axios.patch(`${API_URL}/carts/${response.data[0].id}`, {
          productQty: response.data[0].productQty + qty,
        });
        toast.success('Added this item product quantity!', { position: 'bottom-left', theme: 'colored' });
        updateCartData(userGlobal.id);
      } else {
        await Axios.post(`${API_URL}/car`, {
          userID: userGlobal.id,
          username: userGlobal.username,
          productID: productData.id,
          productName: productData.name,
          productImage: productData.image,
          productPrice: productData.price,
          productQty: qty,
        });
        toast.success('Added this product to your cart!', { position: 'bottom-left', theme: 'colored' });
        updateCartData(userGlobal.id);
      }
    } catch (err) {
      notify('fail', err);
    }
  };

  const fetchReviewData = async () => {
    try {
      const response = await Axios.get(`${API_URL}/reviews`, {
        params: {
          productID: params.productID,
        },
      });
      setReviewList(response.data.reverse());
    } catch (err) {
      toast.error('Unable to get product reviews data', { position: 'bottom-left', theme: 'colored' });
    }
  };

  const renderReviews = () => {
    return reviewList.map((review) => {
      return (
        <div className="product-details-review-container">
          <div className="product-details-review-header">
            <div className="product-details-header-content-container">
              <span className="product-details-review-header-text">{review.title}</span>
              <div className="product-details-star-container">{renderStar(review.stars)}</div>
            </div>
            <span className="product-details-review-header-subtext">by</span>
            <span>
              {review.anonymus ? `${review.username[0]}*****${review.username[review.username.length - 1]}` : `${review.username}`}
            </span>
          </div>
          <div className="product-details-review-content-container">
            <div className="product-details-review-content">
              <span>{review.content}</span>
            </div>
          </div>
          <div className="product-details-review-footer-container">
            <span>
              {review.reviewYear}/{review.reviewMonth}/{review.reviewDate} {review.reviewHours}:{review.reviewMinutes}:
              {review.reviewSeconds}
            </span>
            {review.userID === userGlobal.id || userGlobal.role === 'admin' ? (
              <>
                <button
                  className="product-review-edit"
                  onClick={() => {
                    editHandler(review);
                  }}
                >
                  Edit
                </button>
                <button
                  className="product-review-delete"
                  onClick={() => {
                    deleteReview(review.id);
                  }}
                >
                  Delete
                </button>
              </>
            ) : null}
          </div>
        </div>
      );
    });
  };

  const renderStar = (val) => {
    const stars = [];

    for (let i = 0; i < val; i++) {
      stars.push(<AiFillStar />);
    }

    return stars;
  };

  const deleteReview = async (reviewID) => {
    try {
      await Axios.delete(`${API_URL}/reviews/${reviewID}`);
      toast.success('Deleted your review!', { position: 'bottom-left', theme: 'colored' });
      fetchReviewData();
    } catch (err) {
      toast.error('Unable to delete review', { position: 'bottom-left', theme: 'colored' });
    }
  };

  const editHandler = (review) => {
    let newStars = review.stars;
    let newTitle = review.title;
    let newContent = review.content;

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="product-details-post-input-container" style={{ height: '22rem', width: '30rem' }}>
            <div className="product-details-post-header-input-container">
              <div className="product-details-post-input">
                <label htmlFor="review-title-input">Title:</label>
                <input
                  type="text"
                  id="review-title-input"
                  placeholder="Insert review title.."
                  defaultValue={review.title}
                  maxLength="40"
                  onChange={(e) => {
                    newTitle = e.target.value;
                  }}
                />
              </div>
              <div className="product-details-post-stars">
                <label htmlFor="stars-options">Stars</label>
                <select
                  id="stars-options"
                  defaultValue={review.stars}
                  onChange={(e) => {
                    newStars = e.target.value;
                  }}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
            </div>
            <div className="product-details-post-header-textarea-container">
              <label htmlFor="product-details-review-input">Review:</label>
              <textarea
                id="product-details-review-input"
                placeholder="Insert product review.."
                defaultValue={review.content}
                maxLength="300"
                onChange={(e) => {
                  newContent = e.target.value;
                }}
              ></textarea>
            </div>
            <div className="product-details-post-header-button-container" style={{ padding: '0 2rem' }}>
              <button
                onClick={() => {
                  onClose();
                }}
                style={{ marginRight: '0.5rem', backgroundColor: '#dc1a1ace' }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newTitle) {
                    toast.error('Review title cannot be empty!', { position: 'bottom-left', theme: 'colored' });
                  } else if (!newContent) {
                    toast.error('Review content cannot be empty!', { position: 'bottom-left', theme: 'colored' });
                  } else {
                    try {
                      await Axios.patch(`${API_URL}/reviews/${review.id}`, {
                        stars: parseInt(newStars),
                        title: newTitle,
                        content: newContent,
                        reviewYear: d.getFullYear(),
                        reviewMonth: d.getMonth() + 1,
                        reviewDate: d.getDate(),
                        reviewHours: d.getHours(),
                        reviewMinutes: (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
                        reviewSeconds: (d.getSeconds() < 10 ? '0' : '') + d.getSeconds(),
                      });
                      toast.success('Updated your review!', { position: 'bottom-left', theme: 'colored' });
                      fetchReviewData();
                      onClose();
                    } catch (err) {
                      toast.error('Unable to update your review!', { position: 'bottom-left', theme: 'colored' });
                    }
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        );
      },
    });
  };

  const errClear = () => {
    setTitleError('');
    setContentError('');
  };

  const validator = () => {
    if (!reviewTitle) {
      setTitleError('Title cannot be empty!');
    } else if (reviewTitle.length > 40) {
      setTitleError('Title cannot be more than 40 characters!');
    }

    if (!reviewContent) {
      setContentError('Product review cannot be empty');
    } else if (reviewContent.length > 300) {
      setContentError('Product review cannot be more than 300 characters');
    }
  };

  const postProductReview = async () => {
    if (!reviewTitle) {
      return;
    } else if (!reviewContent) {
      return;
    } else if (reviewTitle.length > 40) {
      return;
    } else if (reviewContent.length > 300) {
      return;
    } else {
      try {
        await Axios.post(`${API_URL}/reviews`, {
          userID: userGlobal.id,
          productID: productData.id,
          stars: parseInt(stars),
          username: userGlobal.username,
          title: reviewTitle,
          content: reviewContent,
          anonymus: anonymus,
          reviewYear: d.getFullYear(),
          reviewMonth: d.getMonth() + 1,
          reviewDate: d.getDate(),
          reviewHours: d.getHours(),
          reviewMinutes: (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
          reviewSeconds: (d.getSeconds() < 10 ? '0' : '') + d.getSeconds(),
        });
        toast.success('Successfully post product review!', { position: 'bottom-left', theme: 'colored' });
        setReviewTitle('');
        setReviewContent('');
        setStars(1);
        setAnonymus(false);
        fetchReviewData();
      } catch (err) {
        toast.error('Unable to post product review!', { position: 'bottom-left', theme: 'colored' });
      }
    }
  };

  const renderProductStar = () => {
    let result = 0;

    reviewList.forEach((item) => {
      result += item.stars;
    });

    return result / reviewList.length;
  };

  useEffect(() => {
    fetchProductData();
    fetchReviewData();
  }, []);

  return (
    <div className="product-details-body">
      <div className="product-details-container">
        <div className="product-details-image-container">
          <img src={productData.image} />
        </div>
        <div className="product-details-content-container">
          <div className="product-details-info">
            <div className="product-title-container">
              <span className="product-title">{productData.name}</span>
              <span className="product-price">{productData.price ? `Rp. ${productData.price.toLocaleString('id')}` : null}</span>
              <div className="product-title-subtext-container">
                <BsCartCheck style={{ marginRight: '0.2rem' }} />
                <span className="product-stock me-2">{productData.stock} in stock</span>
                <MdOutlineSell style={{ marginRight: '0.2rem' }} />
                <span className="product-stock me-2">{productData.sold} sold</span>
                <AiFillStar style={{ marginRight: '0.2rem' }} />
                <span className="product-stock">{isNaN(renderProductStar()) ? `0` : renderProductStar().toFixed(1)} stars</span>
              </div>
            </div>
            <div className="product-info-container">
              <span className="product-info">{productData.description}</span>
            </div>
            <div className="product-metadata-container">
              {productData.price > 10000000 ? (
                <div className="product-metadata free">
                  <FaShippingFast />
                  <span>Free Shipping</span>
                </div>
              ) : null}
              {productData.best ? (
                <div className="product-metadata">
                  <MdOutlineRecommend />
                  <AiFillStar />
                  <span>ULTIMA Recommend</span>
                </div>
              ) : null}
              <div className="product-metadata">
                <GiDeliveryDrone />
                <span>Drone Delivery</span>
              </div>
            </div>
          </div>
          <div className="product-details-action">
            <div className="product-details-button-container">
              <button
                className="btn-plus"
                onClick={() => {
                  if (qty < productData.stock) {
                    setQty(qty + 1);
                  } else {
                    toast.warn('Maximum quantity reached!', { position: 'bottom-left', theme: 'colored' });
                  }
                }}
              >
                <GoPlus />
              </button>
              <div className="qty--container">
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => {
                    const amount = parseInt(e.target.value);
                    if (amount < 1) {
                      toast.warn('The minimum amount is 1!', { position: 'bottom-left', theme: 'colored' });
                    } else if (amount > productData.stock) {
                      toast.warn('Cannot go above maximum stock quantity!', { position: 'bottom-left', theme: 'colored' });
                    } else {
                      setQty(amount);
                    }
                  }}
                />
              </div>
              <button
                className="btn-min"
                onClick={() => {
                  if (qty > 1) {
                    setQty(qty - 1);
                  }
                }}
              >
                <HiMinus />
              </button>
            </div>
            <div className="button-buy-container">
              <button
                className="cart-btn"
                onClick={() => {
                  if (!qty) {
                    toast.error('Item quantity cannot be empty!', { position: 'bottom-left', theme: 'colored' });
                    setQty(1);
                  } else {
                    addToCartHandler();
                  }
                }}
                disabled={!userGlobal.username}
                style={{ cursor: !userGlobal.username ? 'not-allowed' : 'pointer' }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="previous-links-container">
        <span
          onClick={() => {
            navigate(-1);
          }}
        >
          <RiArrowGoBackLine /> Back
        </span>
      </div>
      <div className="product-details-review-section-container">
        <div className="product-details-post-header">
          <span>User Reviews</span>
        </div>
        {reviewList.length ? (
          renderReviews()
        ) : (
          <div className="empty-reviews-container">
            <span>Be the first to write review!</span>
          </div>
        )}
      </div>
      <div className="product-details-post-section">
        <div className="product-details-post-header">
          <span>Write your reviews</span>
        </div>
        {userGlobal.id ? (
          <div className="product-details-post-input-container">
            <div className="product-details-post-header-input-container">
              <div className="product-details-post-input">
                <label htmlFor="review-title-input">Title:</label>
                <input
                  type="text"
                  id="review-title-input"
                  placeholder="Insert review title.."
                  onChange={(e) => {
                    if (e.target.value.length < 40) {
                      setTitleError('');
                    } else {
                      setTitleError('Title cannot be more than 40 characters!');
                    }
                    setReviewTitle(e.target.value);
                  }}
                />
              </div>
              <div className="product-details-post-stars">
                <label htmlFor="stars-options">Stars</label>
                <select
                  id="stars-options"
                  value={stars}
                  onChange={(e) => {
                    setStars(e.target.value);
                  }}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
            </div>
            {titleError ? <span className="product-review-error-text">{titleError}</span> : null}
            <div className="product-details-post-header-textarea-container">
              <label htmlFor="product-details-review-input">Review:</label>
              <textarea
                id="product-details-review-input"
                placeholder="Insert product review.."
                onChange={(e) => {
                  if (e.target.value.length < 300) {
                    setContentError('');
                  } else {
                    setContentError('Product review cannot be more than 300 characters');
                  }
                  setReviewContent(e.target.value);
                }}
              ></textarea>
            </div>
            {contentError ? <span className="product-review-error-text">{contentError}</span> : null}
            <div className="product-details-post-header-button-container">
              <div className="product-detail-post-anonymus">
                <input
                  type="checkbox"
                  id="anonymus-check"
                  checked={anonymus}
                  onChange={() => {
                    setAnonymus(!anonymus);
                  }}
                />
                <label htmlFor="anonymus-check">Post as Anonymus?</label>
              </div>
              <button
                onClick={() => {
                  errClear();
                  validator();
                  postProductReview();
                }}
              >
                Post
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-reviews-container">
            <span>Sign in now to start review!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
