"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PopUp from "../popup/PopUp";
import { useRouter } from "next/navigation";
import "./puzzle3.css";

const SIZE = 4;
const MAX_TRIES = 1000;
const EMPTY_TILE = 16;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function checkIfCleared(tiles) {
  const correct = Array.from({ length: SIZE * SIZE }, (_, i) => i + 1);
  return tiles.every((val, idx) => val === correct[idx]);
}

export default function Puzzle3() {
  const router = useRouter();

  const [tiles, setTiles] = useState([]);
  const [tries, setTries] = useState([]);
  const [isCleared, setIsCleared] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  const [username, setUsername] = useState("");
  const [showRankingButton, setShowRankingButton] = useState(false);

  useEffect(() => {
    const nums = Array.from({ length: SIZE * SIZE }, (_, i) => i + 1);
    const shuffled = shuffleArray(nums);
    setTiles(shuffled);
    setTries([]);
    setIsCleared(false);
    setShowRankingButton(false);
    setUsername("");
  }, []);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const canMove = (index) => {
    const emptyIndex = tiles.indexOf(EMPTY_TILE);
    const row1 = Math.floor(index / SIZE);
    const col1 = index % SIZE;
    const row2 = Math.floor(emptyIndex / SIZE);
    const col2 = emptyIndex % SIZE;

    return (
      (row1 === row2 && Math.abs(col1 - col2) === 1) ||
      (col1 === col2 && Math.abs(row1 - row2) === 1)
    );
  };

  const moveTile = (index) => {
    if (isCleared || !canMove(index)) return;

    const emptyIndex = tiles.indexOf(EMPTY_TILE);
    const newTiles = [...tiles];
    [newTiles[index], newTiles[emptyIndex]] = [
      newTiles[emptyIndex],
      newTiles[index],
    ];
    setTiles(newTiles);
    setTries((prev) => [...prev, index]);

    if (checkIfCleared(newTiles)) {
      setIsCleared(true);
      setShowRankingButton(true);
      setTimeout(() => alert("🎉 클리어! 🎉"), 100);
    }
  };

  return (
    <>
      {isPopupOpen && (
        <PopUp
          message={
            "4x4 숫자 퍼즐을 완성해 보세요!\n\n" +
            "숫자를 클릭하면 빈 칸과 맞닿은 숫자만 이동할 수 있습니다.\n" +
            "숫자 순서대로 1부터 15까지 모두 맞추면 클리어!\n" +
            "클릭할 때마다 시도 횟수가 기록됩니다.\n"
          }
          onClose={closePopup}
        />
      )}
      <h1 className="puzzle3-title">4x4 숫자 퍼즐</h1>
      <div className="topbar">
        <div className="tries-count">
          횟수: {tries.length} / {MAX_TRIES}
        </div>
        <Link href="/" passHref>
          <button className="home-button">홈으로</button>
        </Link>
      </div>

      <div className="grid">
        {tiles.map((num, idx) => (
          <div
            key={idx}
            className={`tile ${num === EMPTY_TILE ? "empty" : ""}`}
            onClick={() => moveTile(idx)}
          >
            {num !== EMPTY_TILE ? num : ""}
          </div>
        ))}
      </div>

      {/* 클리어 후 이름 입력 및 랭킹 버튼 */}
      {isCleared && showRankingButton && (
        <div
          className="ranking-input-container"
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            zIndex: 1000,
          }}
        >
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "0.5rem",
              fontSize: "1rem",
              width: "200px",
            }}
          />
          <button
            onClick={() => {
              if (username.trim() === "") {
                alert("이름을 입력해주세요!");
                return;
              }
              router.push(
                `/ranking?game=puzzle3&username=${encodeURIComponent(
                  username
                )}&score=${tries.length}`
              );
            }}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "4px",
              padding: "0.5rem 1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            랭킹 보기
          </button>
        </div>
      )}
    </>
  );
}
