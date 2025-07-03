"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./admincontent.css";

const gameList = [
  { id: 1, title: "puzzle1" },
  { id: 2, title: "puzzle2" },
  { id: 3, title: "puzzle3" },
];

const gameNameMap = {
  puzzle1: "소코반 퍼즐",
  puzzle2: "한글 단어 퍼즐",
  puzzle3: "숫자 맞추기 퍼즐",
};

export default function AdminContents() {
  const [allRankings, setAllRankings] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/common/ranking");
      setAllRankings(res.data);
    } catch (error) {
      console.error("랭킹 데이터를 불러오는 중 오류 발생:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8081/api/admin/logout",
        {},
        { withCredentials: true }
      );
      alert("로그아웃 되었습니다.");
      window.location.href = "/login";
    } catch (error) {
      alert("로그아웃 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleNameChange = (gameTitle, idx, newName) => {
    setAllRankings((prev) =>
      prev.map((game) => {
        if (game.puzzlegameId === getGameId(gameTitle)) {
          const newForms = [...game.forms];
          newForms[idx] = { ...newForms[idx], name: newName };
          return { ...game, forms: newForms };
        }
        return game;
      })
    );
  };

  const handleScoreChange = (gameTitle, idx, newScore) => {
    setAllRankings((prev) =>
      prev.map((game) => {
        if (game.puzzlegameId === getGameId(gameTitle)) {
          const newForms = [...game.forms];
          newForms[idx] = { ...newForms[idx], score: Number(newScore) };
          return { ...game, forms: newForms };
        }
        return game;
      })
    );
  };

  const handleDeleteEntry = async (gameTitle, idx) => {
    if (
      window.confirm(
        `${gameNameMap[gameTitle]} 랭킹에서 이 항목을 삭제하시겠습니까?`
      )
    ) {
      try {
        const game = allRankings.find(
          (g) => g.puzzlegameId === getGameId(gameTitle)
        );
        if (!game) return;

        const idToDelete = game.forms[idx].id;
        await axios.delete(
          `http://localhost:8081/api/admin/ranking/delete/data/${idToDelete}`
        );
        fetchData();
      } catch (error) {
        alert("삭제 중 오류가 발생했습니다.");
        console.error(error);
      }
    }
  };

  // ✅ 수정된 부분: 특정 항목만 저장
  const saveSingleRanking = async (gameTitle, item) => {
    try {
      await axios.patch(
        "http://localhost:8081/api/admin/ranking/patch",
        {
          id: item.id,
          name: item.name,
          score: item.score,
        },
        { withCredentials: true }
      );
      alert(`${gameNameMap[gameTitle]} 랭킹 저장 완료`);
      fetchData();
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleResetGame = async (gameTitle) => {
    if (
      window.confirm(
        `${gameNameMap[gameTitle]} 랭킹을 정말 초기화하시겠습니까? 모든 기록이 삭제됩니다.`
      )
    ) {
      try {
        const gameId = getGameId(gameTitle);
        await axios.delete(
          `http://localhost:8081/api/admin/ranking/delete/${gameId}`
        );
        alert(`${gameNameMap[gameTitle]} 랭킹이 초기화되었습니다.`);
        fetchData();
      } catch (error) {
        alert("초기화 중 오류가 발생했습니다.");
        console.error(error);
      }
    }
  };

  const handleResetAll = async () => {
    if (
      window.confirm(
        "모든 게임의 랭킹을 초기화하시겠습니까? 복구할 수 없습니다."
      )
    ) {
      try {
        await axios.delete("http://localhost:8081/api/admin/ranking/delete");
        alert("전체 게임 랭킹이 초기화되었습니다.");
        fetchData();
      } catch (error) {
        alert("초기화 중 오류가 발생했습니다.");
        console.error(error);
      }
    }
  };

  const getGameId = (gameTitle) => {
    const game = gameList.find((g) => g.title === gameTitle);
    return game ? game.id : null;
  };

  return (
    <div className="admin-container">
      <button className="logout-btn" onClick={handleLogout}>
        로그아웃
      </button>

      {gameList.map(({ title: gameTitle }) => (
        <section key={gameTitle} className="admin-section">
          <h2>{gameNameMap[gameTitle]} 랭킹</h2>

          {allRankings.find((g) => g.puzzlegameId === getGameId(gameTitle))
            ?.forms.length ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>점수</th>
                  <th>저장</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {allRankings
                  .find((g) => g.puzzlegameId === getGameId(gameTitle))
                  ?.forms.sort((a, b) => a.score - b.score)
                  .map(({ id, name, score }, idx) => (
                    <tr key={id}>
                      <td>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) =>
                            handleNameChange(gameTitle, idx, e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={score}
                          onChange={(e) =>
                            handleScoreChange(gameTitle, idx, e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="save-btn"
                          onClick={() =>
                            saveSingleRanking(gameTitle, { id, name, score })
                          }
                        >
                          저장
                        </button>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteEntry(gameTitle, idx)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>랭킹 데이터가 없습니다.</p>
          )}

          <button
            className="reset-game-btn"
            onClick={() => handleResetGame(gameTitle)}
          >
            {gameNameMap[gameTitle]} 랭킹 초기화
          </button>
        </section>
      ))}

      <button className="reset-all-btn" onClick={handleResetAll}>
        전체 게임 랭킹 초기화
      </button>
    </div>
  );
}
