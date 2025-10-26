import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  status: z.enum(["pending", "completed", "ongoing", "planning"]).optional(),
});

// list semua program
export async function GET(req: NextRequest) {
  try {
    const raw = Object.fromEntries(new URL(req.url).searchParams.entries());
    const parsed = listQuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }
    const {
      page = 1,
      pageSize = 20,
      q,
      category,
      status = "ongoing",
    } = parsed.data;

    const AND: any[] = [];
    // only show ongoing by default
    if (status) AND.push({ status });
    if (q) {
      AND.push({
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      });
    }
    if (category) {
      AND.push({ category: { equals: category, mode: "insensitive" as any } });
    }

    const where = AND.length ? { AND } : undefined;

    const [total, programs] = await Promise.all([
      db.program.count({ where } as any),
      db.program.findMany({
        where: where as any,
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          coordinator: {
            select: { id: true, fullName: true, photoUrl: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: programs,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// create program baru
export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const body = await req.json();
    const {
      category, // string
      name,
      description,
      target,
      currentTarget,
      budget,
      status, // pending | completed | ongoing | planning
      startDate,
      endDate,
      photoUrl,
      coordinatorId,
    } = body;

    const program = await db.program.create({
      data: {
        name,
        description,
        target: typeof target === "number" ? target : 0,
        currentTarget: typeof currentTarget === "number" ? currentTarget : 0,
        budget,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        category,
        photoUrl,
        coordinatorId,
      },
    });

    return NextResponse.json({ success: true, data: program });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
