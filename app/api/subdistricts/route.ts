import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toInt } from "@/lib/parsers";

export async function GET() {
  const kecamatans = await db.kecamatan.findMany({
    include: { dapil: true, desa: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ success: true, data: kecamatans });
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  // POST
  const body = await req.json();
  const dapilId = toInt(body.dapilId);
  if (dapilId === undefined) {
    return NextResponse.json(
      { success: false, error: "dapilId harus berupa angka" },
      { status: 400 }
    );
  }
  const name = body.name;
  const kecamatan = await db.kecamatan.create({
    data: { name, dapilId },
  });
  return NextResponse.json({ success: true, data: kecamatan });
}
