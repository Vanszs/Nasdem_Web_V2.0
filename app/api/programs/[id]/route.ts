import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// detail program
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const program = await db.program.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        category: true,
        user: { select: { id: true, username: true, email: true } },
      },
    });

    if (!program)
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: program });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// update program
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      categoryId,
      photoUrl,
      userId,
    } = await req.json();

    const updated = await db.program.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        categoryId,
        photoUrl,
        userId,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// hapus program
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.program.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "Program deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
