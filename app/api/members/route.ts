import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { memberSchemas, extractQueryParams, validateRequest } from "@/lib/validation";
import { UserRole } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN, UserRole.ANALYST]);
  if (roleError) return roleError;

  try {
    // Extract and validate query parameters
    const query = extractQueryParams(memberSchemas.list, req.nextUrl.searchParams);
    
    const where: any = {};
    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
        { phone: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.gender) where.gender = query.gender;

    // Relational (optional)
    const strukturFilter: any = {};
    if (query.level) strukturFilter.level = query.level;
    if (query.position) strukturFilter.position = query.position;
    if (query.sayapTypeId) strukturFilter.sayapTypeId = query.sayapTypeId;
    if (query.regionId) strukturFilter.regionId = query.regionId;
    if (Object.keys(strukturFilter).length) {
      where.struktur = { is: strukturFilter };
    }

    const [total, data] = await Promise.all([
      db.member.count({ where }),
      db.member.findMany({
        where,
        take: query.pageSize!,
        skip: (query.page! - 1) * query.pageSize!,
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
          struktur: query.struktur
            ? {
                select: {
                  id: true,
                  level: true,
                  position: true,
                  sayapTypeId: true,
                  regionId: true,
                  sayapType: { select: { id: true, name: true } },
                  region: { select: { id: true, name: true, type: true } },
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
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / (query.pageSize || 20)),
      },
    });
  } catch (err: any) {
    console.error("Error fetching members:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch members" },
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
    
    // Validate input
    const validation = validateRequest(memberSchemas.create, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.details },
        { status: 400 }
      );
    }
    
    const data = validation.data;

    // Check for duplicate email if provided
    if (data.email) {
      const existingMember = await db.member.findFirst({
        where: { email: data.email }
      });
      
      if (existingMember) {
        return NextResponse.json(
          { success: false, error: "Member with this email already exists" },
          { status: 409 }
        );
      }
    }

    const member = await db.member.create({
      data: {
        fullName: data.fullName,
        email: data.email || undefined,
        phone: data.phone || undefined,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        address: data.address || undefined,
        bio: data.bio || undefined,
        gender: data.gender,
        status: data.status,
        strukturId: data.strukturId || undefined,
        photoUrl: data.photoUrl || undefined,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
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
    console.error("Error creating member:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create member" },
      { status: 500 }
    );
  }
}
