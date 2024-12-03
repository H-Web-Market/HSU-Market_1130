import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SideBar from '../SideBar'; // 분리된 사이드바 컴포넌트 import
import defaultProfile from '../../assets/image/DefaultProfile.png';
import sendIcon from '../../assets/image/Send.png';
import starIcon from '../../assets/image/Star.png';
import AddReview from '../AddReviewPage/AddReview';
import styles from './ChattingRoom.module.css';

// 상품 샘플 이미지 경로 
import Product1Img from '../../assets/image/Product1.jpeg';
import Profile1Img from '../../assets/image/Profile1.jpeg';
import io from 'socket.io-client';  // socket.io-client 임포트

const ChattingRoom = () => {
  const { chatId } = useParams(); // 채팅방 ID 가져오기
  const navigate = useNavigate();  // navigate 함수 선언
  const socket = io('http://localhost:4000'); // 서버 URL에 맞춰 수정 필요

  const [selectedChatId, setSelectedChatId] = useState(parseInt(chatId));
  const [isComposing, setIsComposing] = useState(false);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(null); // 상대방 평점 상태 추가
  const [chatRooms, setChatRooms] = useState([
    { id: 1, name: '상대방 이름 1', lastMessage: '마지막 메시지 1', profileImg: Profile1Img, productImg: Product1Img, lastMessageDate: new Date() },
    { id: 2, name: '상대방 이름 2', lastMessage: '마지막 메시지 2', profileImg: Profile1Img, productImg: Product1Img, lastMessageDate: new Date() - 86400000 }, // 어제
    { id: 3, name: '상대방 이름 3', lastMessage: '마지막 메시지 3', profileImg: Profile1Img, productImg: Product1Img, lastMessageDate: new Date() - 2592000000 }, // 1달 전
  ]);

  const [messages, setMessages] = useState({}); // 채팅방별 메시지를 저장하는 객체
  const chatMessagesRef = useRef(null);  // 메시지 영역에 대한 ref 생성

  const getProfileImage = (profileImg) => {
    return profileImg || defaultProfile; // 기본 프로필 이미지 사용
  };

  const loadMessagesForChatRoom = (chatId) => {
    if (!messages[chatId]) {
      setMessages(prevMessages => ({
        ...prevMessages,
        [chatId]: [
          { id: 1, text: "안녕하세요!", sender: "other", timestamp: new Date() },
          { id: 2, text: "안녕하세요, 반갑습니다!", sender: "me", timestamp: new Date() },
        ],
      }));
    }
  };

  useEffect(() => {
    loadMessagesForChatRoom(chatId); // 채팅방 ID에 맞는 메시지 로드
  }, [chatId]);

  useEffect(() => {
    socket.emit('joinRoom', chatId);

    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatId]: [...(prevMessages[chatId] || []), newMessage],
      }));
    });

    return () => {
      socket.emit('leaveRoom', chatId);
      socket.off('message');
    };
  }, [chatId]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: "me",
        timestamp: new Date(),
      };

      socket.emit('chatMessage', chatId, newMessage); // 서버로 메시지 전송

      setMessages((prevMessages) => {
        const updatedMessages = {
          ...prevMessages,
          [chatId]: [...(prevMessages[chatId] || []), newMessage],
        };

        setChatRooms(prevRooms =>
          prevRooms.map(room => {
            if (room.id === parseInt(chatId)) {
              return { ...room, lastMessage: message, lastMessageDate: new Date() };
            }
            return room;
          })
        );

        return updatedMessages;
      });

      setMessage("");
    }
  };

  useEffect(() => {
    socket.on('message', (newMessage) => {
      newMessage.timestamp = new Date(newMessage.timestamp); // 타임스탬프를 Date 객체로 변환
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatId]: [...(prevMessages[chatId] || []), newMessage],
      }));
    });
  }, [chatId, socket]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }

    const fetchRating = async () => {
      const ratingsData = {
        1: 4.8,
        2: 4.5,
        3: 4.9,
      };
      setRating(ratingsData[chatId] || "N/A"); // chatId에 해당하는 평점 설정
    };
    fetchRating();
  }, [messages, chatId]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault(); // 기본 Enter 키 동작(줄바꿈)을 막음
      handleSendMessage();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true); // 조합 시작
  };

  const handleCompositionEnd = (e) => {
    setIsComposing(false); // 조합 종료
    setMessage(e.target.value); // 조합이 끝난 최종 텍스트 업데이트
  };

  const formatTime = (timestamp) => {
    const hours = timestamp.getHours().toString().padStart(2, "0");
    const minutes = timestamp.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDate = (timestamp) => {
    const year = timestamp.getFullYear();
    const month = (timestamp.getMonth() + 1).toString().padStart(2, '0');
    const day = timestamp.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getChatDateLabel = (timestamp) => {
    const today = new Date();
    const diffTime = today - timestamp; // 밀리초 차이
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 일 단위 차이

    if (diffDays === 0) {
      return '오늘';
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays <= 7) {
      return `${diffDays}일 전`;
    } else if (diffDays <= 14) {
      return '1주 전';
    } else if (diffDays <= 21) {
      return '2주 전';
    } else if (diffDays <= 28) {
      return '3주 전';
    } else if (diffDays <= 30) {
      return '1개월 전';
    } else {
      return formatDate(timestamp); // 30일 이상이면 yyyy-mm-dd 형식
    }    
  };

  const isSameDate = (date1, date2) => {
    return formatDate(date1) === formatDate(date2);
  };

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const toggleReviewModal = () => {
    setIsReviewOpen(!isReviewOpen);  // 리뷰 작성 모달의 상태를 토글합니다.
  };

  const handleTradeComplete = () => {
    toggleReviewModal();  // 거래 완료 시 모달 열기
  };

  const handleChatRoomClick = (id) => {
    navigate(`/chat/${id}`);
    setSelectedChatId(id); // 선택된 채팅방 ID 업데이트
  };

  return (
    <div className={styles.page}>
      <SideBar /> {/* 사이드바 컴포넌트 */}

      <div className={styles.chatArea}>
        <div className={styles.chatTitle}>채팅</div>
        <div className={styles.chatList}>
          <ul>
            {chatRooms.map((chatRoom) => (
              <li key={chatRoom.id} onClick={() => handleChatRoomClick(chatRoom.id)} 
              className={selectedChatId === chatRoom.id ? styles.selectedChatRoom : ''}>
                <div className={styles.chatRoom}>
                  <img className={styles.profileImg} src={getProfileImage(chatRoom.profileImg)} alt={`Profile ${chatRoom.id}`} />
                  <div className={styles.chatRoomContents}>
                    <div className={styles.chatRoomHeader}>
                      <span className={styles.chatRoomName}>{chatRoom.name}</span>
                      <span className={styles.chatDate}>{getChatDateLabel(new Date(chatRoom.lastMessageDate))}</span>
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

      {/* 채팅방 영역 */}
      <div className={styles.chattingRoomArea}>
        <div className={styles.chattingTitle}>
          <h2>채팅방 {chatId}
          {rating && (
            <span className={styles.rating}>
              <img src={starIcon} alt='평점'/>
              {rating}
              </span>
            )}
          </h2>
          <button className={styles.tradeButton} onClick={handleTradeComplete}>
            거래완료
          </button>
        </div>

        {/* 채팅 날짜 표시 */}
        <div className={styles.chatMessages} ref={chatMessagesRef}>
          {messages[chatId]?.map((msg, index) => {
            const isDifferentDate = index === 0 || !isSameDate(messages[chatId][index - 1].timestamp, msg.timestamp);
            return (
              <div key={msg.id}>
                {isDifferentDate && (
                  <div className={styles.chatDateHeader}>
                    {formatDate(msg.timestamp)} {/* 날짜 표시 */}
                  </div>
                )}
                <div className={`${styles.message} ${msg.sender === "me" ? styles.myMessage : styles.otherMessage}`}>
                  <div className={styles.messageBubble}>
                    <div className={styles.messageText}>{msg.text}</div>
                    <div className={styles.messageTime}>{formatTime(msg.timestamp)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.chattingSend}>
          <textarea
            className={styles.chattingSendInput}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyPress}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="메시지 입력"
          />

          <button onClick={handleSendMessage}>
            <img src={sendIcon} alt="전송" />
          </button>
        </div>
        {/* 리뷰 작성 모달 */}
        {isReviewOpen && (
          <div className={styles.reviewModal}>
            <AddReview />
            <button className={styles.closeReviewModal} onClick={toggleReviewModal}>닫기</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChattingRoom;
