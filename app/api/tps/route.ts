import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET() {
  const tpses = await db.tps.findMany({
    include: { desa: true },
    orderBy: { number: "asc" },
  });
  return NextResponse.json({ success: true, data: tpses });
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  const { number, desaId } = await req.json();
  const tps = await db.tps.create({ data: { number, desaId } });
  return NextResponse.json({ success: true, data: tps });
}
