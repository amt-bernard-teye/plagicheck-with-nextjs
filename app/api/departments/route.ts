import { StatusCode } from "@/lib/enum/status-code";
import { getExceptionMessage } from "@/lib/exceptions/exception-handler";
import { DepartmentRepository } from "@/lib/repository/department.repository";
import { checkFaculty } from "@/lib/util/check-entities.util";
import { departmentValidationSchema } from "@/lib/validation/academic-divisition.validation";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const validatedData = await departmentValidationSchema.validate(data);
    const departmentRepo = new DepartmentRepository();
    const existingFaculty = await checkFaculty(+validatedData.facultyId);

    const department = await departmentRepo.create({
      name: validatedData.name,
      facultyId: existingFaculty.id
    });

    return Response.json({
      message: "Department added successfully",
      data: department
    });
  }
  catch(error) {
    let message = getExceptionMessage(error);

    return Response.json({ message }, {
      status: StatusCode.BAD_REQUEST
    });
  }
}