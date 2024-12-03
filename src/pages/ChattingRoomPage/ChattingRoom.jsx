import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SideBar from '../SideBar';
import defaultProfile from '../../assets/image/DefaultProfile.png';
import sendIcon from '../../assets/image/Send.png';
import starIcon from '../../assets/image/Star.png';
import AddReview from '../AddReviewPage/AddReview';
import styles from './ChattingRoom.module.css';
import io from 'socket.io-client';

const ChattingRoom = () => {
  const { roomId } = useParams(); // 채팅방 ID 가져오기
  const socket = io('http://localhost:4000'); // 서버 URL
  const [messages, setMessages] = useState([]); // 메시지 리스트
  const [message, setMessage] = useState(""); // 입력된 메시지
  const [isComposing, setIsComposing] = useState(false); // 한글 입력 조합 상태
  const [rating, setRating] = useState(null); // 상대방 평점
  const chatMessagesRef = useRef(null); // 메시지 영역에 대한 ref

  useEffect(() => {
    // Socket.IO로 서버에 joinRoom 요청
    const buyerId = localStorage.getItem('student_id'); // 현재 사용자 ID
    socket.emit('joinRoom', { roomId, participants: roomId.split('_') }); // roomId와 참여자 정보 전달
  
    // 서버에서 메시지 로드
    socket.on('loadMessages', (loadedMessages) => {
      setMessages(loadedMessages); // 기존 메시지 로드
    });
  
    // 서버에서 새로운 메시지 수신
    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  
    return () => {
      socket.emit('leaveRoom', roomId); // 채팅방 나가기
      socket.off('message'); // 이벤트 제거
    };
  }, [roomId]);
  

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
  if (message.trim() !== '') {
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'me',
      timestamp: new Date(),
    };

    // 서버에 메시지 전송
    socket.emit('chatMessage', roomId, newMessage);

    // LocalStorage 업데이트
    const existingRooms = JSON.parse(localStorage.getItem('chatRooms')) || [];
    const updatedRooms = existingRooms.map((room) => {
      if (room.roomId === roomId) {
        return {
          ...room,
          lastMessage: newMessage.text,
          lastMessageTime: new Date(),
        };
      }
      return room;
    });
    localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));

    setMessages((prevMessages) => [...prevMessages, newMessage]); // 메시지 추가
    setMessage(""); // 입력 필드 초기화
  }
};


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault(); // Enter 키 기본 동작 막기
      handleSendMessage();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true); // 한글 입력 조합 시작
  };

  const handleCompositionEnd = (e) => {
    setIsComposing(false); // 한글 입력 조합 종료
    setMessage(e.target.value); // 최종 텍스트 업데이트
  };

  useEffect(() => {
    // 스크롤 자동 이동
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (timestamp) => {
    const hours = timestamp.getHours().toString().padStart(2, "0");
    const minutes = timestamp.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDate = (timestamp) => {
    const year = timestamp.getFullYear();
    const month = (timestamp.getMonth() + 1).toString().padStart(2, "0");
    const day = timestamp.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const toggleReviewModal = () => {
    setIsReviewOpen(!isReviewOpen); // 리뷰 작성 모달 열기/닫기
  };

  const handleTradeComplete = () => {
    toggleReviewModal(); // 거래 완료 시 모달 열기
  };

  return (
    <div className={styles.page}>
      <SideBar />
      <div className={styles.chattingRoomArea}>
        <div className={styles.chattingTitle}>
          <h2>채팅방 {roomId}</h2>
          {rating && (
            <span className={styles.rating}>
              <img src={starIcon} alt="평점" />
              {rating}
            </span>
          )}
          <button className={styles.tradeButton} onClick={handleTradeComplete}>
            거래완료
          </button>
        </div>

        {/* 채팅 메시지 영역 */}
        <div className={styles.chatMessages} ref={chatMessagesRef}>
          {messages.map((msg, index) => {
            const isDifferentDate =
              index === 0 ||
              formatDate(new Date(messages[index - 1]?.timestamp)) !==
                formatDate(new Date(msg.timestamp));
            return (
              <div key={msg.id}>
                {isDifferentDate && (
                  <div className={styles.chatDateHeader}>
                    {formatDate(new Date(msg.timestamp))}
                  </div>
                )}
                <div
                  className={`${styles.message} ${
                    msg.sender === "me" ? styles.myMessage : styles.otherMessage
                  }`}
                >
                  <div className={styles.messageBubble}>
                    <div className={styles.messageText}>{msg.text}</div>
                    <div className={styles.messageTime}>
                      {formatTime(new Date(msg.timestamp))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 메시지 입력 영역 */}
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
            <AddReview closeModal={toggleReviewModal} recipientUserId={"0000000"} />
            <button className={styles.closeReviewModal} onClick={toggleReviewModal}>
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChattingRoom;
