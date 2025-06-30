"use client";

import React, { useState, useEffect } from "react";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const hardcodedUsername = "admin";
  const hardcodedPassword = "465466544";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === hardcodedUsername && password === hardcodedPassword) {
      setIsLoggedIn(true);
    } else {
      alert("잘못된 아이디 또는 비밀번호입니다.");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      window.location.href = "/admin";
    }
  }, [isLoggedIn]);

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="container">
      <h1>관리자 페이지</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
      <button className="home-button" onClick={goHome}>
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default Login;
