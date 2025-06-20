import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
}) {
  return (
    <div
      className={`pointer rounded-full  border p-2  ${activated ? "text-green-400" : "hover:text-black text-white bg-black hover:bg-gray-50"}  cursor-pointer`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
}
