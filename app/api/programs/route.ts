import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toInt } from "@/lib/parsers";
import { UserRole } from "@/lib/rbac";

// list semua program
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || null;

    // Query ke database
    const programs = await db.program.findMany({
      where: q
        ? {
            OR: [
              {
                name: {
                  contains: q,
                  mode: "insensitive",
                },
              },
              {
                category: {
                  contains: q,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: q,
                  mode: "insensitive",
                },
              },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        coordinator: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: programs });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// create program baru
export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
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
