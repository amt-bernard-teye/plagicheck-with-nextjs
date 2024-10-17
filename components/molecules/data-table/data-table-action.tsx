import { ReactNode, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

type DataTableActionsProps = {
  children: ReactNode
}

export default function DataTableActions({ children }: DataTableActionsProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="inline-block relative">
      <button onClick={() => setShowActions(!showActions)} 
        className="p-[5px] rounded-sm hover:bg-[#e9e9ea]">
        <BsThreeDotsVertical />
      </button>
      {showActions && (
        <div 
          className="flex flex-col gap-2 bg-white shadow-md rounded-lg p-4 absolute right-0 top-[30px] z-[3] w-[179px] border">
          { children }
        </div>
      )}
    </div>
  );
}