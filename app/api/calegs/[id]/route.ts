import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caleg = await db.caleg.findUnique({
      where: { id: parseInt(params.id) },
      include: { party: true, dprdCalegResults: true },
    });
    if (!caleg)
      return NextResponse.json(
        { success: false, error: "Caleg not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: caleg });
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
  const roleError = requireRole(req, ["superadmin", "analyst"]);
  if (roleError) return roleError;
  try {
    const { fullName, partyId, photoUrl } = await req.json();
    const updated = await db.caleg.update({
      where: { id: parseInt(params.id) },
      data: { fullName, partyId, photoUrl: photoUrl || undefined },
      include: { party: true, dprdCalegResults: true },
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
  const roleError = requireRole(req, ["superadmin", "analyst"]);
  if (roleError) return roleError;
  try {
    await db.caleg.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "Caleg deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
