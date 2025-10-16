import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";

const CategoryEnum = z.enum([
  "sosial",
  "politik",
  "pendidikan",
  "kaderisasi",
  "internal",
  "kolaborasi",
  "pelayanan",
  "publikasi",
  "lainnya",
]);

const MediaTypeEnum = z.enum(["image", "video"]);

const mediaSchema = z.object({
  id: z.number().optional(),
  type: MediaTypeEnum,
  url: z.string().url(),
  caption: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
});

const activitySchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  category: CategoryEnum,
  eventDate: z.string().optional(),
  location: z.string().optional(),
  media: z.array(mediaSchema).default([]),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;

    const where: any = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ];
    }
    if (category && CategoryEnum.options.includes(category as any)) {
      where.category = category;
    }

    const activities = await (db as any).activity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        media: {
          orderBy: [{ order: "asc" }, { uploadedAt: "asc" }],
        },
      },
    });

    return NextResponse.json({ success: true, data: activities });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;
  try {
    const body = await req.json();
    const parsed = activitySchema.parse(body);

    const created = await db.$transaction(async (tx) => {
      const activity = await (tx as any).activity.create({
        data: {
          title: parsed.title,
          description: parsed.description,
          category: parsed.category,
          eventDate: parsed.eventDate ? new Date(parsed.eventDate) : undefined,
          location: parsed.location,
        },
      });

      if (parsed.media && parsed.media.length > 0) {
        await (tx as any).activityMedia.createMany({
          data: parsed.media.map((m, idx) => ({
            activityId: activity.id,
            type: m.type,
            url: m.url,
            caption: m.caption,
            order: m.order ?? idx,
          })),
        });
      }

      return (tx as any).activity.findUnique({
        where: { id: activity.id },
        include: {
          media: { orderBy: [{ order: "asc" }, { uploadedAt: "asc" }] },
        },
      });
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: err.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
