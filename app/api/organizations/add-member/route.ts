import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toInt, toIntArray } from "@/lib/parsers";
import { UserRole } from "@/lib/rbac";

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const body = await req.json();
    const strukturId = toInt(body.strukturId);
    const memberIds = toIntArray(body.memberIds);
    if (!strukturId) {
      return NextResponse.json(
        { success: false, error: "strukturId wajib diisi" },
        { status: 400 }
      );
    }
    if (!memberIds.length) {
      return NextResponse.json(
        { success: false, error: "memberIds tidak boleh kosong" },
        { status: 400 }
      );
    }

    const struktur = await db.strukturOrganisasi.findUnique({
      where: { id: strukturId },
    });
    if (!struktur) {
      return NextResponse.json(
        { success: false, error: "Struktur tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update members in bulk
    const updated = await db.member.updateMany({
      where: { id: { in: memberIds } },
      data: { strukturId },
    });

    return NextResponse.json({ success: true, data: { count: updated.count } });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
