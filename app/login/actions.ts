"use server";

import { redirect } from "next/navigation";
import { findUserByEmail, findMemberByUserId } from "@/lib/db";
import { verifyPassword, setSessionCookie, clearSessionCookie } from "@/lib/auth";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Preencha o e-mail e a senha." };
  }

  const user = await findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "E-mail ou senha inválidos." };
  }

  let memberId: string | undefined = undefined;
  if (user.role === "ASSOCIADO") {
    const member = await findMemberByUserId(user.id);
    if (member) memberId = member.id;
  }

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    memberId,
  });

  if (user.role === "ADMIN" || user.role === "SECRETARIA" || user.role === "FINANCEIRO") {
    redirect("/admin");
  } else {
    redirect("/portal");
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
