import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";
import {
  ApplicationType,
  ApplicationStatus,
  GenderEnum,
} from "@prisma/client";

const listApplicationsSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
  search: z.string().trim().optional(),
  status: z.nativeEnum(ApplicationStatus).optional(),
  type: z.nativeEnum(ApplicationType).optional(),
});

const createApplicationSchema = z.object({
  fullName: z.string().min(1),
  nik: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.nativeEnum(GenderEnum).optional(),
  occupation: z.string().optional(),
  motivation: z.string().optional(),
  applicationType: z.nativeEnum(ApplicationType),
  isBeneficiary: z.boolean().optional(),
  beneficiaryProgramId: z.number().int().positive().optional(),
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
    const rawEntries = Array.from(req.nextUrl.searchParams.entries()).filter(
      ([, value]) => value !== ""
    );
    const rawParams = Object.fromEntries(rawEntries);
    const parsedResult = listApplicationsSchema.safeParse(rawParams);

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
    const pageSize = parsed.pageSize ?? 20;
    const page = parsed.page ?? 1;

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

    if (parsed.status) {
      andConditions.push({ status: parsed.status });
    }

    if (parsed.type) {
      andConditions.push({ applicationType: parsed.type });
    }

    const where = andConditions.length ? { AND: andConditions } : {};

    const [total, data] = await Promise.all([
      db.membershipApplication.count({ where }),
      db.membershipApplication.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: { submittedAt: "desc" },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          address: true,
          dateOfBirth: true,
          gender: true,
          occupation: true,
          motivation: true,
          applicationType: true,
          status: true,
          submittedAt: true,
          reviewedAt: true,
          notes: true,
          memberId: true,
          member: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              status: true,
            },
          },
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
    console.error("Error fetching membership applications:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch membership applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createApplicationSchema.safeParse(body);

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

    const application = await db.membershipApplication.create({
      data: {
        fullName: data.fullName,
        nik: data.nik || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender ?? undefined,
        occupation: data.occupation || undefined,
        motivation: data.motivation || undefined,
        applicationType: data.applicationType,
        isBeneficiary: data.isBeneficiary ?? false,
        beneficiaryProgramId: data.beneficiaryProgramId || undefined,
      },
      select: {
        id: true,
        fullName: true,
        nik: true,
        email: true,
        phone: true,
        applicationType: true,
        status: true,
        submittedAt: true,
        isBeneficiary: true,
        beneficiaryProgramId: true,
      },
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating membership application:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create membership application" },
      { status: 500 }
    );
  }
}
