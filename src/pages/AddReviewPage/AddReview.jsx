// src/components/AddReview.jsx

import React, { useState } from 'react';
import starIcon from '../../assets/image/Star.png';

import styles from './AddReview.module.css';

const AddReview = ({ closeModal, recipientUserId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = () => {
    const currentUserId = localStorage.getItem("student_id");
    const nickname = localStorage.getItem("nickname");

    const newReview = {
      id: Date.now(), // Unique review ID
      name: nickname, // Current user’s name
      userId: recipientUserId, // Review recipient’s user ID
      rating, // Rating (1-5)
      comment: review, // Review content
    };

    // Retrieve existing reviews from localStorage
    const existingReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const updatedReviews = [...existingReviews, newReview];
    localStorage.setItem("reviews", JSON.stringify(updatedReviews)); // Save updated reviews to localStorage

    alert(`리뷰가 제출되었습니다!\n리뷰: ${review}\n별점: ${rating}점`);
    setReview("");
    setRating(0);
    closeModal(); // Close the modal
  };

  const handleRating = (ratingValue) => {
    setRating(ratingValue);
  };

  return (
    <div className={styles.addReviewModal}>
      <div className={styles.reviewTitle}>리뷰 남기기</div>

      {/* Star rating section */}
      <div className={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${rating >= star ? styles.filled : ''}`} // Filled star styling
            onClick={() => handleRating(star)} // Update rating on click
          >
            <img
              src={starIcon}
              alt={`star-${star}`}
              className={`${styles.starIcon} ${rating >= star ? styles.active : styles.inactive}`} // Handle active/inactive state
            />
          </span>
        ))}
      </div>

      <textarea
        className={styles.reviewInput}
        value={review}
        onChange={handleReviewChange}
        placeholder="거래에 대한 한 줄 리뷰를 남겨주세요"
      />
      <div className={styles.buttonContainer}>
        <button className={styles.submitButton} onClick={handleSubmit}>
          완료
        </button>
      </div>
      <button className={styles.closeReviewModal} onClick={closeModal}>
        닫기
      </button>
    </div>
  );
};

export default AddReview;
