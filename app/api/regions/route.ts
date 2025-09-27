import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

// list semua region
export async function GET() {
  try {
    const regions = await db.region.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ success: true, data: regions });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// create region baru
export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  try {
    const { name, type } = await req.json();
    const region = await db.region.create({ data: { name, type } });
    return NextResponse.json({ success: true, data: region });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
