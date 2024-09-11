import { FetchForm } from "@/lib/enums/fetch-form";
import { StatusCode } from "@/lib/enums/status-code";
import { FacultyRepository } from "@/lib/repository/faculty.repository";
import { Faculty } from "@/lib/types/faculty.type";
import { checkApiAccess } from "@/lib/utils/check-api-access";
import { getQueryPageForm } from "@/lib/utils/get-query-page-form";
import { handleError } from "@/lib/utils/handle-error";
import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  checkApiAccess(req, res);

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
  catch(error: any) {
    handleError(error, res);
  }
}


async function getFaculties(req: NextApiRequest, res: NextApiResponse) {
  const values = getQueryPageForm(req);
  let faculties: Faculty[] = [];
  let totalRows = 0;

  try {
    if (values.form === FetchForm.PAGINATE) {
      [faculties, totalRows] = await Promise.all([
        repo.paginate(values.query, values.page),
        repo.count(values.query)
      ]);
  
      res.status(StatusCode.SUCCESS).json({
        count: totalRows,
        data: faculties
      });
    }
    else {
      faculties = await repo.findAll();
      
      res.status(StatusCode.SUCCESS).json({
        data: faculties
      });
    }
  }
  catch(error) {
    res.status(StatusCode.SERVER).json({
      message: "Something went wrong"
    });
  }
}