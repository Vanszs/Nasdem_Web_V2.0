import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/jwt-middleware";

// list semua berita
export async function GET() {
  try {
    const newsList = await db.news.findMany({
      include: {
        user: { select: { id: true, username: true, email: true } },
      },
      orderBy: { publishDate: "desc" },
    });

    return NextResponse.json({ success: true, data: newsList });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// create berita baru
export async function POST(req: NextRequest) {
  const authError = await requireAuth(["editor", "superadmin"])(req);
  if (authError) return authError;

  try {
    const { title, content, publishDate, thumbnailUrl, userId } =
      await req.json();

    const news = await db.news.create({
      data: {
        title,
        content,
        publishDate: publishDate ? new Date(publishDate) : undefined,
        thumbnailUrl,
        userId,
      },
      include: { user: { select: { id: true, username: true, email: true } } },
    });

    return NextResponse.json({ success: true, data: news });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
