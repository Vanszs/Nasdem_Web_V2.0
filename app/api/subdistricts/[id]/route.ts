import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toInt } from "@/lib/parsers";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const region = await db.kecamatan.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!region)
    return NextResponse.json(
      { success: false, error: "Region not found" },
      { status: 404 }
    );
  return NextResponse.json({ success: true, data: region });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;
  const body = await req.json();
  const dapilId = toInt(body.dapilId);
  if (dapilId === undefined) {
    return NextResponse.json(
      { success: false, error: "dapilId harus berupa angka" },
      { status: 400 }
    );
  }
  const name = body.name;
  const updated = await db.kecamatan.update({
    where: { id: parseInt(params.id) },
    data: { name, dapilId },
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
  await db.kecamatan.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true, message: "Region deleted" });
}
