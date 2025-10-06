import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
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
  // Add authentication check - was missing before!
  const authError = requireAuth(req);
  if (authError) return authError;
  
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN, UserRole.ANALYST]);
  if (roleError) return roleError;

  try {
    const newsId = validateId(params.id);
    
    const news = await SoftDeleteHelper.findNewsById(newsId);
    
    if (!news) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 }
      );
    }
    
    // Include related data
    const newsWithRelations = await db.news.findUnique({
      where: { id: newsId },
      include: {
        user: { select: { id: true, username: true, email: true } },
      },
    });

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
    const userId = (req as any).user.userId;
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
        userId,
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
