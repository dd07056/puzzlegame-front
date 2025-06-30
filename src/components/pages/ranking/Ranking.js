"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "./ranking.css";

const gameList = ["puzzle1", "puzzle2", "puzzle3"];

const Ranking = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const game = searchParams.get("game")?.toLowerCase();
  const username = searchParams.get("username");
  const score = Number(searchParams.get("score"));

  const [allRankings, setAllRankings] = useState({});

  useEffect(() => {
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

    if (
      game &&
      username &&
      username.trim() !== "" &&
      !isNaN(score) &&
      score > 0 &&
      gameList.includes(game)
    ) {
      const existing = allData[game]?.some(
        (entry) => entry.username === username && entry.score === score
      );

      if (!existing) {
        const updatedRanking = [...(allData[game] || [])];
        updatedRanking.push({ username, score });
        updatedRanking.sort((a, b) => a.score - b.score);
        allData[game] = updatedRanking.slice(0, 10);
        localStorage.setItem(`ranking_${game}`, JSON.stringify(allData[game]));

        router.replace("/ranking", { scroll: false });
      }
    }

    setAllRankings(allData);
  }, [game, username, score, router]);

  const handleReset = () => {
    const confirmReset = window.confirm("전체 게임 랭킹을 초기화하시겠습니까?");
    if (confirmReset) {
      gameList.forEach((gameName) => {
        localStorage.removeItem(`ranking_${gameName}`);
      });
      setAllRankings({});
    }
  };

  return (
    <div className="container">
      <h1 className="title">전체 게임 랭킹</h1>

      <div className="rankingContainer">
        {gameList.map((gameName) => (
          <div key={gameName} className="gameSection">
            <h2 className="gameTitle">{gameName.toUpperCase()} 랭킹</h2>
            {allRankings[gameName] && allRankings[gameName].length > 0 ? (
              <ol className="rankingList">
                {allRankings[gameName].map(({ username, score }, idx) => (
                  <li key={idx}>
                    {idx + 1}위 - {username} : {score}점
                  </li>
                ))}
              </ol>
            ) : (
              <p className="noRanking">랭킹이 없습니다.</p>
            )}
          </div>
        ))}
      </div>

      <div className="buttonGroup">
        <button
          className="homeButton"
          onClick={() => router.push("/")}
          type="button"
        >
          홈으로
        </button>
      </div>
    </div>
  );
};

export default Ranking;
