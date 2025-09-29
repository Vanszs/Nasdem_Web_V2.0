import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET() {
  try {
    const results = await db.dprdPartyResult.findMany({
      include: {
        Party: true,
        analysis: { select: { id: true, year: true } },
      },
      orderBy: { id: "desc" },
    });
    return NextResponse.json({ success: true, data: results });
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
    // POST: rename electionAnalysisId → analysisId
    const { analysisId, partyId, votes } = await req.json();
    const created = await db.dprdPartyResult.create({
      data: { analysisId, partyId, votes },
      include: {
        Party: true,
        analysis: { select: { id: true, year: true } },
      },
    });
    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
