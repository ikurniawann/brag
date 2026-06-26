import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { user } = await requireUser();

  const { current_password, new_password } = await req.json();

  if (!current_password || !new_password) {
    return NextResponse.json({ error: "Password lama dan baru wajib diisi." }, { status: 400 });
  }

  if (new_password.length < 6) {
    return NextResponse.json({ error: "Password baru minimal 6 karakter." }, { status: 400 });
  }

  // Verify current password
  const { rows } = await query<{ valid: boolean }>(
    `select (password_hash = crypt($1, password_hash)) as valid from app_users where id = $2`,
    [current_password, user.id]
  );

  if (!rows[0]?.valid) {
    return NextResponse.json({ error: "Password lama tidak sesuai." }, { status: 400 });
  }

  await query(
    `update app_users set password_hash = crypt($1, gen_salt('bf')) where id = $2`,
    [new_password, user.id]
  );

  return NextResponse.json({ ok: true });
}
