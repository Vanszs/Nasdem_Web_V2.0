import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

// list semua sayap
export async function GET() {
  try {
    const sayaps = await db.sayapType.findMany({
      include: {
        StrukturOrganisasi: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: sayaps });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// create sayap baru
export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  try {
    const { name, description } = await req.json();

    const sayap = await db.sayapType.create({
      data: { name, description },
      include: { StrukturOrganisasi: true },
    });

    return NextResponse.json({ success: true, data: sayap });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
