import { ComponentPropsWithoutRef } from "react";

export default function Backdrop(props: ComponentPropsWithoutRef<"div">) {
  return (
    <div className="w-[100%] h-[100vh] fixed top-0 left-0 z-[5] bg-black/50" onClick={props.onClick}></div>
  );
}