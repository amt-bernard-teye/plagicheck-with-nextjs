import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./paginator.module.css";
import ArrowLeft from "@/components/atoms/icons/arrow-left";
import ArrowRight from "@/components/atoms/icons/arrow-right";


type PaginatorProps = {
  totalRows: number;
  pageParams?: URLSearchParams
}


export default function Paginator({totalRows, pageParams}: PaginatorProps) {
  const { pathname, query } = useRouter();

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
        className={styles.paginatorLink}>{ i + 1 }</Link>
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
    <div className={styles.paginator}>
      <Link href={previousPath} className={styles.paginatorLink}>
        <ArrowLeft /> Previous
      </Link>
      { links }
      <Link href={nextPath} className={styles.paginatorLink}>
        Next <ArrowRight />
      </Link>
    </div>
  );
}