import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserIfAuthenticated, requireAuth, requireRole } from "@/lib/jwt-middleware";
import { SoftDeleteHelper } from "@/lib/soft-delete";
import { newsSchemas, validateRequest } from "@/lib/validation";
import { UserRole } from "@/lib/rbac";

// Helper function to validate ID
function validateId(id: string): number {
  const numId = parseInt(id);
  if (isNaN(numId) || numId <= 0) {
    throw new Error("Invalid ID format");
  }
  return numId;
}

// detail berita
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsId = validateId(params.id);
    const now = new Date();

    const user = getUserIfAuthenticated(req);
    const isPrivileged = user && [UserRole.EDITOR, UserRole.SUPERADMIN, UserRole.ANALYST].includes(user.role);

    const wherePublic = { id: newsId, deletedAt: null as any, publishDate: { lte: now } as any };

    const newsWithRelations = await db.news.findFirst({
      where: isPrivileged ? { id: newsId } : (wherePublic as any),
      include: {
        user: { select: { id: true, username: true, email: true } },
      },
    });

    if (!newsWithRelations) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: newsWithRelations });
  } catch (err: any) {
    console.error("Error fetching news:", err);
    if (err.message === "Invalid ID format") {
      return NextResponse.json(
        { success: false, error: "Invalid news ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// update berita
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;
  try {
    const { title, content, publishDate, thumbnailUrl } = await req.json();

    const updated = await db.news.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        content,
        publishDate:
          publishDate === null
            ? null
            : publishDate
            ? new Date(publishDate)
            : undefined,
        thumbnailUrl,
      },
      include: { user: { select: { id: true, username: true, email: true } } },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// hapus berita
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    await db.news.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "News deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
