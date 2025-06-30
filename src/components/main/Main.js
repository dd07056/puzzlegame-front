import MainButton from "../common/button/MainButton";
import SettingButton from "../common/button/SettingButton";

export default function Main() {
  const buttonImages = [
    "/assets/image/button1.png",
    "/assets/image/button2.png",
    "/assets/image/button3.png",
    "/assets/image/button4.png",
    "/assets/image/button5.png",
  ];

  return (
    <div className="min-h-screen bg-cover bg-[url('/assets/image/bg1.png')] flex flex-col items-center text-black p-10">
      <div className="w-full flex justify-between items-center px-6">
        <div>
          <SettingButton href="/Login">게임 관리</SettingButton>
        </div>
        <div>
          <SettingButton href="/ranking">랭킹</SettingButton>
        </div>
      </div>

      <h1 className="text-[6rem] my-5 mt-30">PUZZLE GAME</h1>

      <div className="flex flex-wrap justify-center gap-28 mt-28">
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
