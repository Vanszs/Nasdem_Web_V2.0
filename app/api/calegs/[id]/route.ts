import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toInt } from "@/lib/parsers";
import { UserRole } from "@/lib/rbac";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caleg = await db.caleg.findUnique({
      where: { id: parseInt(params.id) },
      include: { party: true, dprdCalegResults: true },
    });
    if (!caleg)
      return NextResponse.json(
        { success: false, error: "Caleg not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: caleg });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
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
    const updated = await db.caleg.update({
      where: { id: parseInt(params.id) },
      data: { fullName, partyId, photoUrl: photoUrl || undefined },
      include: { party: true, dprdCalegResults: true },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.ANALYST]);
  if (roleError) return roleError;
  try {
    await db.caleg.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "Caleg deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
