import { UserRepository } from "@/lib/repository/user.repository";

export async function GET(req: Request) {
  const data = req.url.split("?")[1];
  const email = data.split("&")[0].split("=")[1];
 
  const repo = new UserRepository();

  try {
    const existingUser = await repo.find(email);
    
    if (existingUser) {
      throw new Error();
    }

    return Response.json({
      code: "NOT_EXIST"
    });
  }
  catch(error) {
    return Response.json({
      code: "EXIST"
    });
  }
}