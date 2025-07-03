"use client";

import SettingButton from "@/components/common/button/SettingButton";
import { useState, useEffect } from "react";
import PopUp from "../popup/PopUp";
import { useRouter } from "next/navigation";
import axios from "axios";

const playerImgUrl = "/assets/image/player.png";
const boxImgUrl = "/assets/image/box.png";
const goalImgUrl = "/assets/image/goal.png";

const initialMap = [
  [
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
  ],
  [
    "#",
    "#",
    "#",
    "#",
    " ",
    " ",
    "#",
    "#",
    " ",
    " ",
    " ",
    "#",
    "#",
    "#",
    "#",
    "#",
  ],
  [
    "#",
    "#",
    "#",
    "#",
    " ",
    " ",
    " ",
    "$",
    " ",
    " ",
    " ",
    "#",
    "#",
    "#",
    "#",
    "#",
  ],
  [
    "#",
    "#",
    "#",
    "#",
    "$",
    " ",
    "#",
    "#",
    "#",
    " ",
    "$",
    "#",
    "#",
    "#",
    "#",
    "#",
  ],
  [
    "#",
    "#",
    "#",
    "#",
    " ",
    "#",
    "O",
    "O",
    "O",
    "#",
    " ",
    "#",
    "#",
    "#",
    "#",
    "#",
  ],
  [
    "#",
    "#",
    "#",
    "#",
    " ",
    "#",
    "O",
    "O",
    "O",
    "#",
    " ",
    "#",
    "#",
    "#",
    "#",
    "#",
  ],
  [
    "#",
    "#",
    "#",
    " ",
    "$",
    " ",
    " ",
    "$",
    " ",
    " ",
    "$",
    " ",
    "#",
    "#",
    "#",
    "#",
  ],
  [
    "#",
    "#",
    "#",
    " ",
    " ",
    " ",
    " ",
    " ",
    "#",
    " ",
    "@",
    " ",
    "#",
    "#",
    "#",
    "#",
  ],
  [
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
  ],
];

const findPlayerPosition = (map) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "@") {
        return { x, y };
      }
    }
  }
  return null;
};

const findGoalPositions = (map) => {
  const positions = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "O") {
        positions.push({ x, y });
      }
    }
  }
  return positions;
};

