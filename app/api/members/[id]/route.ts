import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// detail member
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const member = await db.member.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        user: { select: { id: true, username: true, email: true } },
        struktur: true,
      },
    });

    if (!member)
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: member });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// update member
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      address,
      bio,
      gender,
      status,
      userId,
      strukturId,
      photoUrl,
      joinDate,
      endDate,
    } = await req.json();

    const updated = await db.member.update({
      where: { id: parseInt(params.id) },
      data: {
        fullName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address,
        bio,
        gender,
        status,
        userId,
        strukturId,
        photoUrl,
        joinDate: joinDate ? new Date(joinDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
        struktur: true,
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

// hapus member
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.member.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "Member deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
