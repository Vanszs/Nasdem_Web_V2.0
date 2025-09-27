import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const desa = await db.desa.findUnique({
    where: { id: parseInt(params.id) },
    include: { Kecamatan: true, Tps: true },
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
  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;
  const { name, kecamatanId } = await req.json();
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
  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;
  await db.desa.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true, message: "Village deleted" });
}