const Sokoban = () => {
  const router = useRouter();
  const goalPositions = findGoalPositions(initialMap);

  const [map, setMap] = useState(() =>
    initialMap.map((row) => row.map((cell) => (cell === "O" ? " " : cell)))
  );
  const [player, setPlayer] = useState(
    () => findPlayerPosition(initialMap) || { x: 0, y: 0 }
  );
  const [isCleared, setIsCleared] = useState(false);
  const [keyCount, setKeyCount] = useState(0);
  const [showPopup, setShowPopup] = useState(true);

  const [history, setHistory] = useState([]);

  // 이름 입력 상태 추가
  const [username, setUsername] = useState("");
  const [showRankingButton, setShowRankingButton] = useState(false);

  const popupMessage =
    " - 방향키로 플레이어를 움직이세요.\n " +
    " - backspace버튼을 누르면 전으로 되돌아갑니다\n  " +
    "- 상자를 목표 지점 까지 밀면 클리어!\n";

  const move = (dx, dy) => {
    if (isCleared || showPopup) return false;

    const { x, y } = player;
    const newX = x + dx;
    const newY = y + dy;

    if (newY < 0 || newY >= map.length || newX < 0 || newX >= map[0].length) {
      return false;
    }

    const nextCell = map[newY][newX];

    if (nextCell === "$") {
      const boxNewX = newX + dx;
      const boxNewY = newY + dy;

      if (
        boxNewY < 0 ||
        boxNewY >= map.length ||
        boxNewX < 0 ||
        boxNewX >= map[0].length
      ) {
        return false;
      }

      const boxNextCell = map[boxNewY][boxNewX];

      if (boxNextCell === " ") {
        setHistory((prev) => [
          ...prev,
          {
            map: map.map((row) => [...row]),
            player: { x, y },
            keyCount,
          },
        ]);

        const newMap = map.map((row) => [...row]);
        newMap[boxNewY][boxNewX] = "$";
        newMap[newY][newX] = "@";
        newMap[y][x] = " ";
        setMap(newMap);
        setPlayer({ x: newX, y: newY });
        setKeyCount((prev) => prev + 1);
        return true;
      }
    } else if (nextCell === " ") {
      setHistory((prev) => [
        ...prev,
        {
          map: map.map((row) => [...row]),
          player: { x, y },
          keyCount,
        },
      ]);

      const newMap = map.map((row) => [...row]);
      newMap[newY][newX] = "@";
      newMap[y][x] = " ";
      setMap(newMap);
      setPlayer({ x: newX, y: newY });
      setKeyCount((prev) => prev + 1);
      return true;
    }

    return false;
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const lastState = history[history.length - 1];
    setMap(lastState.map);
    setPlayer(lastState.player);
    setKeyCount(lastState.keyCount);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setIsCleared(false);
  };

  useEffect(() => {
    if (showPopup) return;

    const handleKeyDown = (e) => {
      if (showPopup || isCleared) return;

      let moved = false;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          moved = move(0, -1);
          break;
        case "ArrowDown":
          e.preventDefault();
          moved = move(0, 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          moved = move(-1, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          moved = move(1, 0);
          break;
        case "Backspace":
          e.preventDefault(); // 페이지 뒤로가기 방지
          handleUndo();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player, isCleared, showPopup]);

  useEffect(() => {
    const cleared = goalPositions.every(({ x, y }) => map[y][x] === "$");
    if (cleared && !isCleared) {
      alert("🎉 축하합니다! 게임을 클리어했습니다! 🎉");
      setShowRankingButton(true);
    }
    setIsCleared(cleared);
  }, [map, goalPositions, isCleared]);

  const rows = initialMap.length;
  const cols = initialMap[0].length;

  const renderCell = (x, y) => {
    const baseStyle = "flex items-center justify-center select-none";

    const cellSizeStyle = {
      width: `${100 / cols}vw`,
      height: `${100 / rows}vh`,
      minWidth: "40px",
      minHeight: "40px",
    };

    if (player.x === x && player.y === y) {
      return (
        <div key={`${x}-${y}`} className={baseStyle} style={cellSizeStyle}>
          <img
            src={playerImgUrl}
            alt="플레이어"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              backgroundColor: "#e5e7eb",
            }}
            draggable={false}
          />
        </div>
      );
    }

    const cell = map[y][x];

    if (cell === "$") {
      return (
        <div key={`${x}-${y}`} className={baseStyle} style={cellSizeStyle}>
          <img
            src={boxImgUrl}
            alt="상자"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              backgroundColor: "#e5e7eb",
            }}
            draggable={false}
          />
        </div>
      );
    }

    if (cell === "#") {
      return (
        <div
          key={`${x}-${y}`}
          className={baseStyle}
          style={{
            ...cellSizeStyle,
            backgroundColor: "#222",
            border: "1px solid #555",
            color: "#555",
          }}
        ></div>
      );
    }

    if (cell === " ") {
      if (goalPositions.some((pos) => pos.x === x && pos.y === y)) {
        return (
          <div key={`${x}-${y}`} className={baseStyle} style={cellSizeStyle}>
            <img
              src={goalImgUrl}
              alt="목표 지점"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                backgroundColor: "#e5e7eb",
              }}
              draggable={false}
            />
          </div>
        );
      }
      return (
        <div
          key={`${x}-${y}`}
          className={baseStyle + " bg-gray-200"}
          style={cellSizeStyle}
        ></div>
      );
    }

    return (
      <div key={`${x}-${y}`} className={baseStyle} style={cellSizeStyle}></div>
    );
  };

  const handleSubmit = async () => {
    if (username.trim() === "") {
      alert("이름을 입력해주세요!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/api/common/ranking",
        {
          puzzlegameId: 1,
          name: username,
          score: keyCount,
        }
      );

      if (response.status === 200) {
        router.push("/ranking");
      }
    } catch (error) {
      alert("랭킹 등록 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center relative">
      {showPopup && (
        <PopUp message={popupMessage} onClose={() => setShowPopup(false)} />
      )}

      <div className="absolute top-4 left-4 flex items-center space-x-2 text-sm  text-gray-700 bg-white pl-1.5 rounded shadow">
        <div>횟수: {keyCount}</div>
        <button
          className="bg-blue-500 text-white py-1 px-3 rounded shadow hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
          disabled={history.length === 0}
          onClick={handleUndo}
          type="button"
        >
          되돌리기
        </button>
        <SettingButton href="/">홈으로</SettingButton>
      </div>

      <div
        className="grid border-4 border-gray-700"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          maxWidth: "100vw",
          maxHeight: "100vh",
          width: "100vw",
          height: "100vh",
        }}
      >
        {map.map((row, y) => row.map((_, x) => renderCell(x, y)))}
      </div>

      {/* 클리어 후 이름 입력 및 랭킹 이동 버튼 */}
      {isCleared && showRankingButton && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-md flex items-center space-x-2">
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            랭킹 보기
          </button>
        </div>
      )}
    </div>
  );
};

export default Sokoban;
