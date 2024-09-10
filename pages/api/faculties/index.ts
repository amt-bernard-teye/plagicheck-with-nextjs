import { StatusCode } from "@/lib/enums/status-code";
import { FacultyRepository } from "@/lib/repository/faculty.repository";
import { CheckApiAccess } from "@/lib/utils/check-api-access";
import { getQueryPage } from "@/lib/utils/get-query-page";
import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  CheckApiAccess(req, res);

  if (req.method === "POST") {
    await createFaculty(req, res);
    return;
  }
  else if (req.method === "GET") {
    await getFaculties(req, res);
    return;
  }

  return res.status(StatusCode.BAD_REQUEST).json({
    message: "Route not found"
  });
}


const validationSchema = Yup.object({
  name: Yup.string().required("Name is required")
        .min(3, "Must be at least 3 characters")
        .matches(/^[a-zA-Z ]+$/, "Only letters and white spaces are allowed")
        .trim()
});
const repo = new FacultyRepository();

async function createFaculty(req: NextApiRequest, res: NextApiResponse) {
  const data = <{name: string}>req.body;

  try {
    const validatedData = await validationSchema.validate(data);
    const faculty = await repo.create(validatedData);

    res.status(StatusCode.CREATED).json({
      message: "Faculty added successfully",
      data: faculty
    });
  }
  catch(error) {
    let message = "Something went wrong";
    let status = StatusCode.SERVER;

    if (error instanceof Yup.ValidationError) {
      message = "Validation failed";
      status = StatusCode.BAD_REQUEST;
    }

    res.status(status).json({ message });
  }
}


async function getFaculties(req: NextApiRequest, res: NextApiResponse) {
  const values = getQueryPage(req);

  try {
    const [faculties, totalRows] = await Promise.all([
      repo.paginate(values.query, values.page),
      repo.count(values.query)
    ]);

    res.status(StatusCode.SUCCESS).json({
      count: totalRows,
      data: faculties
    });
  }
  catch(error) {
    res.status(StatusCode.SERVER).json({
      message: "Something went wrong"
    });
  }
}