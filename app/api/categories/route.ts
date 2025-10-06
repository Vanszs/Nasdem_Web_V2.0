import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";

// list semua kategori
export async function GET() {
  try {
    const categories = await db.category.findMany();
    return NextResponse.json({ success: true, data: categories });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// create kategori baru
export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;
  try {
    const { name, subtitle, description, iconUrl } = await req.json();

    const category = await db.category.create({
      data: { name, subtitle, description, iconUrl },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
