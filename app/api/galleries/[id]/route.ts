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
  url: z.string(),
  caption: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
});

const activityUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  category: CategoryEnum.optional(),
  eventDate: z.string().optional(),
  location: z.string().optional(),
  media: z.array(mediaSchema).optional(),
});

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const activity = await (db as any).activity.findUnique({
      where: { id: parseInt(id) },
      include: {
        media: { orderBy: [{ order: "asc" }, { uploadedAt: "asc" }] },
      },
    });
    if (!activity)
      return NextResponse.json(
        { success: false, error: "Activity not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: activity });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const parsed = activityUpdateSchema.parse(body);

    const updated = await (db as any).$transaction(async (tx: any) => {
      const activity = await tx.activity.update({
        where: { id },
        data: {
          title: parsed.title,
          description: parsed.description,
          category: parsed.category,
          eventDate: parsed.eventDate ? new Date(parsed.eventDate) : undefined,
          location: parsed.location,
        },
      });

      if (parsed.media) {
        // Strategy: remove media not present, upsert those present
        const existing = await tx.activityMedia.findMany({
          where: { activityId: id },
        });
        const incomingIds = parsed.media
          .filter((m) => m.id)
          .map((m) => m.id) as number[];
        const toDelete = existing
          .filter((m: any) => !incomingIds.includes(m.id))
          .map((m: any) => m.id);
        if (toDelete.length) {
          await tx.activityMedia.deleteMany({
            where: { id: { in: toDelete } },
          });
        }
        for (let idx = 0; idx < parsed.media.length; idx++) {
          const m = parsed.media[idx];
          if (m.id) {
            await tx.activityMedia.update({
              where: { id: m.id },
              data: {
                type: m.type,
                url: m.url,
                caption: m.caption,
                order: m.order ?? idx,
              },
            });
          } else {
            await tx.activityMedia.create({
              data: {
                activityId: id,
                type: m.type,
                url: m.url,
                caption: m.caption,
                order: m.order ?? idx,
              },
            });
          }
        }
      }

      return tx.activity.findUnique({
        where: { id },
        include: {
          media: { orderBy: [{ order: "asc" }, { uploadedAt: "asc" }] },
        },
      });
    });

    return NextResponse.json({ success: true, data: updated });
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

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  const { id } = await context.params;
  try {
    await (db as any).activity.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: "Activity deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
