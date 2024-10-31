import { ReactNode } from "react";

export default function ContentWrapper({children}: {children: ReactNode}) {
  return (
    <div className="py-[15px] px-[21px] xl:py-[19px] xl:px-[41px]">
      { children }
    </div>
  );
}