import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sayap = await db.sayapType.findUnique({
      where: { id: parseInt(params.id) },
      include: { strukturOrganisasi: true },
    });
    if (!sayap)
      return NextResponse.json(
        { success: false, error: "Sayap not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: sayap });
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
    const { name, description } = await req.json();
    const updated = await db.sayapType.update({
      where: { id: parseInt(params.id) },
      data: { name, description },
      include: { strukturOrganisasi: true },
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
    await db.sayapType.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "Sayap deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
