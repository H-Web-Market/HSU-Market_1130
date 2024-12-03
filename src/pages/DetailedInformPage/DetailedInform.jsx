import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./DetailedInform.module.css";
import Sidebar from "../SideBar";
import SearchBar from "../mypage/SearchBar";
import { ProductForm } from "./ProductForm";
import emptyHeart from "../data/emptyheart.png";
import filledHeart from "../data/heart.svg";

export const DetailedInform = () => {
    const { title } = useParams(); // URL 파라미터에서 제목 가져오기
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null);

    // localStorage에서 products 데이터 가져오기
    useEffect(() => {
        const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
        setProducts(storedProducts);

        const foundProduct = storedProducts.find(p => p.title === title);
        setProduct(foundProduct);
    }, [title]);

    const handleNotificationClick = () => {
        navigate('/notification');
    };

    const handleUserAvatarClick = () => {
        navigate('/mypage');
    };

    const handleChatBtnClick = () => {
        navigate('/Chat');
    };

    const toggleLike = () => {
        const updatedProduct = { ...product, isLiked: !product.isLiked };
    
        // localStorage 업데이트
        const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
        const updatedProducts = storedProducts.map((p) =>
          p.title === updatedProduct.title ? updatedProduct : p
        );
        localStorage.setItem("products", JSON.stringify(updatedProducts));
    
        // 상태 업데이트
        setProduct(updatedProduct);
      };

    if (!product) return <p>Loading...</p>; // 제품 정보가 없으면 로딩 메시지 표시

    return (
        <div className={styles.detailInformPageContainer}>
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
                            style={{ cursor: 'pointer' }}
                        />
                        <img 
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/bf7a9a8e05d2698d57ae5e99b196bf039513b5a28e9d9c00b4aa82e8636b86f6?placeholderIfAbsent=true&apiKey=4ff31f8795cd4edc98e7741aaa589c6c" 
                            alt="User avatar" 
                            className={styles.userAvatar} 
                            onClick={handleUserAvatarClick}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </header>
                <section className={styles.contentSection}>
                    <div className={styles.detailedInform}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>상세 정보</h1>
                        </div>
                        <div className={styles.contentWrapper}>
                            <section className={styles.productInfo}>
                                <nav className={styles.category} aria-label="Product category">
                                    카테고리 &gt; {product.category}
                                </nav>
                                <img
                                    src={product.imageSrc}
                                    className={styles.productImage}
                                    alt={product.title}
                                />
                                <div className={styles.likeAndChat}>
                                    <div className={styles.likeSection}>
                                        <div
                                        className={styles.likeButton}
                                        onClick={() => toggleLike(product.title)}
                                        style={{
                                            backgroundImage: `url(${product.isLiked ? filledHeart : emptyHeart})`,
                                        }}
                                        aria-label={`Toggle like for ${product.title}`}/>
                                        <span className={styles.likeCount}>{product.isLiked ? 33 : 32}</span>
                                    </div>
                                    <button 
                                        className={styles.chatButton} 
                                        onClick={handleChatBtnClick}
                                    >
                                        채팅하기
                                    </button>
                                </div>
                            </section>
                            <section className={styles.detailsSection}>
                                <ProductForm product={product} />
                                <div className={styles.sellerInfo}>
                                    <img
                                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7034da8a03ce4b89697220952b75e5bb70040125bb2f96edb292d0a74c5dcb1f?placeholderIfAbsent=true&apiKey=8c4d60d027684d439facb424f5fad44b"
                                        className={styles.sellerAvatar}
                                        alt=""
                                    />
                                    <span className={styles.sellerName}>{product.nickname}</span>
                                </div>
                            </section>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DetailedInform;
