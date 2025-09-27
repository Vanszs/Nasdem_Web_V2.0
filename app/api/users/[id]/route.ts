import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

// detail user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["admin"]);
  if (roleError) return roleError;

  try {
    const user = await db.user.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: user });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// update user
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["admin"]);
  if (roleError) return roleError;

  try {
    const { username, email, password, role } = await req.json();

    const data: any = { username, email, role };
    if (password) data.password = await bcrypt.hash(password, 10);

    const updated = await db.user.update({
      where: { id: parseInt(params.id) },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
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

// hapus user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["admin"]);
  if (roleError) return roleError;

  try {
    await db.user.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
