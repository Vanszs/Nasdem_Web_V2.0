import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const struktur = await db.strukturOrganisasi.findUnique({
      where: { id: parseInt(params.id) },
      include: { SayapType: true, Region: true, Member: true },
    });
    if (!struktur)
      return NextResponse.json(
        { success: false, error: "Struktur not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: struktur });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;
  try {
    const {
      level,
      position,
      sayapTypeId,
      regionId,
      photoUrl,
      startDate,
      endDate,
    } = await req.json();
    const updated = await db.strukturOrganisasi.update({
      where: { id: parseInt(params.id) },
      data: {
        level,
        position,
        sayapTypeId,
        regionId,
        photoUrl,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: { SayapType: true, Region: true, Member: true },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;
  try {
    await db.strukturOrganisasi.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "Struktur deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
