import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";

/**
 * GET /api/registrations/pip/by-nisn/[nisn]
 * Fetch PIP registration data by NISN
 * Used to display full details for accepted PIP beneficiaries
 */
export async function GET(
  req: NextRequest,
  props: any
): Promise<NextResponse> {
  try {
    // Authentication check
    let authError: NextResponse | null;
    authError = await requireAuth(req);
    if (authError) return authError as NextResponse;

    // Role authorization - allow superadmin, editor, analyst
    const roleError = await requireRole(req, [
      UserRole.SUPERADMIN,
      UserRole.EDITOR,
      UserRole.ANALYST,
    ]);
    if (roleError) return roleError as NextResponse;

    // Get NISN from params
    const params = await props.params;
    const nisn = params.nisn;

    if (!nisn) {
      return NextResponse.json(
        { error: "NISN is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching PIP registration for NISN:", nisn);

    // Find PIP registration by NISN (accepted status)
    const pipRegistration = await db.pipRegistration.findFirst({
      where: {
        nisn: nisn,
        status: "accepted" as any,
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    });

    if (!pipRegistration) {
      return NextResponse.json(
        { error: "PIP registration not found for this NISN" },
        { status: 404 }
      );
    }

    console.log("✅ PIP registration found:", pipRegistration.id);

    return NextResponse.json({
      success: true,
      data: pipRegistration,
    });
  } catch (error: any) {
    console.error("❌ Error fetching PIP registration:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
