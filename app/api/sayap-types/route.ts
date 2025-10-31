import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/sayap-types
// Returns list of sayap types for filters and selects
export async function GET() {
  try {
    const data = await db.sayapType.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal memuat data" },
      { status: 500 }
    );
  }
}
