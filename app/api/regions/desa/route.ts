import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kecamatanName = searchParams.get("kecamatan");

    if (!kecamatanName) {
      return NextResponse.json(
        { error: "Parameter kecamatan diperlukan" },
        { status: 400 }
      );
    }

    // Find kecamatan by name
    const kecamatan = await db.kecamatan.findFirst({
      where: {
        name: {
          equals: kecamatanName,
          mode: "insensitive",
        },
      },
    });

    if (!kecamatan) {
      return NextResponse.json(
        { error: "Kecamatan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Fetch desa for this kecamatan
    const desas = await db.desa.findMany({
      where: {
        kecamatanId: kecamatan.id,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ data: desas });
  } catch (error: any) {
    console.error("Get Desa Error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
