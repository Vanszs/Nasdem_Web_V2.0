import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toInt } from "@/lib/parsers";
import { UserRole } from "@/lib/rbac";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const desa = await db.desa.findUnique({
    where: { id: parseInt(params.id) },
    include: { kecamatan: true, tps: true },
  });
  if (!desa)
    return NextResponse.json(
      { success: false, error: "Village not found" },
      { status: 404 }
    );
  return NextResponse.json({ success: true, data: desa });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;
  const body = await req.json();
  const kecamatanId = toInt(body.kecamatanId);
  if (kecamatanId === undefined) {
    return NextResponse.json(
      { success: false, error: "kecamatanId harus berupa angka" },
      { status: 400 }
    );
  }
  const name = body.name;
  const updated = await db.desa.update({
    where: { id: parseInt(params.id) },
    data: { name, kecamatanId },
  });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;
  await db.desa.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true, message: "Village deleted" });
}
