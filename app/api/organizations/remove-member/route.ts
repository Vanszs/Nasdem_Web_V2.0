import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toInt, toIntArray } from "@/lib/parsers";
import { UserRole } from "@/lib/rbac";

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const body = await req.json();
    const memberId = toInt(body.memberId);
    const memberIds = toIntArray(body.memberIds);
    const ids = [
      ...memberIds,
      ...(typeof memberId === "number" && !Number.isNaN(memberId)
        ? [memberId]
        : []),
    ];

    if (!ids.length) {
      return NextResponse.json(
        { success: false, error: "memberId/memberIds wajib diisi" },
        { status: 400 }
      );
    }

    const result = await db.member.updateMany({
      where: { id: { in: ids } },
      data: { strukturId: null },
    });

    return NextResponse.json({ success: true, data: { count: result.count } });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
