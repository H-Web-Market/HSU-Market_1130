import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Chat.module.css';
import SideBar from '../SideBar';  // SideBar 컴포넌트 임포트

// 이미지 임포트
import Product1Img from '../../assets/image/Product1.jpeg';
import Profile1Img from '../../assets/image/Profile1.jpeg';
import defaultProfile from '../../assets/image/DefaultProfile.png';

const Chat = () => {
  const navigate = useNavigate();

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  const chatRooms = [
    { id: 1, name: '상대방 이름 1', lastMessage: '마지막 메시지 1', profileImg: Profile1Img, productImg: Product1Img },
    { id: 2, name: '상대방 이름 2', lastMessage: '마지막 메시지 2', profileImg: Profile1Img, productImg: Product1Img },
    { id: 3, name: '상대방 이름 3', lastMessage: '마지막 메시지 3', profileImg: Profile1Img, productImg: Product1Img },
  ];

  const getProfileImage = (profileImg) => {
    return profileImg || defaultProfile;
  };

  return (
    <div className={styles.page}>
      <SideBar />
      <div className={styles.chatArea}>
        <div className={styles.chatTitle}>채팅</div>
        <div className={styles.chatList}>
          <ul>
            {chatRooms.map((chatRoom) => (
              <li key={chatRoom.id} onClick={() => handleChatClick(chatRoom.id)}>
                <div className={styles.chatRoom}>
                  <img className={styles.profileImg} src={getProfileImage(chatRoom.profileImg)} alt={`Profile ${chatRoom.id}`} />
                  <div className={styles.chatRoomContents}>
                    <div className={styles.chatRoomHeader}>
                      <span className={styles.chatRoomName}>{chatRoom.name}</span>
                      <span className={styles.chatDate}>오늘</span>
                    </div>
                    <div className={styles.lastMessage}>{chatRoom.lastMessage}</div>
                  </div>
                  <img className={styles.productImg} src={chatRoom.productImg} alt={`Product ${chatRoom.id}`} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chat;