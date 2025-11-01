import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrgLevel, PositionEnum } from "@prisma/client";

/**
 * GET /api/organizations/dpc-ketua
 * Fetch all DPC Ketua per kecamatan
 */
export async function GET(req: NextRequest) {
  try {
    // Fetch all kecamatan regions
    const kecamatanRegions = await db.region.findMany({
      where: { type: "kecamatan" },
      orderBy: { name: "asc" },
    });

    // For each kecamatan, fetch DPC Ketua structure with member
    const dpcDataPromises = kecamatanRegions.map(async (kecamatan) => {
      const dpcKetua = await db.strukturOrganisasi.findFirst({
        where: {
          level: OrgLevel.dpc,
          regionId: kecamatan.id,
          position: PositionEnum.ketua,
        },
        include: {
          members: {
            select: {
              id: true,
              fullName: true,
              photoUrl: true,
              phone: true,
              email: true,
            },
          },
        },
      });

      return {
        kecamatan: kecamatan.name,
        ketua: dpcKetua?.members?.[0] || null,
      };
    });

    const dpcData = await Promise.all(dpcDataPromises);

    return NextResponse.json(dpcData);
  } catch (error) {
    console.error("Error fetching DPC ketua:", error);
    return NextResponse.json(
      { error: "Failed to fetch DPC ketua" },
      { status: 500 }
    );
  }
}
