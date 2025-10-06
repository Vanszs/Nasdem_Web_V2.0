import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { toInt } from "@/lib/parsers";

// list semua program
export async function GET() {
  try {
    const programs = await db.program.findMany({
      include: {
        category: true,
        user: { select: { id: true, username: true, email: true } },
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

  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  try {
    const userId = (req as any).user.userId;
    const body = await req.json();
    const categoryId = toInt(body.categoryId);
    const { title, description, startDate, endDate } = body;
    const photoUrl = typeof body.photoUrl === "string" ? body.photoUrl : undefined;

    const program = await db.program.create({
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        categoryId: categoryId ?? undefined,
        photoUrl,
        userId,
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
