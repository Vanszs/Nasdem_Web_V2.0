import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { ApplicationStatus, MemberStatus } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  const applicationId = Number(params.id);
  if (!Number.isInteger(applicationId)) {
    return NextResponse.json(
      { success: false, error: "Invalid application id" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { organizationId, notes } = body;

    if (!organizationId || !Number.isInteger(organizationId)) {
      return NextResponse.json(
        { success: false, error: "Valid organizationId is required" },
        { status: 400 }
      );
    }

    // Get application details
    const application = await db.membershipApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.status === ApplicationStatus.approved) {
      return NextResponse.json(
        { success: false, error: "Application already approved" },
        { status: 400 }
      );
    }

    // Check if organization exists
    const organization = await db.strukturOrganisasi.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: "Organization not found" },
        { status: 404 }
      );
    }

    // Create member and update application in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create new member
      const newMember = await tx.member.create({
        data: {
          fullName: application.fullName,
          email: application.email || undefined,
          phone: application.phone || undefined,
          address: application.address || undefined,
          dateOfBirth: application.dateOfBirth || undefined,
          gender: application.gender || undefined,
          nik: undefined, // Can be updated later
          occupation: application.occupation || undefined,
          status: MemberStatus.active,
          strukturId: organizationId,
        },
      });

      // Update application status
      const updatedApplication = await tx.membershipApplication.update({
        where: { id: applicationId },
        data: {
          status: ApplicationStatus.approved,
          reviewedAt: new Date(),
          memberId: newMember.id,
          notes: notes || application.notes,
        },
      });

      return { member: newMember, application: updatedApplication };
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Application approved and member created successfully",
    });
  } catch (err: any) {
    console.error("Error approving membership application:", err);
    return NextResponse.json(
      { success: false, error: "Failed to approve membership application" },
      { status: 500 }
    );
  }
}
