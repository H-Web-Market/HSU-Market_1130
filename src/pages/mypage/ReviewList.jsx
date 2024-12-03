import React, { useState, useEffect } from 'react';
import styles from './ReviewList.module.css';
import ReviewCard from './ReviewCard';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 리뷰 데이터를 가져오는 함수
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      // API 호출을 통해 리뷰 데이터를 가져오는 로직
      // 예시로 더미 데이터를 사용
      const dummyData = [
        { id: 1, name: "hyundo", rating: "4.8", comment: "좋은 거래 감사합니다!!" },
        { id: 2, name: "sunbin", rating: "5.0", comment: "좋은 거래 감사합니다!!" },
        { id: 3, name: "junho", rating: "4.2", comment: "좋은 거래 감사합니다!!" },
        { id: 4, name: "gayoung", rating: "4.7", comment: "좋은 거래 감사합니다!!" },
        { id: 5, name: "potato", rating: "4.7", comment: "좋은 거래 감사합니다!!" },
        { id: 6, name: "karina", rating: "4.7", comment: "좋은 거래 감사합니다!!" }
      ];
      
      setReviews(dummyData);
    } catch (error) {
      console.error('리뷰를 불러오는 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  if (isLoading) {
    return (
      <section className={styles.reviewListSection}>
        <h2 className={styles.sectionTitle}>Review</h2>
        <div className={styles.reviewList}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            리뷰를 불러오는 중...
          </div>
        </div>
      </section>
    );
  }

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