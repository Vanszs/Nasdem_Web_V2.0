import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { SoftDeleteHelper } from "@/lib/soft-delete";
import { memberSchemas, validateRequest } from "@/lib/validation";
import { UserRole } from "@/lib/rbac";

// Helper function to validate ID
function validateId(id: string): number {
  const numId = parseInt(id);
  if (isNaN(numId) || numId <= 0) {
    throw new Error("Invalid ID format");
  }
  return numId;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Add authentication check - was missing before!
  const authError = requireAuth(req);
  if (authError) return authError;
  
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN, UserRole.ANALYST]);
  if (roleError) return roleError;

  try {
    const memberId = validateId(params.id);
    
    const member = await SoftDeleteHelper.findMemberById(memberId);
    
    if (!member) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }
    
    // Include related data
    const memberWithRelations = await db.member.findUnique({
      where: { id: memberId },
      include: {
        struktur: {
          include: {
            sayapType: true,
            region: true,
          }
        }
      },
    });
    
    return NextResponse.json({ success: true, data: memberWithRelations });
  } catch (err: any) {
    console.error("Error fetching member:", err);
    if (err.message === "Invalid ID format") {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch member" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;
  
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;
  
  try {
    const memberId = validateId(params.id);
    const body = await req.json();
    
    // Validate input
    const validation = validateRequest(memberSchemas.update, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error, details: validation.details },
        { status: 400 }
      );
    }
    
    const data = validation.data;
    
    // Check if member exists
    const existingMember = await SoftDeleteHelper.findMemberById(memberId);
    if (!existingMember) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }
    
    // Check for duplicate email if provided
    if (data.email) {
      const duplicateMember = await db.member.findFirst({
        where: {
          AND: [
            { email: data.email },
            { id: { not: memberId } }
          ]
        }
      });
      
      if (duplicateMember) {
        return NextResponse.json(
          { success: false, error: "Member with this email already exists" },
          { status: 409 }
        );
      }
    }
    
    const updated = await db.member.update({
      where: { id: memberId },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        address: data.address,
        bio: data.bio,
        status: data.status,
        strukturId: data.strukturId,
        photoUrl: data.photoUrl,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        gender: data.gender,
      },
      include: { struktur: true },
    });
    
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("Error updating member:", err);
    if (err.message === "Invalid ID format") {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;
  
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;
  
  try {
    const memberId = validateId(params.id);
    
    // Check if member exists
    const existingMember = await SoftDeleteHelper.findMemberById(memberId);
    if (!existingMember) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }
    
    // Delete the member (hard delete for now)
    await SoftDeleteHelper.softDeleteMember(memberId);
    
    return NextResponse.json({
      success: true,
      message: "Member deleted successfully"
    });
  } catch (err: any) {
    console.error("Error deleting member:", err);
    if (err.message === "Invalid ID format") {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
