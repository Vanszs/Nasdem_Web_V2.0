import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const region = await db.dapil.findUnique({
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
  const { name } = await req.json();
  const updated = await db.dapil.update({
    where: { id: parseInt(params.id) },
    data: { name },
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
  await db.dapil.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true, message: "Region deleted" });
}
