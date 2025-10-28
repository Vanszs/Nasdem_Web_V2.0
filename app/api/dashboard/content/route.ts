import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { ProgramStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [
    UserRole.SUPERADMIN,
    UserRole.EDITOR,
    UserRole.ANALYST,
  ]);
  if (roleError) return roleError;

  // Build last 6 months buckets
  const now = new Date();
  const months: { key: string; start: Date; end: Date; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)
    );
    const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
    const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
    const label = d.toLocaleString("id-ID", { month: "long" });
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`;
    months.push({ key, start, end, label });
  }

  const rangeStart = months[0].start;
  const [programs, news, medias] = await Promise.all([
    db.program.findMany({
      where: { deletedAt: null, createdAt: { gte: rangeStart } },
      select: { createdAt: true, status: true },
    }),
    db.news.findMany({
      where: { deletedAt: null, createdAt: { gte: rangeStart } },
      select: { createdAt: true },
    }),
    db.activityMedia.findMany({
      where: { uploadedAt: { gte: rangeStart } },
      select: { uploadedAt: true },
    }),
  ]);

  // Program chart data: per status per month
  const programChartData = months.map((m) => ({
    month: m.label,
    pending: 0,
    ongoing: 0,
    completed: 0,
    planning: 0,
  }));
  const monthIndex = (d: Date) =>
    months.findIndex((m) => d >= m.start && d < m.end);
  for (const p of programs) {
    const idx = monthIndex(p.createdAt);
    if (idx >= 0) {
      const s = String(p.status).toLowerCase() as
        | "pending"
        | "ongoing"
        | "completed"
        | "planning";
      if (programChartData[idx][s] !== undefined)
        (programChartData[idx] as any)[s] += 1;
    }
  }

  // Recent content table
  const recentContentData = months.map((m) => ({
    month: m.label,
    Berita: 0,
    Galeri: 0,
    Organisasi: 0,
    Program: 0,
  }));
  for (const n of news) {
    const idx = monthIndex(n.createdAt);
    if (idx >= 0) recentContentData[idx].Berita += 1;
  }
  for (const g of medias) {
    const idx = monthIndex(g.uploadedAt);
    if (idx >= 0) recentContentData[idx].Galeri += 1;
  }
  for (const p of programs) {
    const idx = monthIndex(p.createdAt);
    if (idx >= 0) recentContentData[idx].Program += 1;
  }

  return NextResponse.json({
    success: true,
    data: { programChartData, recentContentData },
  });
}
