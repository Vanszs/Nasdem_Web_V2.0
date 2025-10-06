import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toInt } from "@/lib/parsers";
import { UserRole } from "@/lib/rbac";

export async function GET() {
  const desas = await db.desa.findMany({
    include: { kecamatan: true, tps: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ success: true, data: desas });
}

export async function POST(req: NextRequest) {
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
  const desa = await db.desa.create({ data: { name, kecamatanId } });
  return NextResponse.json({ success: true, data: desa });
}
