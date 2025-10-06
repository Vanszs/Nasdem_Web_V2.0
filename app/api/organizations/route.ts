import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { OrgLevel, PositionEnum, Prisma } from "@prisma/client";
import { pickEnumValue, toInt, toIntArray } from "@/lib/parsers";
import { UserRole } from "@/lib/rbac";

const LEVELS = Object.values(OrgLevel);
const POSITIONS = Object.values(PositionEnum);

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [
    UserRole.SUPERADMIN,
    UserRole.EDITOR,
    UserRole.ANALYST,
  ]);
  if (roleError) return roleError;

  try {
    const { searchParams } = req.nextUrl;
    const level = pickEnumValue(searchParams.get("level"), LEVELS);
    const position = pickEnumValue(searchParams.get("position"), POSITIONS);
    const regionId = toInt(searchParams.get("regionId"));
    const search = (searchParams.get("search") || "").trim();
    const skip = Math.max(parseInt(searchParams.get("skip") || "0", 10), 0);
    const take = Math.min(
      Math.max(parseInt(searchParams.get("take") || "10", 10), 1),
      200
    );

    const where: Prisma.StrukturOrganisasiWhereInput = {};
    if (level) where.level = level;
    if (position) where.position = position;
    if (regionId !== undefined) where.regionId = regionId;

    if (search) {
      const lower = search.toLowerCase();
      const levelMatches = LEVELS.filter((value) =>
        value.toLowerCase().includes(lower)
      );
      const positionMatches = POSITIONS.filter((value) =>
        value.toLowerCase().includes(lower)
      );

      const orConditions: Prisma.StrukturOrganisasiWhereInput[] = [];
      if (positionMatches.length) {
        orConditions.push({ position: { in: positionMatches } });
      }
      if (levelMatches.length) {
        orConditions.push({ level: { in: levelMatches } });
      }
      orConditions.push(
        { region: { name: { contains: search, mode: "insensitive" } } },
        { sayapType: { name: { contains: search, mode: "insensitive" } } }
      );

      // Normalize AND to an array before pushing
      const andArray: Prisma.StrukturOrganisasiWhereInput[] = Array.isArray(
        (where as any).AND
      )
        ? ([...(where as any).AND] as Prisma.StrukturOrganisasiWhereInput[])
        : (where as any).AND
        ? [(where as any).AND as Prisma.StrukturOrganisasiWhereInput]
        : [];
      andArray.push({ OR: orConditions });
      (where as any).AND = andArray;
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
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const body = await req.json();
    const level = pickEnumValue(body.level, LEVELS);
    const position = pickEnumValue(body.position, POSITIONS);
    const sayapTypeId = toInt(body.sayapTypeId);
    const regionId = toInt(body.regionId);
    const photoUrl =
      typeof body.photoUrl === "string" ? body.photoUrl : undefined;
    const memberIds = toIntArray(body.memberIds);

    if (!level) {
      return NextResponse.json(
        { success: false, error: "Level tidak valid" },
        { status: 400 }
      );
    }
    if (!position) {
      return NextResponse.json(
        { success: false, error: "Posisi tidak valid" },
        { status: 400 }
      );
    }

    // Prepare connect members if provided
    let membersConnect: { id: number }[] | undefined;
    if (memberIds.length) {
      const valid = await db.member.findMany({
        where: { id: { in: memberIds } },
        select: { id: true },
      });
      if (valid.length) {
        membersConnect = valid.map((v) => ({ id: v.id }));
      }
    }

    const created = await db.strukturOrganisasi.create({
      data: {
        level,
        position,
        sayapTypeId: sayapTypeId ?? undefined,
        regionId: regionId ?? undefined,
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
