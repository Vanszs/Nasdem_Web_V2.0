import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toInt, toIntArray } from "@/lib/parsers";
import { UserRole } from "@/lib/rbac";

const MAX_KADER_PER_DPRT = 10;

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const body = await req.json();
    const dprtMemberId = toInt(body.dprtMemberId);
    const kaderIds = toIntArray(body.kaderIds);
    if (!dprtMemberId) {
      return NextResponse.json(
        { success: false, error: "dprtMemberId wajib diisi" },
        { status: 400 }
      );
    }
    if (!kaderIds.length) {
      return NextResponse.json(
        { success: false, error: "kaderIds tidak boleh kosong" },
        { status: 400 }
      );
    }

    const dprtMember = await db.member.findUnique({
      where: { id: dprtMemberId },
      include: { struktur: true },
    });
    if (!dprtMember) {
      return NextResponse.json(
        { success: false, error: "Member DPRT tidak ditemukan" },
        { status: 404 }
      );
    }
    if ((dprtMember as any).struktur?.level !== "dprt") {
      return NextResponse.json(
        { success: false, error: "Member yang dipilih bukan anggota DPRT" },
        { status: 400 }
      );
    }

    // Count current cadres for this member (requires migration to add parentDprtMemberId)
    const existingCount = await (db as any).member.count({
      where: { parentDprtMemberId: dprtMemberId },
    });
    if (existingCount + kaderIds.length > MAX_KADER_PER_DPRT) {
      return NextResponse.json(
        {
          success: false,
          error: `Melebihi batas maksimum ${MAX_KADER_PER_DPRT} kader per anggota DPRT`,
        },
        { status: 400 }
      );
    }

    // Assign cadres by setting parentDprtMemberId
    const updates = await (db as any).member.updateMany({
      where: { id: { in: kaderIds } },
      data: { parentDprtMemberId: dprtMemberId },
    });

    return NextResponse.json({ success: true, data: { count: updates.count } });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
