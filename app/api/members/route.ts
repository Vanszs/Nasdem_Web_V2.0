import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const url = req.nextUrl;
    const page = Math.max(parseInt(url.searchParams.get("page") || "1"), 1);
    const pageSize = Math.min(
      Math.max(parseInt(url.searchParams.get("pageSize") || "20"), 1),
      100
    );

    const search = url.searchParams.get("search")?.trim() || "";
    const status = url.searchParams.get("status") || "";
    const gender = url.searchParams.get("gender") || "";
    const level = url.searchParams.get("level") || ""; // OrgLevel
    const position = url.searchParams.get("position") || ""; // PositionEnum
    const sayapTypeId = url.searchParams.get("sayapTypeId") || "";
    const regionId = url.searchParams.get("regionId") || "";
    const includeStruktur = url.searchParams.get("struktur") === "1";

    const where: any = {};
    if (search) {
      // gunakan OR jika ingin multi kolom
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (gender) where.gender = gender;

    // Relational (optional)
    const strukturFilter: any = {};
    if (level) strukturFilter.level = level;
    if (position) strukturFilter.position = position;
    if (sayapTypeId) strukturFilter.sayapTypeId = parseInt(sayapTypeId);
    if (regionId) strukturFilter.regionId = parseInt(regionId);
    if (Object.keys(strukturFilter).length) {
      where.StrukturOrganisasi = { is: strukturFilter };
    }

    const [total, data] = await Promise.all([
      db.member.count({ where }),
      db.member.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: { joinDate: "desc" },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          address: true,
          status: true,
          joinDate: true,
          photoUrl: true,
          bio: true,
          gender: true,
          dateOfBirth: true,
          StrukturOrganisasi: includeStruktur
            ? {
                select: {
                  id: true,
                  level: true,
                  position: true,
                  sayapTypeId: true,
                  regionId: true,
                  SayapType: { select: { id: true, name: true } },
                  Region: { select: { id: true, name: true, type: true } },
                },
              }
            : false,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
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
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      address,
      bio,
      gender,
      status,
      strukturId,
      photoUrl,
      joinDate,
      endDate,
    } = await req.json();

    // Normalisasi untuk enum (schema: lowercase)
    const normStatus = (status || "active").toLowerCase();
    const normGender = gender ? gender.toLowerCase() : undefined;

    const member = await db.member.create({
      data: {
        fullName,
        email: email || undefined,
        phone: phone || undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address: address || undefined,
        bio: bio || undefined,
        gender: normGender,
        status: normStatus,
        strukturId: strukturId || undefined,
        photoUrl: photoUrl || undefined,
        joinDate: joinDate ? new Date(joinDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        status: true,
        gender: true,
        strukturId: true,
        photoUrl: true,
        joinDate: true,
      },
    });

    return NextResponse.json({ success: true, data: member });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Create failed" },
      { status: 500 }
    );
  }
}
