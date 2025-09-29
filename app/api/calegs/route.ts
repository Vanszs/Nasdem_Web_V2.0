import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET() {
  try {
    const calegs = await db.caleg.findMany({
      include: {
        Party: true,
        results: true,
      },
      orderBy: { name: "asc" },
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
    const { name, partyId } = await req.json();
    const caleg = await db.caleg.create({
      data: { name, partyId },
      include: { Party: true, results: true },
    });
    return NextResponse.json({ success: true, data: caleg });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
