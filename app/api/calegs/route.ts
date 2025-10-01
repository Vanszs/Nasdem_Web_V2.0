import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET() {
  try {
    const calegs = await db.caleg.findMany({
      include: {
        party: true,
        dprdCalegResults: true,
      },
      orderBy: { fullName: "asc" },
    });
    return NextResponse.json({ success: true, data: calegs });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, ["superadmin", "analyst"]);
  if (roleError) return roleError;
  try {
    const { fullName, partyId, photoUrl } = await req.json();
    const caleg = await db.caleg.create({
      data: { fullName, partyId, photoUrl: photoUrl || undefined },
      include: { party: true, dprdCalegResults: true },
    });
    return NextResponse.json({ success: true, data: caleg });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
