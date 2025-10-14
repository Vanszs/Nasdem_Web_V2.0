import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";

// ---------------------------
// GET: Detail Program
// ---------------------------
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const program = await db.program.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!program) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: program });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// ---------------------------
// PUT: Update Program
// ---------------------------
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const body = await req.json();

    const {
      category,
      name,
      description,
      target,
      currentTarget,
      budget,
      status,
      startDate,
      endDate,
      photoUrl,
      coordinatorId,
    } = body;

    const updated = await db.program.update({
      where: { id: parseInt(params.id) },
      data: {
        category,
        name,
        description: description || undefined,
        target: typeof target === "number" ? target : undefined,
        currentTarget:
          typeof currentTarget === "number" ? currentTarget : undefined,
        budget: typeof budget === "number" ? budget : undefined,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        photoUrl: typeof photoUrl === "string" ? photoUrl : undefined,
        coordinatorId:
          typeof coordinatorId === "number" ? coordinatorId : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// ---------------------------
// DELETE: Hapus Program
// ---------------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    await db.program.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
