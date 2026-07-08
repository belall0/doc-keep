"use server";

import { redirect } from "next/navigation";

import { setSession, clearSession } from "@/lib/session";
import { loginSchema, type LoginFormValues } from "@/dtos/auth";
import { getUserByEmail } from "@/dal/users/queries";

export async function login(data: LoginFormValues) {
  const result = loginSchema.safeParse(data);
  if (!result.success) return { message: "Invalid data" };

  const user = await getUserByEmail(result.data.email);
  if (!user) return { message: "User not found" };

  await setSession(user.id);
  return redirect("/projects");
}

export async function logout() {
  await clearSession();
  return redirect("/");
}
