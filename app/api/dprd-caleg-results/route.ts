import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toInt } from "@/lib/parsers";
import { UserRole } from "@/lib/rbac";

export async function GET() {
  try {
    const results = await db.dprdCalegResult.findMany({
      include: {
        caleg: { include: { party: true } },
        electionAnalysis: { select: { id: true, year: true } },
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
  const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.ANALYST]);
  if (roleError) return roleError;
  try {
    const body = await req.json();
    const electionAnalysisId = toInt(body.electionAnalysisId);
    const calegId = toInt(body.calegId);
    if (electionAnalysisId === undefined || calegId === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "electionAnalysisId dan calegId harus berupa angka",
        },
        { status: 400 }
      );
    }
    const votes = toInt(body.votes) ?? undefined;
    const created = await db.dprdCalegResult.create({
      data: { electionAnalysisId, calegId, votes },
      include: {
        caleg: { include: { party: true } },
        electionAnalysis: { select: { id: true, year: true } },
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
