import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";

export async function PATCH(req: NextRequest, props: any) {
  try {
    // Authentication & Authorization
    const authError = requireAuth(req);
    if (authError) return authError;

    const roleError = requireRole(req, ["superadmin", "editor"]);
    if (roleError) return roleError;

    const params = await props.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status harus 'accepted' atau 'rejected'" },
        { status: 400 }
      );
    }

    // Fetch full registration data
    const fullRegistration = await db.kipRegistration.findUnique({
      where: { id },
      include: {
        program: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    } as any);

    if (!fullRegistration) {
      return NextResponse.json(
        { error: "Pendaftaran KIP tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update status
    const updated = await db.kipRegistration.update({
      where: { id },
      data: {
        status: status as any,
        reviewedAt: new Date(),
      },
    } as any);

    // If accepted, create beneficiary record
    if (status === "accepted") {
      const beneficiaryData = {
        programId: fullRegistration.programId,
        fullName: fullRegistration.studentName,
        nik: fullRegistration.nik || null,
        phone: fullRegistration.phoneNumber || fullRegistration.parentPhone || null,
        dateOfBirth: fullRegistration.dateOfBirth,
        gender: fullRegistration.gender,
        notes: `Program KIP - PT: ${fullRegistration.universityName} (${fullRegistration.universityStatus}), Prodi: ${fullRegistration.studyProgram}, Angkatan: ${fullRegistration.yearLevel}, NIM: ${fullRegistration.nim}`,
        receivedAt: new Date(),
      };

      await db.programBenefitRecipient.create({
        data: beneficiaryData,
      });
    }

    return NextResponse.json({
      success: true,
      message:
        status === "accepted"
          ? "Data berhasil ditambahkan ke penerima manfaat"
          : "Pendaftaran berhasil ditolak",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating KIP registration status:", error);
    return NextResponse.json(
      {
        error: "Gagal update status KIP",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
