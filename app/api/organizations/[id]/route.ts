import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

const LEVELS = ["dpd", "dpc", "dprt", "sayap", "kader"];
const POSITIONS = ["ketua", "sekretaris", "bendahara", "wakil", "anggota"];

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, ["superadmin", "editor", "analyst"]);
  if (roleError) return roleError;

  try {
    const includeParam = req.nextUrl.searchParams.get("include") || "";
    const flags = new Set(
      includeParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
    const includeMembers = flags.has("members");
    const includeMembersCount = flags.has("membersCount");
    const struktur = await db.strukturOrganisasi.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        sayapType: true,
        region: true,
        members:
          includeMembers || includeMembersCount
            ? { select: { id: true, fullName: true, status: true } }
            : false,
      },
    });
    if (!struktur)
      return NextResponse.json(
        { success: false, error: "Struktur not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      data: {
        id: struktur.id,
        level: struktur.level,
        position: struktur.position,
        region: struktur.region,
        sayapType: struktur.sayapType,
        photoUrl: struktur.photoUrl,
        membersCount: includeMembersCount ? struktur.members.length : undefined,
        members: includeMembers ? struktur.members : undefined,
      },
    });
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
  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;
  try {
    const { level, position, sayapTypeId, regionId, photoUrl } =
      await req.json();

    if (level && !LEVELS.includes(level)) {
      return NextResponse.json(
        { success: false, error: "Level tidak valid" },
        { status: 400 }
      );
    }
    if (position && !POSITIONS.includes(position)) {
      return NextResponse.json(
        { success: false, error: "Posisi tidak valid" },
        { status: 400 }
      );
    }

    const updated = await db.strukturOrganisasi.update({
      where: { id: parseInt(params.id) },
      data: {
        level: level || undefined,
        position: position || undefined,
        sayapTypeId: sayapTypeId !== undefined ? sayapTypeId : undefined,
        regionId: regionId !== undefined ? regionId : undefined,
        photoUrl: photoUrl || undefined,
      },
      include: { sayapType: true, region: true },
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
  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;
  try {
    await db.strukturOrganisasi.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "Struktur deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
