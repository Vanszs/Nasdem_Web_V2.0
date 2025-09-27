import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

// list semua member
export async function GET() {
  try {
    const members = await db.member.findMany({
      include: {
        user: { select: { id: true, username: true, email: true } },
        struktur: true,
      },
      orderBy: { joinDate: "desc" },
    });

    return NextResponse.json({ success: true, data: members });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// create member baru
export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  try {
    const userId = (req as any).user.userId;
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

    const member = await db.member.create({
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

    return NextResponse.json({ success: true, data: member });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
