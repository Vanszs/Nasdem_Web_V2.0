import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { z } from "zod";
import { UserRole } from "@/lib/rbac";

const aboutSchema = z.object({
  vision: z.string().nullable().optional(),
  mission: z.string().nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
});

export async function GET() {
  const data = await db.cmsAbout.findFirst();
  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.EDITOR]);
  if (roleError) return roleError;

  const json = await req.json().catch(() => null);
  const parsed = aboutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await db.cmsAbout.findFirst();
  const updated = existing
    ? await db.cmsAbout.update({
        where: { id: existing.id },
        data: parsed.data,
      })
    : await db.cmsAbout.create({ data: parsed.data });

  return NextResponse.json({ data: updated });
}
