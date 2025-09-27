import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET() {
  try {
    const analyses = await db.dprdElectionAnalysis.findMany({
      include: {
        Dapil: true,
        Kecamatan: true,
        Desa: true,
        Tps: true,
        DprdPartyResult: { include: { Party: true } },
        DprdCalegResult: { include: { Caleg: { include: { Party: true } } } },
      },
      orderBy: { year: "desc" },
    });
    return NextResponse.json({ success: true, data: analyses });
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
    const created = await db.dprdElectionAnalysis.create({
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
      },
      include: {
        Dapil: true,
        Kecamatan: true,
        Desa: true,
        Tps: true,
        DprdPartyResult: true,
        DprdCalegResult: true,
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
