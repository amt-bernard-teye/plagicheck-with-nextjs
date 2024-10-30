import { StatusCode } from "@/lib/enum/status-code";
import { AppException } from "@/lib/exceptions/app.exception";
import { getExceptionMessage } from "@/lib/exceptions/exception-handler";
import { DepartmentRepository } from "@/lib/repository/department.repository";
import { FacultyRepository } from "@/lib/repository/faculty.repository";
import { departmentValidationSchema } from "@/lib/validation/academic-divisition.validation";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const validatedData = await departmentValidationSchema.validate(data);
    const departmentRepo = new DepartmentRepository();
    const facultyRepo = new FacultyRepository();

    const existingFaculty = await facultyRepo.find(+validatedData.facultyId);

    if (!existingFaculty) {
      throw new AppException("Faculty doesn't exist");
    }

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