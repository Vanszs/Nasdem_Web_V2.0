import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { MemberStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [
    UserRole.SUPERADMIN,
    UserRole.EDITOR,
    UserRole.ANALYST,
  ]);
  if (roleError) return roleError;

  // Build last 6 month buckets
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

  const [
    // KPIs
    newsCount,
    programCount,
    activityCount,
    galleryMediaCount,
    activeMembers,
    // Series
    programs,
    news,
    medias,
    applicants,
    members,
  ] = await Promise.all([
    db.news.count({ where: { deletedAt: null } }),
    db.program.count({ where: { deletedAt: null } }),
    db.activity.count({ where: { deletedAt: null } }),
    db.activityMedia.count(),
    db.member.count({
      where: { deletedAt: null, status: MemberStatus.active },
    }),

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
    db.membershipApplication.findMany({
      where: { submittedAt: { gte: rangeStart } },
      select: { submittedAt: true },
    }),
    db.member.findMany({
      where: { deletedAt: null, createdAt: { gte: rangeStart } },
      select: { createdAt: true, struktur: { select: { level: true } } },
    }),
  ]);

  const totalContent = newsCount + activityCount + programCount;

  // Program chart data
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
      const s = String(
        p.status
      ).toLowerCase() as keyof (typeof programChartData)[number];
      if (s in programChartData[idx]) (programChartData[idx] as any)[s] += 1;
    }
  }

  // Recent content table — change Organisasi -> Pendaftar (membership applications)
  const recentContentData = months.map((m) => ({
    month: m.label,
    Berita: 0,
    Galeri: 0,
    Pendaftar: 0,
    Program: 0,
  }));
  for (const n of news) {
    const idx = monthIndex(n.createdAt);
    if (idx >= 0) recentContentData[idx].Berita += 1;
  }
  for (const g of medias) {
    const idx = monthIndex((g as any).uploadedAt);
    if (idx >= 0) recentContentData[idx].Galeri += 1;
  }
  for (const a of applicants) {
    const idx = monthIndex(a.submittedAt as unknown as Date);
    if (idx >= 0) recentContentData[idx].Pendaftar += 1;
  }
  for (const p of programs) {
    const idx = monthIndex(p.createdAt);
    if (idx >= 0) recentContentData[idx].Program += 1;
  }

  // Members growth series: aggregate per month by organizational level
  const membersSeries = months.map((m) => ({
    month: m.label,
    "Total Anggota": 0,
    DPD: 0,
    DPC: 0,
    DPRT: 0,
    Kader: 0,
  }));
  const getLevel = (s: any): "DPD" | "DPC" | "DPRT" | "Kader" => {
    // struktur can be array; prioritize highest level if multiple
    const levels: string[] = Array.isArray(s)
      ? s.map((x) => x.level)
      : s?.level
      ? [s.level]
      : [];
    const norm = levels.map((l) => String(l).toLowerCase());
    if (norm.includes("dpd")) return "DPD";
    if (norm.includes("dpc")) return "DPC";
    if (norm.includes("dprt")) return "DPRT";
    return "Kader";
  };
  for (const m of members as any[]) {
    const idx = monthIndex(m.createdAt as Date);
    if (idx >= 0) {
      const lvl = getLevel(m.struktur);
      (membersSeries[idx] as any)[lvl] += 1;
      (membersSeries[idx] as any)["Total Anggota"] += 1;
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        totalContent,
        totalProgram: programCount,
        activeMembers,
        totalGallery: galleryMediaCount,
      },
      content: {
        programChartData,
        recentContentData,
      },
      members: membersSeries,
    },
  });
}
