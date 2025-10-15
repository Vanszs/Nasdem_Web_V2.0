import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { z } from "zod";
import { UserRole } from "@/lib/rbac";

const contactSchema = z.object({
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  address: z.string().nullable().optional(),
  operationalHours: z.string().nullable().optional(),
  instagramUrl: z.string().url().nullable().optional(),
  facebookUrl: z.string().url().nullable().optional(),
  twitterUrl: z.string().url().nullable().optional(),
  youtubeUrl: z.string().url().nullable().optional(),
});

export async function GET() {
  const data = await db.cmsContact.findFirst();
  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.EDITOR]);
  if (roleError) return roleError;

  const json = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await db.cmsContact.findFirst();
  const updated = existing
    ? await db.cmsContact.update({
        where: { id: existing.id },
        data: parsed.data,
      })
    : await db.cmsContact.create({ data: parsed.data });

  return NextResponse.json({ data: updated });
}
