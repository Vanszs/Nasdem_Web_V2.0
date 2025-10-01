import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET() {
  const dapils = await db.dapil.findMany({
    include: { kecamatan: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ success: true, data: dapils });
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  const { name } = await req.json();
  const dapil = await db.dapil.create({ data: { name } });
  return NextResponse.json({ success: true, data: dapil });
}
