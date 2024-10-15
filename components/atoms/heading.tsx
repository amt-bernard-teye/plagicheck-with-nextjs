import { ReactNode } from "react";

type HeadingProps = {
  children: ReactNode;
}

export default function Heading({children}: HeadingProps) {
  return (
    <h4 className="text-[1.2em] font-semibold">{ children }</h4>
  );
}