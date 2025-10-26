import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";
import { GenderEnum, Prisma } from "@prisma/client";

const idParam = z.object({ id: z.coerce.number().int() });

const bodySchema = z.object({
  // Accept numbers and coerce, but reject non-positive values to avoid FK=0
  programId: z.coerce.number().int().positive().optional(),
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  nik: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  // Frontend sends YYYY-MM-DD or null
  dateOfBirth: z.string().optional().nullable(),
  gender: z.nativeEnum(GenderEnum).optional().nullable(),
  occupation: z.string().optional().nullable(),
  familyMemberCount: z.coerce.number().int().min(0).optional().nullable(),
  proposerName: z.string().optional().nullable(),
  fullAddress: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(["pending", "completed"]).optional(),
});

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(_req);
  if (authError) return authError;
  const roleError = requireRole(_req, [
    UserRole.EDITOR,
    UserRole.SUPERADMIN,
    UserRole.ANALYST,
  ]);
  if (roleError) return roleError;

  try {
    const { id } = idParam.parse(ctx.params);
    const data = await db.programBenefitRecipient.findUnique({
      where: { id },
      include: {
        program: { select: { id: true, category: true, name: true } },
      },
    });
    if (!data)
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("/api/beneficiaries/[id] GET error", e);
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const { id } = idParam.parse(await ctx.params);
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid body",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const b = parsed.data;

    const data: Record<string, any> = Object.fromEntries(
      Object.entries(b).map(([k, v]) => {
        if (k === "dateOfBirth") {
          return [k, v ? new Date(v) : null];
        }
        return [k, v];
      })
    );

    const updated = await db.programBenefitRecipient.update({
      where: { id },
      data,
      select: { id: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    console.error("/api/beneficiaries/[id] PUT error", e);

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002":
          return NextResponse.json(
            {
              success: false,
              error:
                "Data duplikat. Kombinasi Program dan NIK sudah terdaftar.",
              details: e.meta,
            },
            { status: 400 }
          );
        case "P2003":
          return NextResponse.json(
            {
              success: false,
              error: "Program tidak ditemukan atau tidak valid.",
              details: e.meta,
            },
            { status: 400 }
          );
        case "P2025":
          return NextResponse.json(
            { success: false, error: "Data tidak ditemukan." },
            { status: 404 }
          );
      }
    }

    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    await db.programBenefitRecipient.delete({
      where: { id: parseInt((await ctx.params).id) },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("/api/beneficiaries/[id] DELETE error", e);
    return NextResponse.json(
      { success: false, error: "Failed to delete" },
      { status: 500 }
    );
  }
}
