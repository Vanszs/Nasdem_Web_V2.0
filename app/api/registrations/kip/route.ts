import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all KIP registrations
export async function GET(req: NextRequest) {
  try {
    const kipRegistrations = await db.kipRegistration.findMany({
      orderBy: {
        submittedAt: "desc",
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    } as any);

    return NextResponse.json({
      success: true,
      data: kipRegistrations,
    });
  } catch (error: any) {
    console.error("Error fetching KIP registrations:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data KIP", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new KIP registration
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "programId",
      "studentName",
      "homeAddress",
      "phoneNumber",
      "nik",
      "birthPlace",
      "dateOfBirth",
      "gender",
      "nim",
      "universityName",
      "universityStatus",
      "studyProgram",
      "yearLevel",
      "fatherName",
      "motherName",
      "parentPhone",
      "parentAddress",
      "proposerName",
      "proposerStatus",
      "proposerPhone",
      "proposerAddress",
      "proposerRelation",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} wajib diisi` },
          { status: 400 }
        );
      }
    }

    // Create KIP registration
    const kipRegistration = await db.kipRegistration.create({
      data: {
        programId: parseInt(body.programId),
        status: "pending" as any,
        
        // Data Mahasiswa
        studentName: body.studentName,
        homeAddress: body.homeAddress,
        phoneNumber: body.phoneNumber,
        nik: body.nik,
        birthPlace: body.birthPlace,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.gender as any,
        nisn: body.nisn || null,
        npsn: body.npsn || null,
        nim: body.nim,
        universityName: body.universityName,
        universityStatus: body.universityStatus,
        studyProgram: body.studyProgram,
        yearLevel: body.yearLevel,
        
        // Data Orang Tua
        fatherName: body.fatherName,
        motherName: body.motherName,
        parentPhone: body.parentPhone,
        parentAddress: body.parentAddress,
        
        // Data Pengusul
        proposerName: body.proposerName,
        proposerStatus: body.proposerStatus as any,
        proposerStatusOther: body.proposerStatus === "lainnya" ? body.proposerStatusOther : null,
        proposerPhone: body.proposerPhone,
        proposerAddress: body.proposerAddress,
        proposerRelation: body.proposerRelation as any,
        proposerRelationOther: body.proposerRelation === "lainnya" ? body.proposerRelationOther : null,
      },
    } as any);

    return NextResponse.json({
      success: true,
      message: "Pendaftaran KIP berhasil dikirim",
      data: kipRegistration,
    });
  } catch (error: any) {
    console.error("Error creating KIP registration:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pendaftaran KIP", details: error.message },
      { status: 500 }
    );
  }
}
