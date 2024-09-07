import { PropsWithChildren } from "react";

import Backdrop from "@/components/atoms/backdrop/backdrop";
import styles from "./modal.module.css";
import CloseButton from "@/components/atoms/close-button/close-button";

type ModalProps = PropsWithChildren<{
  title: string;
  onToggle: () => void;
}>

export default function Modal({title, children, onToggle}: ModalProps) {
  return (
    <>
      <Backdrop onClick={onToggle}/>
      <section className={styles.modal}>
        <div className="flex align-items-center justify-content-between mb-1-0">
          <h3>{title}</h3>
          <CloseButton onClick={onToggle}/>
        </div>
        { children }
      </section>
    </>
  );
}