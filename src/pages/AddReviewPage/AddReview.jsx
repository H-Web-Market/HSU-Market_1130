import React, { useState } from 'react';
import starIcon from '../../assets/image/Star.png';

import styles from './AddReview.module.css';

const AddReview = ({ closeModal }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);  // 별점 상태 추가

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = () => {
    // 리뷰 제출 로직
    alert(`리뷰: ${review} / 별점: ${rating}점\n리뷰가 제출되었습니다!`);
    closeModal(); // 모달 닫기
  };

   // 별점을 설정하는 함수
   const handleRating = (ratingValue) => {
    setRating(ratingValue);
  };

  return (
    <div className={styles.addReviewModal}>
      <div className={styles.reviewTitle}>리뷰 남기기</div>

      {/* 별점 선택 영역 */}
      <div className={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${rating >= star ? styles.filled : ''}`} // 채워진 별 적용
            onClick={() => handleRating(star)} // 클릭 시 별점 변경
          >
            <img
              src={starIcon}
              alt={`star-${star}`}
              className={`${styles.starIcon} ${rating >= star ? styles.active : styles.inactive}`} // 투명도 적용
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
        <button className={styles.submitButton} onClick={handleSubmit}>완료</button>
      </div>
      <button className={styles.closeReviewModal} onClick={closeModal}>닫기</button>
    </div>
  );
};

export default AddReview;
