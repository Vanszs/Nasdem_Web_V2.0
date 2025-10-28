import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";

// PATCH /api/registrations/pip/[id] - Update registration status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authentication & Authorization
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.EDITOR]);
  if (roleError) return roleError;

  try {
    const registrationId = parseInt(params.id, 10);
    
    if (isNaN(registrationId)) {
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

    const body = await req.json();
    const validatedData = updateSchema.parse(body);

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
        // Check if beneficiary already exists for this program + NIK
        const existingBeneficiary = await db.programBenefitRecipient.findUnique({
          where: {
            programId_nik: {
              programId: existingRegistration.programId,
              nik: existingRegistration.nik,
            },
          },
        });

        if (!existingBeneficiary) {
          // Create beneficiary record
          await db.programBenefitRecipient.create({
            data: {
              programId: existingRegistration.programId,
              fullName: existingRegistration.fullName,
              email: existingRegistration.email,
              nik: existingRegistration.nik,
              phone: existingRegistration.phone,
              dateOfBirth: existingRegistration.dateOfBirth,
              gender: existingRegistration.gender,
              occupation: existingRegistration.occupation,
              familyMemberCount: existingRegistration.familyMemberCount,
              proposerName: existingRegistration.proposerName,
              fullAddress: existingRegistration.fullAddress,
              status: "pending", // BenefitStatus.pending
              receivedAt: new Date(),
            },
          });
        }
      } catch (beneficiaryError) {
        console.error("Error creating beneficiary:", beneficiaryError);
        // Don't fail the status update if beneficiary creation fails
      }
    }

    return NextResponse.json({
      success: true,
      message: validatedData.status === "accepted" 
        ? "Status berhasil diperbarui dan data telah ditambahkan ke daftar penerima manfaat"
        : "Status berhasil diperbarui",
      data: updatedRegistration,
    });
  } catch (error) {
    console.error("Error updating PIP registration:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Data tidak valid", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Gagal memperbarui status pendaftaran" },
      { status: 500 }
    );
  }
}

// GET /api/registrations/pip/[id] - Get single registration
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authentication & Authorization
  const authError = requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.EDITOR, UserRole.ANALYST]);
  if (roleError) return roleError;

  try {
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
