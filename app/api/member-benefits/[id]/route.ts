import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";
import { BenefitStatus } from "@prisma/client";

const updateAssignmentSchema = z
  .object({
    status: z.nativeEnum(BenefitStatus).optional(),
    grantedAt: z.string().optional(),
    notes: z.string().optional(),
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

  const assignmentId = Number(params.id);
  if (!Number.isInteger(assignmentId)) {
    return NextResponse.json(
      { success: false, error: "Invalid assignment id" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const parsed = updateAssignmentSchema.safeParse(body);

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

    const updated = await db.memberBenefit.update({
      where: { id: assignmentId },
      data: {
        status: data.status ?? undefined,
        grantedAt: data.grantedAt ? new Date(data.grantedAt) : undefined,
        notes: data.notes || undefined,
      },
      select: {
        id: true,
        memberId: true,
        benefitId: true,
        status: true,
        grantedAt: true,
        notes: true,
        updatedAt: true,
        member: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        benefit: {
          select: {
            id: true,
            title: true,
            category: true,
            description: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("Error updating member benefit:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update member benefit" },
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

  const assignmentId = Number(params.id);
  if (!Number.isInteger(assignmentId)) {
    return NextResponse.json(
      { success: false, error: "Invalid assignment id" },
      { status: 400 }
    );
  }

  try {
    await db.memberBenefit.delete({ where: { id: assignmentId } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting member benefit:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete member benefit" },
      { status: 500 }
    );
  }
}
