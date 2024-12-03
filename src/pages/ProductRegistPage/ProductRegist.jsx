import React, { useState } from "react";
import styles from "./ProductRegist.module.css";
import Sidebar from "../SideBar";
import SearchBar from "../mypage/SearchBar";
import ImageUpload from "./ImageUpload";
import ProductForm from "./ProductForm";
import { useNavigate } from "react-router-dom";
import avatar from "../data/avatar.png";

export const ProductRegist = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageSrc, setImageSrc] = useState(null); // Base64 이미지 저장
  const [isNotificationVisible, setIsNotificationVisible] = useState(false); // 알림 창 상태

  const navigate = useNavigate();
  const categories = ["가전제품", "패션", "전자기기", "생활용품"];

  // **상품 추가**
  const handleAddProduct = (event) => {
    event.preventDefault(); // 폼 기본 동작 차단

    const newProduct = {
      id: Date.now(), // 고유 ID
      title,
      price,
      description,
      category,
      time: Date.now(), // 현재 시간을 저장
      imageSrc, // Base64 이미지 데이터
      isLiked: false,
      userId : localStorage.getItem("student_id"),
      nickname : localStorage.getItem("nickname")
    };

    // 기존 데이터와 병합 후 저장
    const existingProducts = JSON.parse(localStorage.getItem("products")) || [];
    const updatedProducts = [...existingProducts, newProduct];
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    // 홈 페이지로 이동
    navigate("/home");

    // 입력 필드 초기화
    setTitle("");
    setPrice("");
    setDescription("");
    setCategory("");
    setImageSrc(null);
  };

  // **이미지 변경 (Base64 변환)**
  const handleImageChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        if (base64Data) {
          setImageSrc(base64Data); // Base64 데이터를 상태에 저장
          console.log("Image converted to Base64:", base64Data); // 디버깅용 로그
        } else {
          console.error("Failed to convert image to Base64.");
        }
      };
      reader.onerror = () => {
        console.error("FileReader failed to read the file.");
      };
      reader.readAsDataURL(file); // 파일을 Base64로 변환
    } else {
      console.error("No file selected.");
    }
  };
  

  const handleNotificationClick = () => {
    setIsNotificationVisible(!isNotificationVisible); // 알림 창 표시 상태 전환
  };

  const handleUserAvatarClick = () => {
    navigate("/mypage");
  };

  return (
    <div className={styles.registPageContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.pageHeader}>
          <SearchBar />
          <div className={styles.userIcons}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/03ed7ff2fb1e7c53557240672da85ebfc178133bd4f13717960dbae4d0118d17?placeholderIfAbsent=true&apiKey=4ff31f8795cd4edc98e7741aaa589c6c"
              alt="Notifications"
              className={styles.notificationIcon}
              onClick={handleNotificationClick}
              style={{ cursor: "pointer" }}
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bf7a9a8e05d2698d57ae5e99b196bf039513b5a28e9d9c00b4aa82e8636b86f6?placeholderIfAbsent=true&apiKey=4ff31f8795cd4edc98e7741aaa589c6c"
              alt="User avatar"
              className={styles.userAvatar}
              onClick={handleUserAvatarClick}
              style={{ cursor: "pointer" }}
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
        <section className={styles.contentSection}>
          <div className={styles.productRegist}>
            <div className={styles.header}>
              <h1 className={styles.title}>상품 등록</h1>
            </div>
            <div className={styles.productContent}>
              <div className={styles.imageContainer}>
                <ImageUpload handleImageChange={handleImageChange} imageSrc={imageSrc} />
              </div>
              <div className={styles.productInfoContainer}>
                <ProductForm
                  handleAppProduct={handleAddProduct}
                  categories={categories}
                  title={title}
                  price={price}
                  description={description}
                  category={category}
                  setTitle={setTitle}
                  setPrice={setPrice}
                  setDescription={setDescription}
                  setCategory={setCategory}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductRegist;
