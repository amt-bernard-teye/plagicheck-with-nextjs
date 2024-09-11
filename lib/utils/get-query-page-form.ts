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