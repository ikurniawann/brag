import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user } = await requireUser();
  if (user.role !== "admin" && user.role !== "super_admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { nama_tim } = await req.json();
  if (!nama_tim?.trim()) {
    return Response.json({ error: "Nama tim wajib diisi." }, { status: 400 });
  }

  await query(`update teams set nama_tim = $1 where id = $2`, [nama_tim.trim(), id]);
  return Response.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user } = await requireUser();
  if (user.role !== "admin" && user.role !== "super_admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const { rows } = await query<{ jumlah: number }>(
    `select count(*)::int as jumlah from members where team_id = $1`, [id]
  );
  if ((rows[0]?.jumlah ?? 0) > 0) {
    return Response.json(
      { error: "Team masih memiliki member. Pindahkan member terlebih dahulu." },
      { status: 409 }
    );
  }

  await query(`delete from teams where id = $1`, [id]);
  return Response.json({ ok: true });
}
