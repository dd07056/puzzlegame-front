import MainButton from "../common/button/MainButton";
import SettingButton from "../common/button/SettingButton";
import "./main.css"; // CSS 파일 import

export default function Main() {
  const buttonImages = [
    "/assets/image/button1.png",
    "/assets/image/button2.png",
    "/assets/image/button3.png"
  ];

  return (
    <div className="main-container">
      <div className="main-topbar">
        <div>
          <SettingButton href="/Login">게임 관리</SettingButton>
        </div>
        <div>
          <SettingButton href="/ranking">랭킹</SettingButton>
        </div>
      </div>

      <h1 className="main-title">PUZZLE GAME</h1>

      <div className="main-button-group">
        {[1, 2, 3].map((num, index) => (
          <MainButton
            key={index}
            href={`/puzzle${num}`}
            imageUrl={buttonImages[index]}
          />
        ))}
      </div>
    </div>
  );
}
