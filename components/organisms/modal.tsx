import { PropsWithChildren } from "react";

import Backdrop from "@/components/atoms/back-drop";
import CloseButton from "@/components/atoms/close-button";

type ModalProps = PropsWithChildren<{
  title: string;
  onToggle: () => void;
}>

export default function Modal({title, children, onToggle}: ModalProps) {
  return (
    <>
      <Backdrop onClick={onToggle}/>
      <section className="w-[90%] md:w-[491px] fixed top-1/2 left-1/2 z-10 bg-white py-3 px-4 -translate-x-1/2 -translate-y-1/2 rounded-lg md:py-8 md:px-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[1.44em] font-semibold">{title}</h3>
          <CloseButton onClick={onToggle}/>
        </div>
        { children }
      </section>
    </>
  );
}