import { verify } from "jsonwebtoken";

export function checkAuthUser(context: any) {
  const accessToken = context.req.cookies['_auth-tk'] || "";

  if (accessToken === "") {
    return {
      redirect: {
        destination: '/',
        statusCode: 301
      },
    }
  }

  try {
    verify(accessToken, process.env.SECRET_KEY!);
  }
  catch(error) {
    return {
      redirect: {
        destination: '/',
        statusCode: 301
      },
    }
  }
}