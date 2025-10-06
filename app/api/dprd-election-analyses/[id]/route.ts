import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toDecimalString, toInt } from "@/lib/parsers";
import { UserRole } from "@/lib/rbac";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysis = await db.dprdElectionAnalysis.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        dapil: true,
        kecamatan: true,
        desa: true,
        tps: true,
        partyResults: { include: { party: true } },
        calegResults: { include: { caleg: { include: { party: true } } } },
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
  const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.ANALYST]);
  if (roleError) return roleError;
  try {
    const body = await req.json();
    const year = toInt(body.year);
    if (year === undefined) {
      return NextResponse.json(
        { success: false, error: "Tahun harus berupa angka" },
        { status: 400 }
      );
    }

    const updated = await db.dprdElectionAnalysis.update({
      where: { id: parseInt(params.id) },
      data: {
        year,
        dapilId: toInt(body.dapilId) ?? undefined,
        kecamatanId: toInt(body.kecamatanId) ?? undefined,
        desaId: toInt(body.desaId) ?? undefined,
        tpsId: toInt(body.tpsId) ?? undefined,
        totalValidVotes: toInt(body.totalValidVotes) ?? undefined,
        invalidVotes: toInt(body.invalidVotes) ?? undefined,
        dpt: toInt(body.dpt) ?? undefined,
        dptb: toInt(body.dptb) ?? undefined,
        dpk: toInt(body.dpk) ?? undefined,
        totalVotes: toInt(body.totalVotes) ?? undefined,
        turnoutPercent: toDecimalString(body.turnoutPercent) ?? undefined,
        notes: typeof body.notes === "string" ? body.notes : undefined,
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
  const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.ANALYST]);
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
