import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const member = await db.member.findUnique({
      where: { id: parseInt(params.id) },
      include: { struktur: true },
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;
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
      strukturId,
      photoUrl,
      joinDate,
      endDate,
    } = await req.json();
    const allowedStatus = ["active", "inactive", "suspended"];
    const normStatus =
      status && allowedStatus.includes(status.toLowerCase())
        ? status.toLowerCase()
        : undefined;
    const normGender =
      gender && ["male", "female"].includes(gender.toLowerCase())
        ? gender.toLowerCase()
        : undefined;
    const updated = await db.member.update({
      where: { id: parseInt(params.id) },
      data: {
        fullName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address,
        bio,
        status: normStatus,
        strukturId,
        photoUrl,
        joinDate: joinDate ? new Date(joinDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        gender: normGender,
      },
      include: { struktur: true },
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
    await db.member.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "Member deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
