import { ComponentPropsWithoutRef } from "react";
import { IoClose } from "react-icons/io5";

export default function CloseButton(props: ComponentPropsWithoutRef<"button">) {
  return (
    <button 
      className="text-2xl w-10 h-10 rounded-full text-[#ff0000] hover:bg-gray-100 flex items-center justify-center" 
      onClick={props.onClick}>
      <IoClose />
    </button>
  );
}