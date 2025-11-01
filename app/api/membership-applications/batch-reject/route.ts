import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";

/**
 * POST /api/membership-applications/batch-reject
 * Batch reject multiple membership applications
 */
export async function POST(req: NextRequest) {
  // 1. Authentication check
  const authError = requireAuth(req);
  if (authError) return authError;

  // 2. Role authorization - only superadmin and editor can reject
  const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.EDITOR]);
  if (roleError) return roleError;

  try {
    const body = await req.json();
    const { ids } = body;

    // Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "IDs array is required and cannot be empty" },
        { status: 400 }
      );
    }

    // Validate all IDs are numbers
    if (!ids.every((id) => typeof id === "number" && id > 0)) {
      return NextResponse.json(
        { error: "All IDs must be positive numbers" },
        { status: 400 }
      );
    }

    // Update status to rejected
    const result = await db.membershipApplication.updateMany({
      where: {
        id: { in: ids },
        status: "pending", // Only reject pending applications
      },
      data: {
        status: "rejected",
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully rejected ${result.count} applications`,
      rejectedCount: result.count,
    });
  } catch (error) {
    console.error("Batch reject applications error:", error);
    return NextResponse.json(
      { error: "Failed to reject applications" },
      { status: 500 }
    );
  }
}
