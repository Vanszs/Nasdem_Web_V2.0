import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toInt } from "@/lib/parsers";
import { UserRole } from "@/lib/rbac";

export async function GET() {
  try {
    const calegs = await db.caleg.findMany({
      include: {
        party: true,
        dprdCalegResults: true,
      },
      orderBy: { fullName: "asc" },
    });
    return NextResponse.json({ success: true, data: calegs });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.ANALYST]);
  if (roleError) return roleError;
  try {
    const body = await req.json();
    const partyId = toInt(body.partyId);
    if (partyId === undefined) {
      return NextResponse.json(
        { success: false, error: "partyId harus berupa angka" },
        { status: 400 }
      );
    }
    const { fullName } = body;
    const photoUrl =
      typeof body.photoUrl === "string" ? body.photoUrl : undefined;
    const caleg = await db.caleg.create({
      data: { fullName, partyId, photoUrl: photoUrl || undefined },
      include: { party: true, dprdCalegResults: true },
    });
    return NextResponse.json({ success: true, data: caleg });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
