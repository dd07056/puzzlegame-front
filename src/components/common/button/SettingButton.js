import Link from "next/link";

const SettingButton = ({ children, href }) => {
  const className =
    "bg-white text-blue-500 font-semibold px-4 py-2 rounded hover:bg-blue-100 transition ml-auto";
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

export default SettingButton;
