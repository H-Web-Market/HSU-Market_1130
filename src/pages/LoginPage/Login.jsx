import React, { useState } from 'react';
import styles from './Login.module.css';
import InputField from './InputField';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/SignUpForm'); // "/SignUpForm"으로 이동
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // 이전 오류 메시지 초기화
  
    try {
      const response = await fetch('https://borhg6i9sk.execute-api.ap-northeast-2.amazonaws.com/web_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          password: password,
        }),
      });
  
      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
  
      const data = await response.json();
      if (data.success) {
        console.log('로그인 성공:', data);
        navigate('/home'); // 로그인 성공 시 홈 화면으로 이동
      } else {
        setErrorMessage(data.message || '로그인에 실패했습니다. 학번, 비밀번호를 다시 확인해주세요.');
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      setErrorMessage('로그인 요청 실패. 네트워크를 확인해 주세요.');
    }
  };
  
  return (
    <main className={styles.loginContainer}>
      <header className={styles.logoContainer}>
        <h1 className={styles.title}>HSU Market</h1>
      </header>
      <form onSubmit={handleLogin} className={styles.formContainer}>
        <InputField
          iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/a80411b4e7d3a6119bfdef2b981dda8b5b27d1fbd656a086d3834a3f3bb695fb"
          label="학번"
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <InputField
          iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/a420df9ef944595ff289101beb72537cfc3de75c98b940df4fca1e9cc6ec089b"
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.loginButton}>Login</button>
          <button
            className={styles.signUpButton}
            aria-label="Sign Up"
            onClick={handleSignUpClick} // 회원가입 버튼에 클릭 이벤트 추가
          >
            Sign Up
          </button>
        </div>
      </form>
    </main>
  );
};

export default LoginPage;