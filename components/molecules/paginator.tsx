"use client";

import Link from "next/link";

import ArrowLeft from "@/components/atoms/icons/arrow-left";
import ArrowRight from "@/components/atoms/icons/arrow-right";
import { usePathname, useSearchParams } from "next/navigation";


type PaginatorProps = {
  totalRows: number;
  pageParams?: URLSearchParams
}


export default function Paginator({totalRows, pageParams}: PaginatorProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = {
    page: searchParams.get("query"),
    q: searchParams.get("q")
  };

  let currentPage = +(query.page as string) || 0;
  let searchTerm = query.q as string || "";
  let links: React.JSX.Element[] = [];
  let rowPerPage = 9;

  if (totalRows < 10) {
    return null;
  }

  if (typeof currentPage !== "number" || Number.isNaN(currentPage)) {
    currentPage = 0;
  }

  for (let i = 0; i < Math.ceil(totalRows / rowPerPage); i++) {
    let path = `${pathname}?${pageParams ? pageParams.toString() + "&" : ""}page=${i + 1}`;

    if (searchTerm) {
      path += `&q=${searchTerm}`;
    }

    links.push(
      <Link
        key={i} 
        href={path} 
        className="text-[var(--black-300)] flex gap-2 items-center py-[5px] px-[10px] border border-[var(--gray-700)] hover:bg-[var(--gray-600)] md:py-[10px] md:px-4">{ i + 1 }</Link>
    );
  }

  let highestPageNumber = Math.ceil(totalRows / 9);
  let previousPageNumber = 0;
  let nextPageNumber = 0;

  if (!currentPage || currentPage === 1) {
    previousPageNumber = 1;
  }
  else if (currentPage > 1) {
    previousPageNumber = currentPage - 1;
  }

  if (!currentPage) {
    nextPageNumber = 2;
  }
  else if (currentPage  !== highestPageNumber) {
    nextPageNumber = currentPage + 1;
  }
  else {
    nextPageNumber = currentPage;
  }

  let previousPath = `${pathname}?${pageParams ? pageParams.toString() + "&" : ""}page=${previousPageNumber}`;
  let nextPath = `${pathname}?${pageParams ? pageParams.toString() + "&" : ""}page=${nextPageNumber}`;

  if (searchTerm) {
    previousPath += `&q=${searchTerm}`;
    nextPath += `&q=${searchTerm}`; 
  }

  return (
    <div className="flex justify-center mt-[30px]">
      <Link href={previousPath} 
        className="text-[var(--black-300)] flex gap-2 items-center py-[5px] px-[10px] border border-[var(--gray-700)] hover:bg-[var(--gray-600)] rounded-s-lg md:py-[10px] md:px-4">
        <ArrowLeft /> Previous
      </Link>
      { links }
      <Link href={nextPath} 
        className="text-[var(--black-300)] flex gap-2 items-center py-[5px] px-[10px] border border-[var(--gray-700)] hover:bg-[var(--gray-600)] md:py-[10px] md:px-4 rounded-e-lg">
        Next <ArrowRight />
      </Link>
    </div>
  );
}