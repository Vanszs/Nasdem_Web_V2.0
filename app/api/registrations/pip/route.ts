import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Validation schema untuk form PIP yang lengkap
const pipRegistrationSchema = z.object({
  // Data Siswa
  educationLevel: z.enum(["sd", "smp", "sma", "smk"], {
    required_error: "Pilih jenjang pendidikan",
  }),
  studentName: z.string().min(3, "Nama siswa minimal 3 karakter"),
  birthPlace: z.string().min(2, "Tempat lahir minimal 2 karakter").optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.enum(["male", "female"]).optional().or(z.literal("")),
  nisn: z.string().optional().or(z.literal("")),
  studentClass: z.string().optional().or(z.literal("")),
  studentPhone: z.string().optional().or(z.literal("")),

  // Data Sekolah
  schoolName: z.string().min(3, "Nama sekolah minimal 3 karakter").optional().or(z.literal("")),
  npsn: z.string().optional().or(z.literal("")),
  schoolStatus: z.enum(["negeri", "swasta"]).optional().or(z.literal("")),
  schoolVillage: z.string().optional().or(z.literal("")),
  schoolDistrict: z.string().optional().or(z.literal("")),
  schoolCity: z.string().optional().or(z.literal("")),
  schoolProvince: z.string().optional().or(z.literal("")),

  // Data Orang Tua
  fatherName: z.string().min(3, "Nama ayah/wali minimal 3 karakter").optional().or(z.literal("")),
  fatherPhone: z.string().optional().or(z.literal("")),
  motherName: z.string().optional().or(z.literal("")),
  motherPhone: z.string().optional().or(z.literal("")),
  parentProvince: z.string().optional().or(z.literal("")),
  parentCity: z.string().optional().or(z.literal("")),
  parentDistrict: z.string().optional().or(z.literal("")),
  parentVillage: z.string().optional().or(z.literal("")),
  parentRtRw: z.string().optional().or(z.literal("")),
  parentAddress: z.string().optional().or(z.literal("")),
  parentWillingJoinNasdem: z.boolean().optional(),
  parentJoinReason: z.string().optional().or(z.literal("")),

  // Data Pengusul
  proposerName: z.string().min(3, "Nama pengusul minimal 3 karakter"),
  proposerStatus: z.enum(["dpd", "dpc", "dprt", "kordes", "lainnya"]).optional().or(z.literal("")),
  proposerStatusOther: z.string().optional().or(z.literal("")),
  proposerPhone: z.string().optional().or(z.literal("")),
  proposerAddress: z.string().optional().or(z.literal("")),
  proposerRelation: z.enum(["anak", "saudara", "tetangga", "lainnya"]).optional().or(z.literal("")),
  proposerRelationOther: z.string().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract and validate data
    const data = {
      // Data Siswa
      educationLevel: formData.get("educationLevel") as string,
      studentName: formData.get("studentName") as string,
      birthPlace: formData.get("birthPlace") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      gender: formData.get("gender") as string,
      nisn: formData.get("nisn") as string,
      studentClass: formData.get("studentClass") as string,
      studentPhone: formData.get("studentPhone") as string,
      
      // Data Sekolah
      schoolName: formData.get("schoolName") as string,
      npsn: formData.get("npsn") as string,
      schoolStatus: formData.get("schoolStatus") as string,
      schoolVillage: formData.get("schoolVillage") as string,
      schoolDistrict: formData.get("schoolDistrict") as string,
      schoolCity: formData.get("schoolCity") as string,
      schoolProvince: formData.get("schoolProvince") as string,
      
      // Data Orang Tua
      fatherName: formData.get("fatherName") as string,
      fatherPhone: formData.get("fatherPhone") as string,
      motherName: formData.get("motherName") as string,
      motherPhone: formData.get("motherPhone") as string,
      parentProvince: formData.get("parentProvince") as string,
      parentCity: formData.get("parentCity") as string,
      parentDistrict: formData.get("parentDistrict") as string,
      parentVillage: formData.get("parentVillage") as string,
      parentRtRw: formData.get("parentRtRw") as string,
      parentAddress: formData.get("parentAddress") as string,
      parentWillingJoinNasdem: formData.get("parentWillingJoinNasdem") === "true",
      parentJoinReason: formData.get("parentJoinReason") as string,
      
      // Data Pengusul
      proposerName: formData.get("proposerName") as string,
      proposerStatus: formData.get("proposerStatus") as string,
      proposerStatusOther: formData.get("proposerStatusOther") as string,
      proposerPhone: formData.get("proposerPhone") as string,
      proposerAddress: formData.get("proposerAddress") as string,
      proposerRelation: formData.get("proposerRelation") as string,
      proposerRelationOther: formData.get("proposerRelationOther") as string,
    };

    // Validate
    const validatedData = pipRegistrationSchema.parse(data);

    // Get programId from form data - NOW REQUIRED
    const programIdStr = formData.get("programId") as string;
    if (!programIdStr) {
      return NextResponse.json(
        { error: "Program ID diperlukan" },
        { status: 400 }
      );
    }

    const programId = parseInt(programIdStr);

    // Verify program exists
    const program = await db.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      return NextResponse.json(
        { error: "Program tidak ditemukan" },
        { status: 404 }
      );
    }

    // Optional: Verify it's an education program
    if (program.category !== "pendidikan") {
      return NextResponse.json(
        { error: "Program harus dari kategori pendidikan" },
        { status: 400 }
      );
    }

    // Check if NISN already registered for this program (if NISN provided and not empty)
    if (validatedData.nisn && validatedData.nisn.trim() !== "") {
      const existingRegistration = await db.pipRegistration.findFirst({
        where: {
          programId: programId,
          nisn: validatedData.nisn.trim(),
        },
      });

      if (existingRegistration) {
        return NextResponse.json(
          { error: "NISN sudah terdaftar untuk program ini" },
          { status: 400 }
        );
      }
    }

    // Create registration
    const registration = await db.pipRegistration.create({
      data: {
        programId: programId,
        
        // Data Siswa
        educationLevel: validatedData.educationLevel as any,
        studentName: validatedData.studentName,
        birthPlace: validatedData.birthPlace || null,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        gender: validatedData.gender as any,
        nisn: validatedData.nisn || null,
        studentClass: validatedData.studentClass || null,
        studentPhone: validatedData.studentPhone || null,
        
        // Data Sekolah
        schoolName: validatedData.schoolName || null,
        npsn: validatedData.npsn || null,
        schoolStatus: validatedData.schoolStatus as any,
        schoolVillage: validatedData.schoolVillage || null,
        schoolDistrict: validatedData.schoolDistrict || null,
        schoolCity: validatedData.schoolCity || null,
        schoolProvince: validatedData.schoolProvince || null,
        
        // Data Orang Tua
        fatherName: validatedData.fatherName || null,
        fatherPhone: validatedData.fatherPhone || null,
        motherName: validatedData.motherName || null,
        motherPhone: validatedData.motherPhone || null,
        parentProvince: validatedData.parentProvince || null,
        parentCity: validatedData.parentCity || null,
        parentDistrict: validatedData.parentDistrict || null,
        parentVillage: validatedData.parentVillage || null,
        parentRtRw: validatedData.parentRtRw || null,
        parentAddress: validatedData.parentAddress || null,
        parentWillingJoinNasdem: validatedData.parentWillingJoinNasdem || false,
        parentJoinReason: validatedData.parentJoinReason || null,
        
        // Data Pengusul
        proposerName: validatedData.proposerName || null,
        proposerStatus: validatedData.proposerStatus as any,
        proposerStatusOther: validatedData.proposerStatusOther || null,
        proposerPhone: validatedData.proposerPhone || null,
        proposerAddress: validatedData.proposerAddress || null,
        proposerRelation: validatedData.proposerRelation as any,
        proposerRelationOther: validatedData.proposerRelationOther || null,
        
        status: "pending",
      },
    });

    return NextResponse.json(
      {
        message: "Pendaftaran berhasil",
        data: registration,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("PIP Registration Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Data tidak valid", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [registrations, total] = await Promise.all([
      db.pipRegistration.findMany({
        where,
        include: {
          program: true,
        },
        orderBy: {
          submittedAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.pipRegistration.count({ where }),
    ]);

    return NextResponse.json({
      data: registrations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Get PIP Registrations Error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
