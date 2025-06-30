"use client";

import { useState, useEffect } from "react";
import { words } from "@/data/words";
import PopUp from "../popup/PopUp";
import Hangul from "hangul-js";
import Link from "next/link";
import "./puzzle2.css";

const MAX_TRIES = 6;

function getLetterStatus(answer, guess) {
  const answerUnits = Hangul.disassemble(answer);
  const guessUnits = Hangul.disassemble(guess);

  const answerUnitsCopy = [...answerUnits];

  const result = guessUnits.map((unit, i) => {
    if (unit === answerUnits[i]) {
      answerUnitsCopy[i] = null;
      return "correct";
    }
    return null;
  });

  return result.map((status, i) => {
    if (status) return status;

    const unit = guessUnits[i];
    const indexInCopy = answerUnitsCopy.indexOf(unit);
    if (indexInCopy !== -1) {
      answerUnitsCopy[indexInCopy] = null;
      return "present";
    }
    return "absent";
  });
}

export default function Puzzle2() {
  const [answer, setAnswer] = useState("");
  const [input, setInput] = useState("");
  const [tries, setTries] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const [username, setUsername] = useState(""); // 이름 입력용

  useEffect(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setAnswer(randomWord);
  }, []);

  const handleSubmit = () => {
    if (gameOver || input.length !== answer.length) return;

    const status = getLetterStatus(answer, input);
    const updatedTries = [...tries, input];
    const updatedStatuses = [...statuses, status];

    setTries(updatedTries);
    setStatuses(updatedStatuses);
    setInput("");

    if (input === answer) {
      setGameOver(true);
      setWin(true);
      setScore(updatedTries.length);
    } else if (updatedTries.length >= MAX_TRIES) {
      setGameOver(true);
      setScore(7); // 틀렸을 때 7점으로 고정
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const renderRow = (rowIdx) => {
    let units = [];
    let status = [];

    if (rowIdx < tries.length) {
      units = Hangul.disassemble(tries[rowIdx]);
      status = statuses[rowIdx];
    } else if (rowIdx === tries.length && !gameOver) {
      units = Hangul.disassemble(input);
    }

    const boxCount = answer.length * 3;

    return (
      <div key={rowIdx} className="puzzle2-row">
        {Array.from({ length: boxCount }).map((_, i) => {
          const boxStatus = rowIdx < tries.length ? status[i] : "default";
          const shadowClass = rowIdx < tries.length ? "shadow" : "";
          return (
            <div key={i} className={`puzzle2-box ${boxStatus} ${shadowClass}`}>
              {units[i] || ""}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="puzzle2-container">
      <h1 className="puzzle2-title">한글 단어 맞추기</h1>

      {isPopupOpen && (
        <PopUp
          message="25개의 단어 중 한가지가 선택됩니다,  
        초록색은 맞은 자음 또는 모음,  
        주황색은 위치가 맞지 않지만 존재하는 자음 또는 모음,  
        빨간색은 틀린 자음 또는 모음입니다."
          onClose={closePopup}
        />
      )}

      <div style={{ marginBottom: 24 }}>
        {Array.from({ length: MAX_TRIES }).map((_, rowIdx) =>
          renderRow(rowIdx)
        )}
      </div>

      <div className="puzzle2-info-bar">
        <div>
          횟수: {tries.length} / {MAX_TRIES}
        </div>
        <Link href="/" passHref>
          <button className="puzzle2-home-button">홈으로</button>
        </Link>
      </div>

      {!gameOver && (
        <div className="puzzle2-input-container">
          <input
            className="puzzle2-input"
            value={input}
            onChange={(e) => {
              const noSpace = e.target.value.replace(/\s/g, "");
              setInput(noSpace);
            }}
            maxLength={answer.length}
          />
          <button className="puzzle2-submit-button" onClick={handleSubmit}>
            제출
          </button>
        </div>
      )}

      {gameOver && (
        <div className={`puzzle2-result-message ${win ? "win" : "lose"}`}>
          {win
            ? `🎉 정답입니다! 시도 횟수: ${score}`
            : `❌ 정답은 "${answer}" 였습니다.`}
        </div>
      )}

      {/* 정답 여부와 관계없이 랭킹 등록 가능 */}
      {gameOver && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-md flex items-center space-x-2">
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={() => {
              if (username.trim() === "") {
                alert("이름을 입력해주세요!");
                return;
              }
              const finalScore = score ?? 7; // score 없으면 7점
              window.location.href = `/ranking?game=puzzle2&username=${encodeURIComponent(
                username
              )}&score=${finalScore}`;
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            랭킹 보기
          </button>
        </div>
      )}
    </div>
  );
}
