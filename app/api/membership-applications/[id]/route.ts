import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";
import { ApplicationStatus } from "@prisma/client";

const updateApplicationSchema = z
  .object({
    status: z.nativeEnum(ApplicationStatus).optional(),
    notes: z.string().optional(),
    reviewedAt: z.string().nullable().optional(),
    memberId: z.number().int().nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
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
    const parsed = updateApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updateData: any = {};

    if (data.status) {
      updateData.status = data.status;
      if (
        !data.reviewedAt &&
        data.status !== ApplicationStatus.pending &&
        data.status !== ApplicationStatus.reviewed
      ) {
        updateData.reviewedAt = new Date();
      }
    }

    if (data.reviewedAt !== undefined) {
      updateData.reviewedAt = data.reviewedAt
        ? new Date(data.reviewedAt)
        : null;
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes || null;
    }

    if (data.memberId !== undefined) {
      updateData.memberId = data.memberId ?? null;
    }

    const updated = await db.membershipApplication.update({
      where: { id: applicationId },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        applicationType: true,
        status: true,
        submittedAt: true,
        reviewedAt: true,
        notes: true,
        memberId: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("Error updating membership application:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update membership application" },
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

  const roleError = requireRole(req, [UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  const applicationId = Number(params.id);
  if (!Number.isInteger(applicationId)) {
    return NextResponse.json(
      { success: false, error: "Invalid application id" },
      { status: 400 }
    );
  }

  try {
    await db.membershipApplication.delete({ where: { id: applicationId } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting membership application:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete membership application" },
      { status: 500 }
    );
  }
}
