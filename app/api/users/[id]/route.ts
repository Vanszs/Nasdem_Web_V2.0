import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { userSchemas, validateRequest } from "@/lib/validation";
import { SoftDeleteHelper } from "@/lib/soft-delete";
import { UserRole } from "@/lib/rbac";

// Helper function to validate ID
function validateId(id: string): number {
  const numId = parseInt(id);
  if (isNaN(numId) || numId <= 0) {
    throw new Error("Invalid ID format");
  }
  return numId;
}

// detail user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const userId = validateId(params.id);
    
    const user = await SoftDeleteHelper.findUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (err: any) {
    console.error("Error fetching user:", err);
    if (err.message === "Invalid ID format") {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// update user
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const userId = validateId(params.id);
    const body = await req.json();
    
    // Validate input
    const validation = validateRequest(userSchemas.update, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.details },
        { status: 400 }
      );
    }
    
    const data = validation.data;

    // Check if user exists
    const existingUser = await SoftDeleteHelper.findUserById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check for duplicate email/username if they're being changed
    if (data.email || data.username) {
      const duplicateUser = await db.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            {
              OR: [
                ...(data.email ? [{ email: data.email }] : []),
                ...(data.username ? [{ username: data.username }] : [])
              ]
            }
          ]
        }
      });

      if (duplicateUser) {
        return NextResponse.json(
          { success: false, error: "Email or username already exists" },
          { status: 409 }
        );
      }
    }

    const updateData: any = {};
    if (data.username) updateData.username = data.username;
    if (data.email) updateData.email = data.email;
    if (data.role) updateData.role = data.role;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 12); // Increased salt rounds

    const updated = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("Error updating user:", err);
    if (err.message === "Invalid ID format") {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// hapus user (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const userId = validateId(params.id);
    
    // Prevent self-deletion
    const currentUser = (req as any).user;
    if (currentUser.userId === userId) {
      return NextResponse.json(
        { success: false, error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await SoftDeleteHelper.findUserById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Soft delete the user
    await SoftDeleteHelper.softDeleteUser(userId);
    
    return NextResponse.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (err: any) {
    console.error("Error deleting user:", err);
    if (err.message === "Invalid ID format") {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
