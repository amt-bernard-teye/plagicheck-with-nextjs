import { NextApiRequest } from "next";
import { FetchForm } from "../enums/fetch-form";

export function getQueryPageForm(req: NextApiRequest) {
  const query = req.query.q as string || "";
  let page = parseInt(req.query.q as string);
  let form = req.query.form as FetchForm;

  if (Number.isNaN(page)) {
    page = 0;
  }

  return {query, page, form};
}


type GetQueryAndPageValues = {
  page: string;
  q: string;
}


export function getQueryAndPage(value: GetQueryAndPageValues) {
  let page = +value.page;
  let query = value.q || "";

  if (typeof page !== "number" || Number.isNaN(page)) {
    page = 0;
  }

  if (page !== 0) {
    page -= 1;
  }

  return {page, query};
}