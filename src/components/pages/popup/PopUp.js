"use client";
import React from "react";
import "./PopUp.css"; 

const PopUp = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2 className="popup-title">🎮 게임 설명 🎮</h2>
        <p className="popup-message">{message}</p>
        <button className="popup-button" onClick={onClose}>
          시작하기
        </button>
      </div>
    </div>
  );
};

export default PopUp;
