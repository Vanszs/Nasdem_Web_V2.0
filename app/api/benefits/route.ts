import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";
import { BenefitStatus } from "@prisma/client";

const listBenefitsSchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  status: z.nativeEnum(BenefitStatus).optional(),
  withRecipients: z.coerce.boolean().optional(),
});

const createBenefitSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
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
    const rawEntries = Array.from(req.nextUrl.searchParams.entries()).filter(
      ([, value]) => value !== ""
    );
    const rawParams = Object.fromEntries(rawEntries);
    const parsedResult = listBenefitsSchema.safeParse(rawParams);

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
    const conditions: any[] = [{ deletedAt: null }];

    if (parsed.search) {
      conditions.push({
        OR: [
          { title: { contains: parsed.search, mode: "insensitive" } },
          { description: { contains: parsed.search, mode: "insensitive" } },
        ],
      });
    }

    if (parsed.category) {
      conditions.push({ category: { equals: parsed.category, mode: "insensitive" } });
    }

    if (parsed.status) {
      conditions.push({ assignments: { some: { status: parsed.status } } });
    }

    const includeRecipients = parsed.withRecipients === true;

    const benefits = await db.benefit.findMany({
      where: conditions.length ? { AND: conditions } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { assignments: true } },
        assignments: includeRecipients
          ? {
              select: {
                id: true,
                memberId: true,
                benefitId: true,
                status: true,
                grantedAt: true,
                notes: true,
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
            }
          : false,
      },
    });

    return NextResponse.json({ success: true, data: benefits });
  } catch (err: any) {
    console.error("Error fetching benefits:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch benefits" },
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
    const parsed = createBenefitSchema.safeParse(body);

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

    const benefit = await db.benefit.create({
      data: {
        title: data.title,
        description: data.description || undefined,
        category: data.category || undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: benefit }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating benefit:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create benefit" },
      { status: 500 }
    );
  }
}
