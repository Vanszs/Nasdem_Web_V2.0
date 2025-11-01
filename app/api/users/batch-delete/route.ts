import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";

/**
 * POST /api/users/batch-delete
 * Batch delete multiple users
 */
export async function POST(req: NextRequest) {
  // 1. Authentication check
  const authError = requireAuth(req);
  if (authError) return authError;

  // 2. Role authorization - only superadmin can delete users
  const roleError = requireRole(req, [UserRole.SUPERADMIN]);
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

    // Get current user to prevent self-deletion
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode token to get current user ID (basic implementation)
    // You might want to use a proper JWT library here
    const currentUserId = (req as any).userId; // Assuming middleware sets this

    // Remove current user from deletion list
    const idsToDelete = ids.filter((id) => id !== currentUserId);

    if (idsToDelete.length === 0) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Soft delete using deletedAt field
    const result = await db.user.updateMany({
      where: {
        id: { in: idsToDelete },
        deletedAt: null, // Only delete users that aren't already deleted
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} users`,
      deletedCount: result.count,
      skipped: ids.length - idsToDelete.length,
    });
  } catch (error) {
    console.error("Batch delete users error:", error);
    return NextResponse.json(
      { error: "Failed to delete users" },
      { status: 500 }
    );
  }
}
