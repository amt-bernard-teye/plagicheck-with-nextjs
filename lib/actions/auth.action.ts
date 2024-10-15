"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify } from "jsonwebtoken";

import { ensureUserIsLoggedIn } from "../middleware/authorization-check.middleware";
import { UserRepository } from "../repository/user.repository";


export async function logoutAction() {
  cookies().delete("user_id");
  cookies().delete("user_email");
  cookies().delete("user_name");
  cookies().delete("_auth-tk");
  redirect("/");
}


export async function deleteAccountAction() {
  const isLoggedIn = ensureUserIsLoggedIn();

  if (!isLoggedIn) {
    return redirect("/");
  }

  const token = cookies().get("_auth-tk")!.value;
  const result = <{id: string, email: string}>verify(token, process.env.SECRET_KEY!);

  const repo = new UserRepository();
  await repo.delete(result.id);

  return redirect("/");
}