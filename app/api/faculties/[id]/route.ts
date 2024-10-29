import { redirect } from "next/navigation";

import { StatusCode } from "@/lib/enum/status-code";
import { ensureUserIsLoggedIn } from "@/lib/middleware/authorization-check.middleware";
import { FacultyRepository } from "@/lib/repository/faculty.repository";
import { getExceptionMessage } from "@/lib/exceptions/exception-handler";
import { AppException } from "@/lib/exceptions/app.exception";

type PutParams = {
  params: {
    id: string;
  }
}

export async function PUT(req: Request, {params}: PutParams) {
  const isLoggedIn = ensureUserIsLoggedIn();

  if (!isLoggedIn) {
    return redirect("/");
  }

  const data = <{name: string}>await req.json();

  try {
    const facultyRepository = new FacultyRepository();
    const faculty = await facultyRepository.find(+params.id);

    if (!faculty) {
      throw new AppException("Please select the right faculty");
    }

    faculty.name = data.name;
    const updatedFaculty = await facultyRepository.update(faculty);

    return Response.json({
      message: "Faculty updated successfully",
      data: updatedFaculty
    }, {status: StatusCode.SUCCESS});
  }
  catch(error) {
    let message = getExceptionMessage(error);
    return Response.json({ message }, {
      status: StatusCode.SERVER
    });
  }
}


export async function DELETE(req: Request, {params}: PutParams) {
  const isLoggedIn = ensureUserIsLoggedIn();

  if (!isLoggedIn) {
    return redirect("/");
  }

  try {
    const facultyRepository = new FacultyRepository();
    const faculty = await facultyRepository.find(+params.id);

    if (!faculty) {
      throw new AppException("Please select the right faculty");
    }

    await facultyRepository.delete(faculty.id!);

    const query = "";
    const pageNumber = 0;
    const updatedFaculties = await facultyRepository.paginate(query, pageNumber);
    const rowCount = await facultyRepository.count(query);

    return Response.json({
      message: "Faculty removed successfully",
      data: updatedFaculties,
      count: rowCount
    }, {status: StatusCode.SUCCESS});
  }
  catch(error) {
    let message = getExceptionMessage(error);
    return Response.json({ message }, {
      status: StatusCode.SERVER
    });
  }
}