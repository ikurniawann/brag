"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  signInWithPassword,
  signOut as signOutLocal
} from "@/lib/local-auth";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=Email%20and%20password%20are%20required");
  }

  const { error } = await signInWithPassword(email, password);

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  await signOutLocal();
  revalidatePath("/", "layout");
  redirect("/login");
}
