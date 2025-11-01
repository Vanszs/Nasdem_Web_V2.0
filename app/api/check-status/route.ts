import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nik = searchParams.get("nik");

    if (!nik || !nik.trim()) {
      return NextResponse.json(
        { error: "NIK/NISN harus diisi" },
        { status: 400 }
      );
    }

    const nikTrimmed = nik.trim();

    // Search in MembershipApplication (using NIK)
    const membershipApplications = await db.membershipApplication.findMany({
      where: {
        nik: nikTrimmed,
      },
      orderBy: {
        submittedAt: "desc", // Get latest first
      },
      select: {
        id: true,
        fullName: true,
        nik: true,
        email: true,
        phone: true,
        applicationType: true,
        status: true,
        submittedAt: true,
        reviewedAt: true,
        notes: true,
      },
    });

    // Search in PipRegistration (using NISN)
    const pipRegistrations = await db.pipRegistration.findMany({
      where: {
        nisn: nikTrimmed,
      } as any,
      orderBy: {
        submittedAt: "desc", // Get latest first
      },
      select: {
        id: true,
        studentName: true,
        nisn: true,
        educationLevel: true,
        status: true,
        submittedAt: true,
        reviewedAt: true,
        reviewerNotes: true,
        program: {
          select: {
            name: true,
          },
        },
      } as any,
    });

    const found = membershipApplications.length > 0 || pipRegistrations.length > 0;

    return NextResponse.json({
      found,
      membershipApplications,
      pipRegistrations,
    });
  } catch (error) {
    console.error("Error checking status:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengecek status" },
      { status: 500 }
    );
  }
}
