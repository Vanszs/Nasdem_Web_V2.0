import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";

// List query schema defined inline
// Supports both page/pageSize and take/skip (from some tables)
const listQuerySchema = z.object({
  // primary pagination
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
  // alt pagination used by some UIs
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).optional(),
  // filters
  search: z.string().trim().optional(),
  name: z.string().trim().optional(),
  email: z.string().trim().optional(),
  address: z.string().trim().optional(),
  status: z.string().optional(),
  gender: z.string().optional(),
  struktur: z.coerce.boolean().optional().default(false),
  level: z.string().optional(),
  position: z.string().optional(),
  sayapTypeId: z.coerce.number().optional(),
  regionId: z.coerce.number().optional(),
  unassigned: z.coerce.boolean().optional().default(false),
});

// Create body schema defined inline
const createMemberSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  gender: z.string().optional(),
  status: z.string().optional(),
  strukturId: z.number().optional(),
  photoUrl: z.string().url().optional(),
  joinDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [
    UserRole.EDITOR,
    UserRole.SUPERADMIN,
    UserRole.ANALYST,
  ]);
  if (roleError) return roleError;

  try {
    // Extract and validate query parameters
    // 1) Remove empty string values to avoid coercion errors
    const rawEntries = Array.from(req.nextUrl.searchParams.entries()).filter(
      ([, v]) => v !== ""
    );
    const rawParams = Object.fromEntries(rawEntries);
    // 2) Parse with Zod and support both page/pageSize and take/skip
    const parsedResult = listQuerySchema.safeParse(rawParams);
    if (!parsedResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: parsedResult.error.flatten(),
        },
        { status: 400 }
      );
    }
    const parsed = parsedResult.data;
    const pageSize = parsed.pageSize ?? parsed.take ?? 20;
    const page =
      parsed.page ??
      (parsed.skip !== undefined ? Math.floor(parsed.skip / pageSize) + 1 : 1);

    const andConditions: any[] = [];

    if (parsed.search) {
      andConditions.push({
        OR: [
          { fullName: { contains: parsed.search, mode: "insensitive" } },
          { email: { contains: parsed.search, mode: "insensitive" } },
          { phone: { contains: parsed.search, mode: "insensitive" } },
        ],
      });
    }

    if (parsed.name) {
      andConditions.push({
        fullName: { contains: parsed.name, mode: "insensitive" },
      });
    }

    if (parsed.email) {
      andConditions.push({
        email: { contains: parsed.email, mode: "insensitive" },
      });
    }

    if (parsed.address) {
      andConditions.push({
        address: { contains: parsed.address, mode: "insensitive" },
      });
    }

    if (parsed.status) {
      andConditions.push({ status: parsed.status });
    }

    if (parsed.gender) {
      andConditions.push({ gender: parsed.gender });
    }

    // Relational (optional)
    const strukturFilter: any = {};
    if (parsed.level) strukturFilter.level = parsed.level;
    if (parsed.position) strukturFilter.position = parsed.position;
    if (parsed.sayapTypeId) strukturFilter.sayapTypeId = parsed.sayapTypeId;
    if (parsed.regionId) strukturFilter.regionId = parsed.regionId;
    if (parsed.unassigned) {
      // Only members without any struktur
      andConditions.push({ strukturId: null });
    } else if (Object.keys(strukturFilter).length) {
      andConditions.push({ struktur: { is: strukturFilter } });
    }

    const where = andConditions.length ? { AND: andConditions } : {};

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
          struktur: parsed.struktur
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
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
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
    const parsed = createMemberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // Check for duplicate email if provided
    if (data.email) {
      const existingMember = await db.member.findFirst({
        where: { email: data.email },
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
        gender: (data.gender as any) ?? undefined,
        status: (data.status as any) ?? undefined,
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
