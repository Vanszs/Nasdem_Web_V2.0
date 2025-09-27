import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

// detail
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const region = await db.region.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!region)
    return NextResponse.json(
      { success: false, error: "Region not found" },
      { status: 404 }
    );
  return NextResponse.json({ success: true, data: region });
}

// update
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  const { name, type } = await req.json();
  const updated = await db.region.update({
    where: { id: parseInt(params.id) },
    data: { name, type },
  });
  return NextResponse.json({ success: true, data: updated });
}

// hapus
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  await db.region.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true, message: "Region deleted" });
}
