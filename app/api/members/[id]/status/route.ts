import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";

const paramsSchema = z.object({ id: z.string().regex(/^\d+$/) });
const bodySchema = z.object({
  status: z.enum(["active", "inactive", "suspended"], {
    required_error: "Status diperlukan",
    invalid_type_error: "Status tidak valid",
  }),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const { id } = paramsSchema.parse(await context.params);
    const json = await req.json();
    const { status } = bodySchema.parse(json);

    const memberId = Number(id);

    const member = await db.member.update({
      where: { id: memberId },
      data: { status: status as any },
      select: { id: true, fullName: true, status: true },
    });

    return NextResponse.json({ success: true, data: member });
  } catch (err: any) {
    console.error("Error updating member status:", err);
    const message = err?.message || "Failed to update member status";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
