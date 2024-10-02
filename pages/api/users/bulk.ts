import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
import fs from "fs";

import { StatusCode } from "@/lib/enums/status-code";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(StatusCode.BAD_REQUEST).json({
      message: "Route not found"
    });
  }

  const entity = <string>req.query.entity;

  if (!["LECTURERS", "STUDENTS"].includes(entity)) {
    return res.status(StatusCode.BAD_REQUEST).json({
      message: "Entity is unknown, please refresh page and try again"
    });
  }

  const fileName = entity === "LECTURERS" ? 'lecturers.csv' : 'students.csv';
  const file = join(process.cwd(), "public", "bulk", fileName);

  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
  res.setHeader("Content-Type", "text/csv");

  const fileStream = fs.createReadStream(file);
  fileStream.pipe(res);
}