import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";
import { BenefitStatus, Prisma } from "@prisma/client";

const listAssignmentsSchema = z.object({
  memberId: z.coerce.number().int().optional(),
  benefitId: z.coerce.number().int().optional(),
  status: z.nativeEnum(BenefitStatus).optional(),
});

const assignBenefitSchema = z.object({
  memberId: z.number().int().min(1),
  benefitId: z.number().int().min(1),
  status: z.nativeEnum(BenefitStatus).optional(),
  grantedAt: z.string().optional(),
  notes: z.string().optional(),
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
    const parsedResult = listAssignmentsSchema.safeParse(rawParams);

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
    const andConditions: any[] = [];

    if (parsed.memberId) {
      andConditions.push({ memberId: parsed.memberId });
    }

    if (parsed.benefitId) {
      andConditions.push({ benefitId: parsed.benefitId });
    }

    if (parsed.status) {
      andConditions.push({ status: parsed.status });
    }

    const assignments = await db.memberBenefit.findMany({
      where: andConditions.length ? { AND: andConditions } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        memberId: true,
        benefitId: true,
        status: true,
        grantedAt: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        member: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        benefit: {
          select: {
            id: true,
            title: true,
            category: true,
            description: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: assignments });
  } catch (err: any) {
    console.error("Error fetching member benefits:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch member benefits" },
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
    const parsed = assignBenefitSchema.safeParse(body);

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

    try {
      const assignment = await db.memberBenefit.create({
        data: {
          memberId: data.memberId,
          benefitId: data.benefitId,
          status: data.status ?? undefined,
          grantedAt: data.grantedAt ? new Date(data.grantedAt) : undefined,
          notes: data.notes || undefined,
        },
        select: {
          id: true,
          memberId: true,
          benefitId: true,
          status: true,
          grantedAt: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
          member: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              status: true,
            },
          },
          benefit: {
            select: {
              id: true,
              title: true,
              category: true,
              description: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      return NextResponse.json({ success: true, data: assignment }, { status: 201 });
    } catch (err: any) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Benefit already assigned to this member",
          },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (err: any) {
    console.error("Error assigning benefit:", err);
    return NextResponse.json(
      { success: false, error: "Failed to assign benefit" },
      { status: 500 }
    );
  }
}
