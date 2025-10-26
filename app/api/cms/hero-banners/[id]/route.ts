import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { z } from "zod";
import { UserRole } from "@/lib/rbac";

const idParam = z.object({ id: z.coerce.number().int().positive() });
const bannerUpdateSchema = z.object({
  imageUrl: z.string().url().optional(),
  order: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const parsedId = idParam.safeParse(await context.params);
  if (!parsedId.success) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }
  const data = await db.cmsHeroBanner.findUnique({
    where: { id: parsedId.data.id },
  });
  if (!data)
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.EDITOR]);
  if (roleError) return roleError;

  const parsedId = idParam.safeParse(await context.params);
  if (!parsedId.success) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }
  const json = await req.json().catch(() => null);
  const parsed = bannerUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const updated = await db.cmsHeroBanner.update({
    where: { id: parsedId.data.id },
    data: parsed.data,
  });
  return NextResponse.json({ data: updated });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.EDITOR]);
  if (roleError) return roleError;

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }
  await db.cmsHeroBanner.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
