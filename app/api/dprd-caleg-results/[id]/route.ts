import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await db.dprdCalegResult.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        caleg: { include: { party: true } },
        electionAnalysis: { select: { id: true, year: true } },
      },
    });
    if (!result)
      return NextResponse.json(
        { success: false, error: "Result not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: result });
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
    // PUT
    const { electionAnalysisId, calegId, votes } = await req.json();
    const updated = await db.dprdCalegResult.update({
      where: { id: parseInt(params.id) },
      data: { electionAnalysisId, calegId, votes },
      include: {
        caleg: { include: { party: true } },
        electionAnalysis: { select: { id: true, year: true } },
      },
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
    await db.dprdCalegResult.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "Result deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
