import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { UserRole } from "@/lib/rbac";
import { z } from "zod";
import { GenderEnum } from "@prisma/client";

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
  search: z.string().trim().optional(),
  status: z.enum(["pending", "completed"]).optional(),
  programId: z.coerce.number().int().optional(),
});

const bodySchema = z.object({
  programId: z.coerce.number().int({ message: "Program wajib dipilih" }),
  fullName: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email().optional().nullable(),
  nik: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.nativeEnum(GenderEnum).optional().nullable(),
  occupation: z.string().optional().nullable(),
  familyMemberCount: z.coerce.number().int().min(0).optional().nullable(),
  proposerName: z.string().optional().nullable(),
  fullAddress: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(["pending", "completed"]).default("pending"),
});

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [
    UserRole.EDITOR,
    UserRole.SUPERADMIN,
    UserRole.ANALYST,
  ]);
  if (roleError) return roleError;

  try {
    const raw = Object.fromEntries(req.nextUrl.searchParams.entries());
    const parsed = listQuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }
    const q = parsed.data;
    const page = Number(q.page ?? 1);
    const pageSize = Number(q.pageSize ?? 20);
    const { search, status, programId } = q;

    const AND: any[] = [];
    if (search) {
      AND.push({
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
          { nik: { contains: search, mode: "insensitive" } },
          { fullAddress: { contains: search, mode: "insensitive" } },
          { proposerName: { contains: search, mode: "insensitive" } },
        ],
      });
    }
    if (status) AND.push({ status });
    if (programId) AND.push({ programId });

    const where = AND.length ? { AND } : {};

    const [total, data] = await Promise.all([
      db.programBenefitRecipient.count({ where }),
      db.programBenefitRecipient.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: { receivedAt: "desc" },
        include: {
          program: { select: { id: true, category: true, name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (e) {
    console.error("/api/beneficiaries GET error", e);
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid body",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }
    const b = parsed.data as z.infer<typeof bodySchema>;

    const created = await db.programBenefitRecipient.create({
      data: {
        programId: b.programId,
        fullName: b.fullName,
        email: b.email ?? undefined,
        nik: b.nik ?? undefined,
        phone: b.phone ?? undefined,
        dateOfBirth: b.dateOfBirth
          ? new Date(String(b.dateOfBirth))
          : undefined,
        gender: (b.gender as any) ?? undefined,
        occupation: b.occupation ?? undefined,
        familyMemberCount: b.familyMemberCount ?? undefined,
        proposerName: b.proposerName ?? undefined,
        fullAddress: b.fullAddress ?? undefined,
        notes: b.notes ?? undefined,
        status: b.status as any,
      } as any,
      select: { id: true },
    });
    return NextResponse.json({ success: true, data: created });
  } catch (e) {
    console.error("/api/beneficiaries POST error", e);
    return NextResponse.json(
      { success: false, error: "Failed to create" },
      { status: 500 }
    );
  }
}
