import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export function ensureUserIsLoggedIn() {
  const auth = cookies().get("_auth-tk");
  const token = auth ? auth.value : "";
  let isLoggedIn = false;

  try {
    verify(token, process.env.SECRET_KEY!);
    isLoggedIn = true;
  }
  catch(error) {
    isLoggedIn = false;
  }
  
  return isLoggedIn;
}