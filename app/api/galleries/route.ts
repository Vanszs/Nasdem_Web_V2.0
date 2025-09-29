import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET() {
  try {
    const galleries = await db.gallery.findMany({
      include: { User: { select: { id: true, username: true, email: true } } },
      orderBy: { uploadDate: "desc" },
    });
    return NextResponse.json({ success: true, data: galleries });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;
  try {
    const userId = (req as any).user.userId;
    const { type, url, caption, uploadDate } = await req.json();
    const gallery = await db.gallery.create({
      data: {
        type,
        url,
        caption,
        uploadDate: uploadDate ? new Date(uploadDate) : undefined,
        userId,
      },
      include: { User: { select: { id: true, username: true, email: true } } },
    });
    return NextResponse.json({ success: true, data: gallery });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
