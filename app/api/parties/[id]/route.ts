import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const party = await db.party.findUnique({
      where: { id: parseInt(params.id) },
      include: { Caleg: true, DprdPartyResult: true },
    });
    if (!party)
      return NextResponse.json(
        { success: false, error: "Party not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: party });
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
    const { name, abbreviation, logoUrl } = await req.json();
    const updated = await db.party.update({
      where: { id: parseInt(params.id) },
      data: { name, abbreviation, logoUrl },
      include: { Caleg: true, DprdPartyResult: true },
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
    await db.party.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "Party deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
