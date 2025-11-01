import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";

/**
 * POST /api/news/batch-delete
 * Batch delete multiple news items
 */
export async function POST(req: NextRequest) {
  // 1. Authentication check
  const authError = requireAuth(req);
  if (authError) return authError;

  // 2. Role authorization - only superadmin and editor can delete
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

    // Soft delete using deletedAt field
    const result = await db.news.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null, // Only delete items that aren't already deleted
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} news items`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Batch delete news error:", error);
    return NextResponse.json(
      { error: "Failed to delete news items" },
      { status: 500 }
    );
  }
}
