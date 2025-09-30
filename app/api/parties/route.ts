import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET() {
  try {
    const parties = await db.party.findMany({
      include: {
        caleg: true,
        dprdPartyResults: true,
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: parties });
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
    const { name, abbreviation, logoUrl } = await req.json();
    const party = await db.party.create({
      data: { name, abbreviation, logoUrl },
      include: { caleg: true, dprdPartyResults: true },
    });
    return NextResponse.json({ success: true, data: party });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
