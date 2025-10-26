import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { z } from "zod";
import { UserRole } from "@/lib/rbac";

const bannerSchema = z.object({
  imageUrl: z.string(),
  order: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const data = await db.cmsHeroBanner.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.EDITOR]);
  if (roleError) return roleError;

  const json = await req.json().catch(() => null);
  const parsed = bannerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const created = await db.cmsHeroBanner.create({ data: parsed.data });
  return NextResponse.json({ data: created }, { status: 201 });
}
