import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toInt } from "@/lib/parsers";
import { UserRole } from "@/lib/rbac";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tps = await db.tps.findUnique({
    where: { id: parseInt(params.id) },
    include: { desa: true },
  });
  if (!tps)
    return NextResponse.json(
      { success: false, error: "Tps not found" },
      { status: 404 }
    );
  return NextResponse.json({ success: true, data: tps });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  const body = await req.json();
  const desaId = toInt(body.desaId);
  if (desaId === undefined) {
    return NextResponse.json(
      { success: false, error: "desaId harus berupa angka" },
      { status: 400 }
    );
  }
  const number = body.number;
  const updated = await db.tps.update({
    where: { id: parseInt(params.id) },
    data: { number, desaId },
  });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  await db.tps.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true, message: "Region deleted" });
}
