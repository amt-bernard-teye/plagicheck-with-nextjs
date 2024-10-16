"use server";

import { join } from "path";
import fs from "fs/promises";
import { cookies } from "next/headers";

import { UserRepository } from "../repository/user.repository";
import { ensureUserIsLoggedIn } from "../middleware/authorization-check.middleware";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function fileUploadAction(formData: FormData) {
  const isLoggedIn = ensureUserIsLoggedIn();

  if (!isLoggedIn) {
    return redirect("/");
  }

  const file = <File>formData.get("file");
  const fileBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(fileBuffer);
  const fileName = new Date().getTime() + file.name;
  
  const path = join(process.cwd(), "public", "uploads", fileName);
  await fs.writeFile(path, buffer);

  const emailCookie = cookies().get("user_email");
  const email = emailCookie ? emailCookie.value : "";

  const repo = new UserRepository();
  const existingUser = await repo.find(email);

  if (existingUser!.image) {
    await fs.unlink(join(process.cwd(), "public", existingUser!.image));
  }

  let imagePath = `/uploads/${fileName}`;
  existingUser!.image = imagePath;
  await repo.update(existingUser!);

  const tokenDuration = 60 * 60 * 24 * 1000;
  cookies().set("user_image_path", existingUser!.image, {maxAge: tokenDuration, path: "/"});
  revalidatePath("/dashboard/account-settings");
}