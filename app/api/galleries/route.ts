import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// list semua gallery
export async function GET() {
  try {
    const galleries = await db.gallery.findMany({
      include: {
        user: { select: { id: true, username: true, email: true } },
      },
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

// create gallery baru
export async function POST(req: NextRequest) {
  try {
    const { type, url, caption, uploadDate, userId } = await req.json();

    const gallery = await db.gallery.create({
      data: {
        type,
        url,
        caption,
        uploadDate: uploadDate ? new Date(uploadDate) : undefined,
        userId,
      },
      include: { user: { select: { id: true, username: true, email: true } } },
    });

    return NextResponse.json({ success: true, data: gallery });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
