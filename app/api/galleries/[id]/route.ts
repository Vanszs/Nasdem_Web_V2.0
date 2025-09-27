import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gallery = await db.gallery.findUnique({
      where: { id: parseInt(params.id) },
      include: { User: { select: { id: true, username: true, email: true } } },
    });
    if (!gallery)
      return NextResponse.json(
        { success: false, error: "Gallery not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: gallery });
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
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;
  try {
    const userId = (req as any).user.userId;
    const { type, url, caption, uploadDate } = await req.json();
    const updated = await db.gallery.update({
      where: { id: parseInt(params.id) },
      data: {
        type,
        url,
        caption,
        uploadDate: uploadDate ? new Date(uploadDate) : undefined,
        userId,
      },
      include: { User: { select: { id: true, username: true, email: true } } },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
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
  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;
  try {
    await db.gallery.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "Gallery deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
