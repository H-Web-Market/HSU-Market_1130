import React from 'react';
import styles from './ReviewList.module.css';
import ReviewCard from './ReviewCard';

const ReviewList = ({ reviews }) => {
  return (
    <section className={styles.reviewListSection}>
      <h2 className={styles.sectionTitle}>Review</h2>
      <div className={styles.reviewList}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            등록된 리뷰가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewList;
