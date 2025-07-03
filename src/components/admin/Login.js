"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./login.css";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/common/login",
        { username, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("로그인 성공!");
        router.push("/admin");
      }
    } catch (error) {
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 홈으로 가기 함수
  const goHome = () => {
    router.push("/");
  };

  return (
    <div className="container">
      <h1>관리자 로그인</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">아이디</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <button className="login-home-button" onClick={goHome}>
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default Login;
