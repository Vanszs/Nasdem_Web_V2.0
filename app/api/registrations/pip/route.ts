import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Validation schema
const pipRegistrationSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  nik: z.string().length(16, "NIK harus 16 digit"),
  phone: z.string().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.enum(["male", "female"]).optional().or(z.literal("")),
  occupation: z.string().optional().or(z.literal("")),
  familyMemberCount: z.string().optional().or(z.literal("")),
  fullAddress: z
    .string()
    .min(10, "Alamat minimal 10 karakter")
    .optional()
    .or(z.literal("")),
  proposerName: z.string().min(3, "Nama pengusul minimal 3 karakter"),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract and validate data
    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      nik: formData.get("nik") as string,
      phone: formData.get("phone") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      gender: formData.get("gender") as string,
      occupation: formData.get("occupation") as string,
      familyMemberCount: formData.get("familyMemberCount") as string,
      fullAddress: formData.get("fullAddress") as string,
      proposerName: formData.get("proposerName") as string,
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

    // Check if NIK already registered for this program
    const existingRegistration = await db.pipRegistration.findFirst({
      where: {
        programId: programId,
        nik: validatedData.nik,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "NIK sudah terdaftar untuk program ini" },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await db.pipRegistration.create({
      data: {
        programId: programId,
        fullName: validatedData.fullName,
        email: validatedData.email || null,
        nik: validatedData.nik,
        phone: validatedData.phone || null,
        dateOfBirth: validatedData.dateOfBirth
          ? new Date(validatedData.dateOfBirth)
          : null,
        gender: validatedData.gender as any,
        occupation: validatedData.occupation || null,
        familyMemberCount: validatedData.familyMemberCount
          ? parseInt(validatedData.familyMemberCount)
          : null,
        fullAddress: validatedData.fullAddress,
        proposerName: validatedData.proposerName || null,
        ktpPhotoUrl: null,
        kkPhotoUrl: null,
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
