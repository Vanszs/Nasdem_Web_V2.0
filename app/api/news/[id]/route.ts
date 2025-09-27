import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// detail berita
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const news = await db.news.findUnique({
      where: { id: parseInt(params.id) },
      include: { user: { select: { id: true, username: true, email: true } } },
    });

    if (!news)
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: news });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// update berita
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, content, publishDate, thumbnailUrl, userId } =
      await req.json();

    const updated = await db.news.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        content,
        publishDate: publishDate ? new Date(publishDate) : undefined,
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
