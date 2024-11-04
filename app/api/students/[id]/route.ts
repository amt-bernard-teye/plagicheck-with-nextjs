import { StatusCode } from "@/lib/enum/status-code";
import { studentValidationSchema } from "@/lib/validation/manage-users.validation";
import { getExceptionMessage } from "@/lib/exceptions/exception-handler";
import { checkDepartment } from "@/lib/util/check-entities.util";
import { StudentRepository } from "@/lib/repository/student.repository";


type Params = {
  params: {
    id: string;
  }
}

export async function PUT(req: Request, {params}: Params) {
  const data = await req.json();

  try {
    const validatedData = await studentValidationSchema.validate(data);

    const studentRepo = new StudentRepository();
    const lecturer = await checkStudent(params.id, studentRepo);
    const department = await checkDepartment(+validatedData.departmentId);

    lecturer.user.name = validatedData.name;
    lecturer.user.email = validatedData.email;
    lecturer.user.phoneNumber = validatedData.phoneNumber;
    lecturer.department = {
      id: department.id!,
      name: department.name
    }

    const updatedLecturer = await studentRepo.update(lecturer);

    return Response.json({
      message: "Student updated successfully",
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
    const studentRepo = new StudentRepository();
    await checkStudent(params.id, studentRepo);

    await studentRepo.delete(params.id);

    return Response.json({
      message: "Student deleted successfully"
    });
  }
  catch(error: any) {
    let message = getExceptionMessage(error);
    return Response.json({ message }, {
      status: StatusCode.BAD_REQUEST
    });
  }
}


async function checkStudent(id: string, repo: StudentRepository) {
  const student = await repo.findByUserId(id);

  if (!student) {
    throw new Error("Student doesn't exist");
  }

  return student;
}