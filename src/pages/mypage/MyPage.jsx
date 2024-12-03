import React, { useState, useEffect } from 'react';
import styles from './MyPage.module.css';
import SideBar from '../SideBar';
import UserProfile from './UserProfile';
import ProductList from './ProductList';
import ReviewList from './ReviewList';
import avatar from "../data/avatar.png";

function MyPage() {
  const [products, setProducts] = useState([]); // 상품 목록 상태
  const [isNotificationVisible, setIsNotificationVisible] = useState(false); // 알림 창 상태
  const studentId = localStorage.getItem("student_id"); // 현재 로그인된 사용자 ID

  // **1. LocalStorage에서 데이터 불러오기**
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(savedProducts);
  }, []);

  const handleNotificationClick = () => {
    setIsNotificationVisible(!isNotificationVisible); // 알림 창 표시 상태 전환
  };

  // **2. 현재 사용자 ID와 일치하는 상품 필터링**
  const filteredProducts = products.filter(
    (product) => product.userId === studentId
  );

  return (
    <div className={styles.myPageContainer}>
      <SideBar />
      <main className={styles.mainContent}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>마이페이지</h1>
          <div className={styles.userIcons}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/03ed7ff2fb1e7c53557240672da85ebfc178133bd4f13717960dbae4d0118d17?placeholderIfAbsent=true&apiKey=4ff31f8795cd4edc98e7741aaa589c6c"
              alt="Notifications"
              className={styles.notificationIcon}
              onClick={handleNotificationClick}
              style={{ cursor: 'pointer' }}
            />

            {isNotificationVisible && (
                <div className={styles.notificationDropdown}>
                    <h4>알림</h4>
                    <p>새로운 알림이 있습니다!</p>
                    <ul className={styles.notificationUl}>
                        <li className={styles.notificationLi}>
                            <img className={styles.notificationAvatar} alt="User Avatar" src={avatar} />
                            <span> 사용자1: 제품이 입고되었습니다.</span>
                        </li>
                        <li className={styles.notificationLi}>
                            <img className={styles.notificationAvatar} alt="User Avatar" src={avatar} />
                            <span> 사용자2: 세일이 시작되었습니다.</span>
                        </li>
                        <li className={styles.notificationLi}>
                            <img className={styles.notificationAvatar} alt="User Avatar" src={avatar} />
                            <span> 사용자3: 새로운 메시지가 도착했습니다.</span>
                        </li>
                    </ul>
                    <button onClick={handleNotificationClick}>닫기</button>
                </div>
            )}
          </div>
        </header>
        <UserProfile />
        <section className={styles.contentSection}>
          <ProductList products={filteredProducts} /> {/* 필터링된 상품 전달 */}
          <ReviewList />
        </section>
      </main>
    </div>
  );
}

export default MyPage;
