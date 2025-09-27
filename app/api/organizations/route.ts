import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

// list semua struktur organisasi
export async function GET() {
  try {
    const strukturList = await db.strukturOrganisasi.findMany({
      include: {
        SayapType: true,
        Region: true,
        Member: true,
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json({ success: true, data: strukturList });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// create struktur baru
export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  try {
    const {
      level,
      position,
      sayapTypeId,
      regionId,
      photoUrl,
      startDate,
      endDate,
    } = await req.json();

    const struktur = await db.strukturOrganisasi.create({
      data: {
        level,
        position,
        sayapTypeId,
        regionId,
        photoUrl,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: {
        SayapType: true,
        Region: true,
        Member: true,
      },
    });

    return NextResponse.json({ success: true, data: struktur });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
