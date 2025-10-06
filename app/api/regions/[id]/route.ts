import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { RegionType } from "@prisma/client";
import { pickEnumValue } from "@/lib/parsers";

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

  const body = await req.json();
  const type = pickEnumValue(body.type, Object.values(RegionType));
  if (body.type && !type) {
    return NextResponse.json(
      { success: false, error: "Tipe region tidak valid" },
      { status: 400 }
    );
  }
  const updated = await db.region.update({
    where: { id: parseInt(params.id) },
    data: {
      name: body.name,
      type: type ?? undefined,
    },
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
