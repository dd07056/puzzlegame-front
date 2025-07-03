"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./ranking.css";
import axios from "axios";

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

const Ranking = () => {
  const router = useRouter();
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/common/ranking");
      setData(res.data);
    } catch (error) {
      console.error("랭킹 데이터를 불러오는 중 오류 발생:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container">
      <h1 className="title">전체 게임 랭킹</h1>

      <div className="rankingContainer">
        {gameList.map(({ id, title }) => (
          <div key={id} className="gameSection">
            <h2 className="gametitle">{gameNameMap[title]} 랭킹</h2>
            {data &&
            data.find((game) => game.puzzlegameId === id)?.forms.length ? (
              <ol>
                {data
                  .find((game) => game.puzzlegameId === id)
                  .forms.sort((a, b) => a.score - b.score)
                  .map(({ id, name, score }) => (
                    <li key={id}>
                      {name} : {score}점
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
