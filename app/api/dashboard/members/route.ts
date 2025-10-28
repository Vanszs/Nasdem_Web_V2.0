import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { OrgLevel } from "@prisma/client";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [
    UserRole.SUPERADMIN,
    UserRole.EDITOR,
    UserRole.ANALYST,
  ]);
  if (roleError) return roleError;

  // Last 6 months buckets
  const now = new Date();
  const months: { start: Date; end: Date; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)
    );
    const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
    const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
    const label = d.toLocaleString("id-ID", { month: "long" });
    months.push({ start, end, label });
  }
  const rangeStart = months[0].start;

  // Fetch members created within range with struktur level
  const members = await db.member.findMany({
    where: { deletedAt: null, createdAt: { gte: rangeStart } },
    select: { createdAt: true, struktur: { select: { level: true } } },
  });

  const data = months.map((m) => ({
    month: m.label,
    "Total Anggota": 0,
    DPC: 0,
    DPRT: 0,
    Kader: 0,
  }));

  const monthIndex = (d: Date) =>
    months.findIndex((m) => d >= m.start && d < m.end);
  for (const mem of members) {
    const idx = monthIndex(mem.createdAt);
    if (idx < 0) continue;
    data[idx]["Total Anggota"] += 1;
    const lvl = mem.struktur?.level as OrgLevel | undefined;
    if (lvl === OrgLevel.dpc) data[idx].DPC += 1;
    else if (lvl === OrgLevel.dprt) data[idx].DPRT += 1;
    else if (lvl === OrgLevel.kader) data[idx].Kader += 1;
  }

  return NextResponse.json({ success: true, data });
}
