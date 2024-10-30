import { StatusCode } from "@/lib/enum/status-code";
import { AppException } from "@/lib/exceptions/app.exception";
import { getExceptionMessage } from "@/lib/exceptions/exception-handler";
import { DepartmentRepository } from "@/lib/repository/department.repository";
import { checkFaculty } from "@/lib/util/check-entities.util";
import { departmentValidationSchema } from "@/lib/validation/academic-divisition.validation";

type PutParams = {
  params: {
    id: string;
  }
}

export async function PUT(req: Request, {params}: PutParams) {
  const { id } = params;
  const data = await req.json();

  try {
    const validatedData = await departmentValidationSchema.validate(data);
    const departmentRepo = new DepartmentRepository();
    const existingFaculty = await checkFaculty(+validatedData.facultyId);

    const existingDepartment = await departmentRepo.find(+id);

    if (!existingDepartment) {
      throw new AppException("Department doesn't exist");
    }

    existingDepartment.name = validatedData.name;
    existingDepartment.facultyId = existingFaculty.id;
    const updatedDepartment = await departmentRepo.update(existingDepartment);

    return Response.json({
      message: "Department updated successfully",
      data: updatedDepartment
    });
  }
  catch(error) {
    let message = getExceptionMessage(error);
    return Response.json({ message }, {
      status: StatusCode.SERVER
    });
  }
}


export async function DELETE(req: Request, {params}: PutParams) {
  const { id } = params;

  try {
    const departmentRepo = new DepartmentRepository();
    const existingDepartment = await departmentRepo.find(+id);

    if (!existingDepartment) {
      throw new AppException("Department doesn't exist");
    }
    const updatedDepartment = await departmentRepo.delete(existingDepartment.id!);

    return Response.json({
      message: "Department updated successfully",
      data: updatedDepartment
    });
  }
  catch(error) {
    let message = getExceptionMessage(error);
    return Response.json({ message }, {
      status: StatusCode.SERVER
    });
  }
}