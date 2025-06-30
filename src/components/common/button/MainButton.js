import Link from "next/link";

const MainButton = ({ children, href, imageUrl }) => {
  const className = `w-60 h-60 border-[5px] rounded-xl flex items-center justify-center text-4xl font-bold relative hover:-translate-y-1 transition-transform cursor-pointer bg-[length:cover] bg-center`;
  
  return (
    <Link
      href={href}
      className={className}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {children}
    </Link>
  );
};

export default MainButton;

