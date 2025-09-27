import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysis = await db.dprdElectionAnalysis.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        Dapil: true,
        Kecamatan: true,
        Desa: true,
        Tps: true,
        DprdPartyResult: { include: { Party: true } },
        DprdCalegResult: { include: { Caleg: { include: { Party: true } } } },
      },
    });
    if (!analysis)
      return NextResponse.json(
        { success: false, error: "Analysis not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: analysis });
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
    const {
      year,
      dapilId,
      kecamatanId,
      desaId,
      tpsId,
      totalValidVotes,
      invalidVotes,
      dpt,
      dptb,
      dpk,
      totalVotes,
      turnoutPercent,
      notes,
    } = await req.json();
    const updated = await db.dprdElectionAnalysis.update({
      where: { id: parseInt(params.id) },
      data: {
        year,
        dapilId,
        kecamatanId,
        desaId,
        tpsId,
        totalValidVotes,
        invalidVotes,
        dpt,
        dptb,
        dpk,
        totalVotes,
        turnoutPercent,
        notes,
        updatedAt: new Date(),
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
    await db.dprdElectionAnalysis.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ success: true, message: "Analysis deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
