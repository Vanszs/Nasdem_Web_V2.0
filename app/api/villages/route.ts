import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET() {
  const desas = await db.desa.findMany({
    include: { Kecamatan: true, Tps: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ success: true, data: desas });
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  // POST
  const { name, kecamatanId } = await req.json();
  const desa = await db.desa.create({ data: { name, kecamatanId } });
  return NextResponse.json({ success: true, data: desa });
}
