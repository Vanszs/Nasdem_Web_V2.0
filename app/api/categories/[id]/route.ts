import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// detail kategori
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await db.category.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!category)
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: category });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// update kategori
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, subtitle, description, iconUrl } = await req.json();

    const updated = await db.category.update({
      where: { id: parseInt(params.id) },
      data: { name, subtitle, description, iconUrl },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// hapus kategori
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.category.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
