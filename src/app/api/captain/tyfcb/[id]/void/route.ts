import { NextRequest, NextResponse } from "next/server";
import { requireCaptain } from "@/lib/auth";
import { query } from "@/lib/db";
import { getCaptainContext } from "@/lib/captain";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireCaptain();

  const ctx = await getCaptainContext(user.id);
  if (!ctx) {
    return NextResponse.json({ error: "Profil captain tidak ditemukan." }, { status: 404 });
  }

  const { id: entryId } = await params;

  // Fetch entry and verify giver is in captain's team
  const { rows } = await query<{
    id: string;
    status: string;
    team_id: string | null;
  }>(`
    select te.id, te.status::text as status, m.team_id
    from tyfcb_entries te
    join members m on m.id = te.giver_id
    where te.id = $1
    limit 1
  `, [entryId]);

  const entry = rows[0];
  if (!entry) {
    return NextResponse.json({ error: "Entry tidak ditemukan." }, { status: 404 });
  }

  if (entry.team_id !== ctx.team_id) {
    return NextResponse.json({ error: "Entry tidak ada di tim kamu." }, { status: 403 });
  }

  if (entry.status !== "pending") {
    return NextResponse.json(
      { error: "Hanya entry berstatus pending yang bisa di-void." },
      { status: 409 }
    );
  }

  await query(
    `update tyfcb_entries
     set status = 'void', voided_by = $1, voided_at = now()
     where id = $2`,
    [user.id, entryId]
  );

  return NextResponse.json({ ok: true });
}
