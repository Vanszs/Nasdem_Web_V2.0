import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";

export async function PATCH(req: NextRequest, props: any) {
  try {
    // Authentication & Authorization
    const authError = requireAuth(req);
    if (authError) return authError;

    const roleError = requireRole(req, [UserRole.SUPERADMIN, UserRole.EDITOR]);
    if (roleError) return roleError;

    const params = await props.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const { status, organizationId, notes } = body;

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status harus 'accepted' atau 'rejected'" },
        { status: 400 }
      );
    }

    // Fetch full application data
    const fullApplication = await db.membershipApplication.findUnique({
      where: { id },
    } as any);

    if (!fullApplication) {
      return NextResponse.json(
        { error: "Pendaftaran member tidak ditemukan" },
        { status: 404 }
      );
    }

    // If accepting, organizationId is required
    if (status === "accepted" && !organizationId) {
      return NextResponse.json(
        { error: "organizationId diperlukan untuk menerima pendaftaran" },
        { status: 400 }
      );
    }

    // Update application status
    const updated = await db.membershipApplication.update({
      where: { id },
      data: {
        status: status as any,
        reviewedAt: new Date(),
        notes: notes || fullApplication.notes,
      },
    } as any);

    // If accepted, create Member record
    if (status === "accepted") {
      // Verify organization exists
      const organization = await db.strukturOrganisasi.findUnique({
        where: { id: organizationId },
      });

      if (!organization) {
        return NextResponse.json(
          { error: "Organisasi tidak ditemukan" },
          { status: 404 }
        );
      }

      // Create new member
      const newMember = await db.member.create({
        data: {
          fullName: fullApplication.fullName,
          email: fullApplication.email || null,
          phone: fullApplication.phone || null,
          address: fullApplication.address || null,
          dateOfBirth: fullApplication.dateOfBirth || null,
          gender: fullApplication.gender || null,
          nik: fullApplication.nik || null,
          occupation: fullApplication.occupation || null,
          status: "active" as any,
          strukturId: organizationId,
        },
      } as any);

      // Link member to application
      await db.membershipApplication.update({
        where: { id },
        data: {
          memberId: newMember.id,
        },
      } as any);

      return NextResponse.json({
        success: true,
        message: "Pendaftaran diterima dan member berhasil ditambahkan ke organisasi",
        data: {
          application: updated,
          member: newMember,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message:
        status === "accepted"
          ? "Pendaftaran berhasil diterima"
          : "Pendaftaran berhasil ditolak",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating member application status:", error);
    return NextResponse.json(
      {
        error: "Gagal update status member",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
