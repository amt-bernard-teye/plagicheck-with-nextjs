import { LecturerRepository } from "@/lib/repository/lecturer.repository";
import { StatusCode } from "@/lib/enum/status-code";
import { lecturerValidationSchema } from "@/lib/validation/manage-users.validation";
import { getExceptionMessage } from "@/lib/exceptions/exception-handler";
import { checkDepartment } from "@/lib/util/check-entities.util";


type Params = {
  params: {
    id: string;
  }
}

export async function PUT(req: Request, {params}: Params) {
  const data = await req.json();

  try {
    const validatedData = await lecturerValidationSchema.validate(data);

    const lecturerRepo = new LecturerRepository();
    const lecturer = await checkLecturer(params.id, lecturerRepo);
    const department = await checkDepartment(+validatedData.departmentId);

    if (!lecturer) {
      throw new Error("Lecturer doesn't exist");
    }

    lecturer.user.name = validatedData.name;
    lecturer.user.email = validatedData.email;
    lecturer.user.phoneNumber = validatedData.phoneNumber;
    lecturer.qualification = validatedData.qualification;
    lecturer.department = {
      id: department.id!,
      name: department.name
    }

    const updatedLecturer = await lecturerRepo.update(lecturer);

    return Response.json({
      message: "Lecturer updated successfully",
      data: updatedLecturer
    });
  }
  catch(error: any) {
    let message = getExceptionMessage(error);
    return Response.json({ message }, {
      status: StatusCode.BAD_REQUEST
    });
  }
}


export async function DELETE(req: Request, {params}: Params) {
  try {
    const lecturerRepo = new LecturerRepository();
    await checkLecturer(params.id, lecturerRepo);

    await lecturerRepo.delete(params.id);

    return Response.json({
      message: "Lecturer deleted successfully"
    });
  }
  catch(error: any) {
    let message = getExceptionMessage(error);
    return Response.json({ message }, {
      status: StatusCode.BAD_REQUEST
    });
  }
}


async function checkLecturer(id: string, repo: LecturerRepository) {
  const lecturer = await repo.findByUserId(id);

  if (!lecturer) {
    throw new Error("Lecturer doesn't exist");
  }

  return lecturer;
}