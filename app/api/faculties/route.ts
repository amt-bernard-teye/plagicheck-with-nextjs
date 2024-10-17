import { redirect } from "next/navigation";

import { StatusCode } from "@/lib/enum/status-code";
import { FacultyRepository } from "@/lib/repository/faculty.repository";
import { ensureUserIsLoggedIn } from "@/lib/middleware/authorization-check.middleware";
import { getExceptionMessage } from "@/lib/exceptions/exception-handler";
import { facultyValidationSchema } from "@/lib/validation/academic-divisition.validation";

export async function POST(req: Request) {
  const isLoggedIn = ensureUserIsLoggedIn();

  if (!isLoggedIn) {
    return redirect("/");
  }

  const data = <{name: string}> await req.json();
  const repo = new FacultyRepository();

  try {
    const validatedData = await facultyValidationSchema.validate(data);
    const faculty = await repo.create(validatedData);

    return Response.json({
      message: "Faculty added successfully",
      data: faculty
    }, { status: StatusCode.SUCCESS });
  }
  catch(error: any) {
    let message = getExceptionMessage(error);

    return Response.json({ message }, {
      status: StatusCode.SERVER
    });
  }
}