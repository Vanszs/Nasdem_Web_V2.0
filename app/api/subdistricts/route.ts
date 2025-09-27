import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET() {
  const kecamatans = await db.kecamatan.findMany({
    include: { Dapil: true, Desa: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ success: true, data: kecamatans });
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  const { name, dapilId } = await req.json();
  const kecamatan = await db.kecamatan.create({ data: { name, dapilId } });
  return NextResponse.json({ success: true, data: kecamatan });
}
