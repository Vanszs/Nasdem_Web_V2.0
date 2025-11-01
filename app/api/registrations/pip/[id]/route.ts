import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";

// PATCH /api/registrations/pip/[id] - Update registration status
export async function PATCH(
  req: NextRequest,
  props: any // Use any temporarily to avoid type issues
): Promise<NextResponse> { // Explicitly return Promise<NextResponse>
  // Wrap EVERYTHING in try-catch
  try {
    console.log("🚀 PATCH /api/registrations/pip/[id] - START");
    console.log("🔍 Props:", JSON.stringify(props, null, 2));
    
    // Authentication & Authorization
    let authError: NextResponse | null;
    try {
      authError = await requireAuth(req);
    } catch (e: any) {
      console.error("❌ Auth check threw error:", e);
      return NextResponse.json({ error: "Auth check failed", details: e.message }, { status: 500 });
    }
    
    if (authError) {
      console.log("❌ Auth error detected, returning auth error response");
      return authError as NextResponse;
    }

    let roleError: NextResponse | null;
    try {
      roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.EDITOR]);
    } catch (e: any) {
      console.error("❌ Role check threw error:", e);
      return NextResponse.json({ error: "Role check failed", details: e.message }, { status: 500 });
    }
    
    if (roleError) {
      console.log("❌ Role error detected, returning role error response");
      return roleError as NextResponse;
    }

    console.log("✅ Auth and role check passed");

    // Await params in Next.js 15
    console.log("⏳ Awaiting params...");
    let params;
    try {
      // Handle both Promise and direct object for compatibility
      if (props?.params && typeof props.params.then === 'function') {
        params = await props.params;
      } else if (props?.params) {
        params = props.params;
      } else {
        throw new Error("No params found in props");
      }
      console.log("✅ Params received:", JSON.stringify(params));
    } catch (paramError: any) {
      console.error("❌ Error awaiting params:", paramError);
      return NextResponse.json(
        { error: "Failed to parse route parameters", details: paramError.message },
        { status: 500 }
      );
    }
    
    const registrationId = parseInt(params.id, 10);
    console.log("📝 Registration ID:", registrationId);
    
    if (isNaN(registrationId)) {
      console.log("❌ Invalid registration ID");
      return NextResponse.json(
        { error: "ID tidak valid" },
        { status: 400 }
      );
    }

    // Validate request body
    const updateSchema = z.object({
      status: z.enum(["pending", "verified", "rejected", "accepted"]),
      reviewerNotes: z.string().optional(),
    });

    console.log("⏳ Parsing request body...");
    const body = await req.json();
    console.log("📦 Body received:", body);
    
    const validatedData = updateSchema.parse(body);
    console.log("✅ Data validated:", validatedData);

    // Check if registration exists
    const existingRegistration = await db.pipRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!existingRegistration) {
      return NextResponse.json(
        { error: "Pendaftaran tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update registration
    const updatedRegistration = await db.pipRegistration.update({
      where: { id: registrationId },
      data: {
        status: validatedData.status,
        reviewerNotes: validatedData.reviewerNotes,
        reviewedAt: new Date(),
      },
      include: {
        program: true,
      },
    });

    // If status is "accepted", automatically create beneficiary record
    if (validatedData.status === "accepted") {
      try {
        // Re-fetch with all fields for mapping
        const fullRegistration = await db.pipRegistration.findUnique({
          where: { id: registrationId },
        }) as any;

        console.log("🔍 Full Registration Data:", JSON.stringify(fullRegistration, null, 2));

        if (fullRegistration) {
          // Check if beneficiary already exists for this program + NISN
          let existingBeneficiary = null;
          
          if (fullRegistration.nisn) {
            existingBeneficiary = await db.programBenefitRecipient.findFirst({
              where: {
                programId: fullRegistration.programId,
                nik: fullRegistration.nisn,
              },
            });
            console.log("🔍 Existing beneficiary by NIK:", existingBeneficiary);
          }
          
          // If not found by NIK, check by name
          if (!existingBeneficiary) {
            existingBeneficiary = await db.programBenefitRecipient.findFirst({
              where: {
                programId: fullRegistration.programId,
                fullName: fullRegistration.studentName,
              },
            });
            console.log("🔍 Existing beneficiary by Name:", existingBeneficiary);
          }

          if (!existingBeneficiary) {
            console.log("✅ Creating new beneficiary...");
            
            // Prepare beneficiary data
            const beneficiaryData = {
              programId: fullRegistration.programId,
              fullName: fullRegistration.studentName || "Nama Tidak Diketahui",
              email: fullRegistration.studentPhone ? `${fullRegistration.nisn || 'student'}@temp.com` : null,
              nik: fullRegistration.nisn || null, // NIK bisa null sekarang
              phone: fullRegistration.studentPhone || fullRegistration.fatherPhone || fullRegistration.motherPhone || null,
              dateOfBirth: fullRegistration.dateOfBirth,
              gender: fullRegistration.gender,
              occupation: "Pelajar",
              familyMemberCount: 1,
              proposerName: fullRegistration.proposerName,
              fullAddress: [
                fullRegistration.parentAddress,
                fullRegistration.parentRtRw ? `RT/RW ${fullRegistration.parentRtRw}` : null,
                fullRegistration.parentVillage,
                fullRegistration.parentDistrict,
                fullRegistration.parentCity,
                fullRegistration.parentProvince,
              ].filter(Boolean).join(", ") || "Alamat tidak lengkap",
              notes: `Program PIP - Jenjang: ${fullRegistration.educationLevel?.toUpperCase() || '-'}, Kelas: ${fullRegistration.studentClass || '-'}, Sekolah: ${fullRegistration.schoolName || '-'}`,
              receivedAt: new Date(),
            };

            console.log("📦 Beneficiary Data to Create:", JSON.stringify(beneficiaryData, null, 2));

            const newBeneficiary = await db.programBenefitRecipient.create({
              data: beneficiaryData,
            });

            console.log("✅ Beneficiary created successfully:", newBeneficiary.id);
            
            // NOTE: We keep the PipRegistration record for historical data
            // It will be filtered out from pending list by status='accepted'
            console.log("✅ PIP registration kept in database with status='accepted' for historical reference");
            
          } else {
            console.log("⚠️ Beneficiary already exists, skipping creation");
          }
        }
      } catch (beneficiaryError: any) {
        console.error("❌ Error creating beneficiary:", beneficiaryError);
        console.error("Error details:", {
          message: beneficiaryError.message,
          code: beneficiaryError.code,
          meta: beneficiaryError.meta,
        });
        // Don't fail the status update if beneficiary creation fails
        // But log it for debugging
      }
    }

    console.log("✅ Final response ready");
    return NextResponse.json({
      success: true,
      message: validatedData.status === "accepted" 
        ? "Status berhasil diperbarui dan data telah ditambahkan ke penerima manfaat"
        : "Status berhasil diperbarui",
      data: updatedRegistration,
    });
  } catch (error: any) {
    console.error("❌ CRITICAL ERROR in PATCH handler:", error);
    console.error("Error stack:", error?.stack);
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);

    if (error instanceof z.ZodError) {
      console.log("❌ Zod validation error");
      return NextResponse.json(
        { error: "Data tidak valid", details: error.errors },
        { status: 400 }
      );
    }

    // Always return a response
    return NextResponse.json(
      { 
        error: "Gagal memperbarui status pendaftaran",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

// GET /api/registrations/pip/[id] - Get single registration
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🚀 GET /api/registrations/pip/[id] - START");
    
    // Authentication & Authorization
    const authError = requireAuth(req);
    if (authError) return authError;

    const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.EDITOR, UserRole.ANALYST]);
    if (roleError) return roleError;

    // Await params in Next.js 15
    const params = await props.params;
    const registrationId = parseInt(params.id, 10);
    
    if (isNaN(registrationId)) {
      return NextResponse.json(
        { error: "ID tidak valid" },
        { status: 400 }
      );
    }

    const registration = await db.pipRegistration.findUnique({
      where: { id: registrationId },
      include: {
        program: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Pendaftaran tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(registration);
  } catch (error) {
    console.error("Error fetching PIP registration:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pendaftaran" },
      { status: 500 }
    );
  }
}
