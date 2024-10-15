import { PropsWithChildren } from "react";
import Heading from "../atoms/heading";

type SubHeaderProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

export default function SubHeader({title, description, children}: SubHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-4 py-[15px] px-[21px] lg:py-[19px] lg:px-[41px] border-b border-b-[var(--gray-800)]">
      <div className="">
        <Heading>{title}</Heading>
        <p>{description}</p>
      </div>
      { children }
    </div>
  );
}