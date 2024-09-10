import { NextApiRequest } from "next";

export function getQueryPage(req: NextApiRequest) {
  const query = req.query.q as string || "";
  let page = parseInt(req.query.q as string);

  if (Number.isNaN(page)) {
    page = 0;
  }

  return {query, page};
}