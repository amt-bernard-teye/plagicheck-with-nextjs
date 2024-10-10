"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function logoutAction() {
  cookies().delete("user_id");
  cookies().delete("user_email");
  cookies().delete("user_name");
  cookies().delete("_auth-tk");
  redirect("/");
}