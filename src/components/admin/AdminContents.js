"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // next/navigation에서 useRouter 가져오기 (Next.js 13+)
import "./admincontent.css";

const gameList = ["puzzle1", "puzzle2", "puzzle3"];

const gameNameMap = {
  puzzle1: "소코반 퍼즐",
  puzzle2: "한글 단어 퍼즐",
  puzzle3: "숫자 맞추기 퍼즐",
};

export default function AdminContents() {
  const router = useRouter();
  const [allRankings, setAllRankings] = useState({});

  // 로그인 체크
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      alert("로그인 해주세요.");
      router.replace("/main"); // 홈으로 강제 이동
      return;
    }

    // 로컬스토리지에서 모든 게임 랭킹 불러오기
    const allData = {};
    gameList.forEach((gameName) => {
      try {
        const data = JSON.parse(
          localStorage.getItem(`ranking_${gameName}`) || "[]"
        );
        allData[gameName] = data;
      } catch {
        allData[gameName] = [];
      }
    });
    setAllRankings(allData);
  }, [router]);

  // 저장: 로컬스토리지 + 상태 동기화
  const saveRanking = (gameName, newRanking) => {
    localStorage.setItem(`ranking_${gameName}`, JSON.stringify(newRanking));
    setAllRankings((prev) => ({ ...prev, [gameName]: newRanking }));
  };

  // 개별 항목 이름 변경
  const handleNameChange = (gameName, index, newName) => {
    const ranking = [...(allRankings[gameName] || [])];
    ranking[index].username = newName;
    saveRanking(gameName, ranking);
  };

  // 개별 항목 점수 변경
  const handleScoreChange = (gameName, index, newScore) => {
    const ranking = [...(allRankings[gameName] || [])];
    const parsedScore = parseInt(newScore);
    if (!isNaN(parsedScore)) {
      ranking[index].score = parsedScore;
      // 점수 기준으로 정렬 다시 해주기
      ranking.sort((a, b) => a.score - b.score);
      saveRanking(gameName, ranking);
    }
  };

  // 개별 항목 삭제
  const handleDeleteEntry = (gameName, index) => {
    if (
      window.confirm(
        `${gameNameMap[gameName]} 랭킹에서 이 항목을 삭제하시겠습니까?`
      )
    ) {
      const ranking = [...(allRankings[gameName] || [])];
      ranking.splice(index, 1);
      saveRanking(gameName, ranking);
    }
  };

  // 개별 게임 랭킹 초기화
  const handleResetGame = (gameName) => {
    if (
      window.confirm(
        `${gameNameMap[gameName]} 랭킹을 정말 초기화하시겠습니까? 모든 기록이 삭제됩니다.`
      )
    ) {
      localStorage.removeItem(`ranking_${gameName}`);
      setAllRankings((prev) => ({ ...prev, [gameName]: [] }));
    }
  };

  // 전체 랭킹 초기화
  const handleResetAll = () => {
    if (
      window.confirm(
        "모든 게임의 랭킹을 초기화하시겠습니까? 복구할 수 없습니다."
      )
    ) {
      gameList.forEach((gameName) => {
        localStorage.removeItem(`ranking_${gameName}`);
      });
      setAllRankings({});
    }
  };

  return (
    <div className="admin-container">
      <div className="fixed-home-button">
        <Link href="/main" passHref>
          <button className="home-button">홈으로</button>
        </Link>
      </div>
      <h1>관리자 페이지 - 게임 랭킹 관리</h1>

      {gameList.map((gameName) => (
        <section key={gameName} className="admin-section">
          <h2>{gameNameMap[gameName]} 랭킹</h2>

          {allRankings[gameName] && allRankings[gameName].length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="name-col">이름</th>
                  <th className="score-col">점수</th>
                  <th className="delete-col">삭제</th>
                </tr>
              </thead>
              <tbody>
                {allRankings[gameName].map(({ username, score }, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                          handleNameChange(gameName, idx, e.target.value)
                        }
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="number"
                        min="0"
                        value={score}
                        onChange={(e) =>
                          handleScoreChange(gameName, idx, e.target.value)
                        }
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteEntry(gameName, idx)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-ranking">랭킹 데이터가 없습니다.</p>
          )}

          <button
            className="reset-game-btn"
            onClick={() => handleResetGame(gameName)}
          >
            {gameNameMap[gameName]} 랭킹 초기화
          </button>
        </section>
      ))}

      <button className="reset-all-btn" onClick={handleResetAll}>
        전체 게임 랭킹 초기화
      </button>
    </div>
  );
}
