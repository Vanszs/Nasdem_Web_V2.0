import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

const LEVELS = ["dpd", "dpc", "dprt", "sayap", "kader"];
const POSITIONS = ["ketua", "sekretaris", "bendahara", "wakil", "anggota"];

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, ["superadmin", "editor", "analyst"]);
  if (roleError) return roleError;

  try {
    const { searchParams } = req.nextUrl;
    const level = searchParams.get("level");
    const position = searchParams.get("position");
    const regionId = searchParams.get("regionId");
    const search = (searchParams.get("search") || "").trim();
    const skip = Math.max(parseInt(searchParams.get("skip") || "0", 10), 0);
    const take = Math.min(
      Math.max(parseInt(searchParams.get("take") || "10", 10), 1),
      200
    );

    const where: any = {};
    if (level && LEVELS.includes(level)) where.level = level;
    if (position && POSITIONS.includes(position)) where.position = position;
    if (regionId && !isNaN(parseInt(regionId)))
      where.regionId = parseInt(regionId);
    if (search) {
      where.OR = [
        { position: { contains: search, mode: "insensitive" } },
        { level: { contains: search, mode: "insensitive" } },
        { region: { name: { contains: search, mode: "insensitive" } } },
        { sayapType: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [total, rows] = await Promise.all([
      db.strukturOrganisasi.count({ where }),
      db.strukturOrganisasi.findMany({
        where,
        skip,
        take,
        orderBy: { id: "desc" },
        include: {
          region: true,
          sayapType: true,
          members: { select: { id: true, fullName: true, status: true } },
        },
      }),
    ]);

    const data = rows.map((r) => ({
      id: r.id,
      level: r.level,
      position: r.position,
      region: r.region || null,
      sayapType: r.sayapType || null,
      photoUrl: r.photoUrl,
      membersCount: r.members.length,
      members: r.members,
    }));

    return NextResponse.json({
      success: true,
      data,
      meta: {
        total,
        skip,
        take,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  try {
    const body = await req.json();
    const { level, position, sayapTypeId, regionId, photoUrl, memberIds } =
      body;

    if (!LEVELS.includes(level)) {
      return NextResponse.json(
        { success: false, error: "Level tidak valid" },
        { status: 400 }
      );
    }
    if (!POSITIONS.includes(position)) {
      return NextResponse.json(
        { success: false, error: "Posisi tidak valid" },
        { status: 400 }
      );
    }

    // Prepare connect members if provided
    let membersConnect: { id: number }[] | undefined = undefined;
    if (Array.isArray(memberIds) && memberIds.length) {
      const uniqueIds = [
        ...new Set(memberIds.filter((n: any) => Number.isInteger(n))),
      ];
      if (uniqueIds.length) {
        const valid = await db.member.findMany({
          where: { id: { in: uniqueIds } },
          select: { id: true },
        });
        membersConnect = valid.map((v) => ({ id: v.id }));
      }
    }

    const created = await db.strukturOrganisasi.create({
      data: {
        level,
        position,
        sayapTypeId: sayapTypeId || undefined,
        regionId: regionId || undefined,
        photoUrl: photoUrl || undefined,
        ...(membersConnect ? { members: { connect: membersConnect } } : {}),
      },
      include: {
        region: true,
        sayapType: true,
        members: { select: { id: true, fullName: true, status: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: { ...created, membersCount: created.members.length },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
