import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { MemberStatus } from "@prisma/client";

// NOTE: For now, this endpoint returns sample data.
// Replace with real Prisma aggregations when analytics are available.

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [
    UserRole.SUPERADMIN,
    UserRole.EDITOR,
    UserRole.ANALYST,
  ]);
  if (roleError) return roleError;

  // Compute live KPI values from database
  const [
    newsCount,
    programCount,
    activityCount,
    galleryMediaCount,
    activeMembers,
  ] = await Promise.all([
    db.news.count({ where: { deletedAt: null } }),
    db.program.count({ where: { deletedAt: null } }),
    db.activity.count({ where: { deletedAt: null } }),
    db.activityMedia.count(),
    db.member.count({
      where: { deletedAt: null, status: MemberStatus.active },
    }),
  ]);

  // Total content: News + Activities + Programs
  const totalContent = newsCount + activityCount + programCount;

  return NextResponse.json({
    success: true,
    data: {
      totalContent,
      totalProgram: programCount,
      activeMembers,
      totalGallery: galleryMediaCount,
    },
  });
}
