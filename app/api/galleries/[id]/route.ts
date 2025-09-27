import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// detail gallery
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gallery = await db.gallery.findUnique({
      where: { id: parseInt(params.id) },
      include: { user: { select: { id: true, username: true, email: true } } },
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

// update gallery
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { type, url, caption, uploadDate, userId } = await req.json();

    const updated = await db.gallery.update({
      where: { id: parseInt(params.id) },
      data: {
        type,
        url,
        caption,
        uploadDate: uploadDate ? new Date(uploadDate) : undefined,
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

// hapus gallery
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
