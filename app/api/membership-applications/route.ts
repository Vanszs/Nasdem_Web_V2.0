import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";
import { ApplicationType, ApplicationStatus, GenderEnum } from "@prisma/client";
import { uploadFile } from "@/lib/file-upload";

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
  const authError = await requireAuth(req);
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

    const [
      total,
      data,
      pendingCount,
      reviewedCount,
      approvedCount,
      rejectedCount,
    ] = await Promise.all([
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
          nik: true,
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
          isBeneficiary: true,
          beneficiaryProgramId: true,
          ktpPhotoUrl: true,
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
      db.membershipApplication.count({
        where: { ...(where as any), status: ApplicationStatus.pending },
      }),
      db.membershipApplication.count({
        where: { ...(where as any), status: ApplicationStatus.reviewed },
      }),
      db.membershipApplication.count({
        where: { ...(where as any), status: ApplicationStatus.approved },
      }),
      db.membershipApplication.count({
        where: { ...(where as any), status: ApplicationStatus.rejected },
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
      summary: {
        total,
        pending: pendingCount,
        reviewed: reviewedCount,
        approved: approvedCount,
        rejected: rejectedCount,
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
    const contentType = req.headers.get("content-type") || "";
    let data: any;
    let ktpPhotoUrl: string | undefined;

    // Handle both JSON and FormData
    if (contentType.includes("multipart/form-data")) {
      // FormData with file upload
      const formData = await req.formData();

      // Extract file if exists
      const ktpFile = formData.get("ktpPhoto") as File | null;
      if (ktpFile && ktpFile.size > 0) {
        const uploadResult = await uploadFile(ktpFile, "ktp");
        if (!uploadResult.success) {
          return NextResponse.json(
            {
              success: false,
              error: uploadResult.error || "File upload failed",
            },
            { status: 400 }
          );
        }
        ktpPhotoUrl = uploadResult.url;
      }

      // Extract form fields
      data = {
        fullName: formData.get("fullName") as string,
        nik: formData.get("nik") as string | null,
        email: formData.get("email") as string | null,
        phone: formData.get("phone") as string | null,
        address: formData.get("address") as string | null,
        dateOfBirth: formData.get("dateOfBirth") as string | null,
        gender: formData.get("gender") as string | null,
        occupation: formData.get("occupation") as string | null,
        motivation: formData.get("motivation") as string | null,
        applicationType:
          (formData.get("applicationType") as string) || "REGULAR",
        isBeneficiary: formData.get("isBeneficiary") === "true",
        beneficiaryProgramId: formData.get("beneficiaryProgramId")
          ? parseInt(formData.get("beneficiaryProgramId") as string)
          : undefined,
      };
    } else {
      // JSON body (backward compatibility)
      data = await req.json();
    }

    // Validate data
    const parsed = createApplicationSchema.safeParse(data);

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

    const validData = parsed.data;

    const application = await db.membershipApplication.create({
      data: {
        fullName: validData.fullName,
        nik: validData.nik || undefined,
        email: validData.email || undefined,
        phone: validData.phone || undefined,
        address: validData.address || undefined,
        dateOfBirth: validData.dateOfBirth
          ? new Date(validData.dateOfBirth)
          : undefined,
        gender: validData.gender ?? undefined,
        occupation: validData.occupation || undefined,
        motivation: validData.motivation || undefined,
        ktpPhotoUrl: ktpPhotoUrl || undefined,
        applicationType: validData.applicationType,
        isBeneficiary: validData.isBeneficiary ?? false,
        beneficiaryProgramId: validData.beneficiaryProgramId || undefined,
      },
      select: {
        id: true,
        fullName: true,
        nik: true,
        email: true,
        phone: true,
        ktpPhotoUrl: true,
        applicationType: true,
        status: true,
        submittedAt: true,
        isBeneficiary: true,
        beneficiaryProgramId: true,
      },
    });

    return NextResponse.json(
      { success: true, data: application },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating membership application:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create membership application" },
      { status: 500 }
    );
  }
}
