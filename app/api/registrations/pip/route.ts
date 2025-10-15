import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Validation schema
const pipRegistrationSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email().optional().or(z.literal("")),
  nik: z.string().length(16),
  phone: z.string().optional().or(z.literal("")),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female"]),
  occupation: z.string().optional().or(z.literal("")),
  familyMemberCount: z.string().optional().or(z.literal("")),
  fullAddress: z.string().min(10),
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
    };

    // Validate
    const validatedData = pipRegistrationSchema.parse(data);

    // Handle file uploads
    const ktpPhoto = formData.get("ktpPhoto") as File | null;
    const kkPhoto = formData.get("kkPhoto") as File | null;

    let ktpPhotoUrl: string | null = null;
    let kkPhotoUrl: string | null = null;

    // Upload directory
    const uploadDir = join(process.cwd(), "public", "uploads", "pip");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save KTP photo
    if (ktpPhoto && ktpPhoto.size > 0) {
      const ktpBuffer = Buffer.from(await ktpPhoto.arrayBuffer());
      const ktpFilename = `ktp-${validatedData.nik}-${Date.now()}.${ktpPhoto.name.split(".").pop()}`;
      const ktpPath = join(uploadDir, ktpFilename);
      await writeFile(ktpPath, ktpBuffer);
      ktpPhotoUrl = `/uploads/pip/${ktpFilename}`;
    }

    // Save KK photo
    if (kkPhoto && kkPhoto.size > 0) {
      const kkBuffer = Buffer.from(await kkPhoto.arrayBuffer());
      const kkFilename = `kk-${validatedData.nik}-${Date.now()}.${kkPhoto.name.split(".").pop()}`;
      const kkPath = join(uploadDir, kkFilename);
      await writeFile(kkPath, kkBuffer);
      kkPhotoUrl = `/uploads/pip/${kkFilename}`;
    }

    // Find or create PIP program
    let program = await db.program.findFirst({
      where: {
        category: "pendidikan",
        name: {
          contains: "Pendidikan Inklusif",
        },
      },
    });

    if (!program) {
      // Create default PIP program if not exists
      program = await db.program.create({
        data: {
          name: "Pendidikan Inklusif (PIP)",
          category: "pendidikan",
          description: "Program bantuan pendidikan untuk siswa kurang mampu",
          status: "active",
        },
      });
    }

    // Check if NIK already registered
    const existingRegistration = await db.pipRegistration.findFirst({
      where: {
        programId: program.id,
        nik: validatedData.nik,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: "NIK sudah terdaftar untuk program ini" },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await db.pipRegistration.create({
      data: {
        programId: program.id,
        fullName: validatedData.fullName,
        email: validatedData.email || null,
        nik: validatedData.nik,
        phone: validatedData.phone || null,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        gender: validatedData.gender,
        occupation: validatedData.occupation || null,
        familyMemberCount: validatedData.familyMemberCount ? parseInt(validatedData.familyMemberCount) : null,
        fullAddress: validatedData.fullAddress,
        ktpPhotoUrl,
        kkPhotoUrl,
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
        { message: "Data tidak valid", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Terjadi kesalahan server" },
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
      { message: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
