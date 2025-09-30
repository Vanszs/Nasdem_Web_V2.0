import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

const LEVELS = ["dpd", "dpc", "dprt", "sayap", "kader"];
const POSITIONS = ["ketua", "sekretaris", "bendahara", "wakil", "anggota"];

function parseInclude(param: string | null) {
  const flags = new Set(
    (param || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
  return {
    region: flags.has("region"),
    sayapType: flags.has("sayapType"),
    membersCount: flags.has("membersCount"),
    members: flags.has("members"),
  };
}

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, ["superadmin", "editor", "analyst"]);
  if (roleError) return roleError;

  try {
    const { searchParams } = req.nextUrl;
    const includeFlags = parseInclude(searchParams.get("include"));
    const level = searchParams.get("level");
    const position = searchParams.get("position");
    const search = (searchParams.get("search") || "").trim();
    const skip = Math.max(parseInt(searchParams.get("skip") || "0", 10), 0);
    const take = Math.min(
      Math.max(parseInt(searchParams.get("take") || "50", 10), 1),
      200
    );

    const where: any = {};
    if (level && LEVELS.includes(level)) where.level = level;
    if (position && POSITIONS.includes(position)) where.position = position;
    if (search) {
      where.OR = [
        { position: { contains: search, mode: "insensitive" } },
        { level: { contains: search, mode: "insensitive" } },
        { Region: { name: { contains: search, mode: "insensitive" } } },
        { SayapType: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [total, rows] = await Promise.all([
      db.strukturOrganisasi.count({ where }),
      db.strukturOrganisasi.findMany({
        where,
        skip,
        take,
        orderBy: { startDate: "desc" },
        include: {
          Region: includeFlags.region,
          SayapType: includeFlags.sayapType,
          ...(includeFlags.members
            ? { Member: { select: { id: true, fullName: true, status: true } } }
            : { Member: false }),
        },
      }),
    ]);

    const data = rows.map((r) => ({
      id: r.id,
      level: r.level,
      position: r.position,
      region: r.Region || null,
      sayapType: r.SayapType || null,
      startDate: r.startDate,
      endDate: r.endDate,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      membersCount: includeFlags.membersCount ? r.Member.length : undefined,
      ...(includeFlags.members ? { members: r.Member } : {}),
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
    const {
      level,
      position,
      sayapTypeId,
      regionId,
      photoUrl,
      startDate,
      endDate,
    } = body;

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

    const created = await db.strukturOrganisasi.create({
      data: {
        level,
        position,
        sayapTypeId: sayapTypeId || undefined,
        regionId: regionId || undefined,
        photoUrl: photoUrl || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: {
        Region: true,
        SayapType: true,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
