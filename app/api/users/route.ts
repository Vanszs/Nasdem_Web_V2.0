import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import { z } from "zod";
import { UserRole } from "@/lib/rbac";
import { pickEnumValue } from "@/lib/parsers";

// Validation schemas
const createUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username too long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  ),
  role: z.enum(["superadmin", "editor", "analyst"], {
    errorMap: () => ({ message: "Invalid role" })
  }),
});

// list semua user
export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.SUPERADMIN]);
  if (roleError) return roleError;
  
  try {
    const url = req.nextUrl;
    const page = Math.max(parseInt(url.searchParams.get("page") || "1"), 1);
    const pageSize = Math.min(
      Math.max(parseInt(url.searchParams.get("pageSize") || "20"), 1),
      100
    );
    const search = url.searchParams.get("search")?.trim() || "";
    const role = url.searchParams.get("role") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    const roleFilter = pickEnumValue(role, Object.values(UserRole));
    if (roleFilter) where.role = roleFilter;

    const [total, users] = await Promise.all([
      db.user.count({ where }),
      db.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      }
    });
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// create user baru
export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const roleError = requireRole(req, [UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const body = await req.json();
    
    // Validate input
    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input data", details: validation.error.errors },
        { status: 400 }
      );
    }
    
    const { username, email, password, role } = validation.data;

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    // Increased salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: { username, email, password: hashedPassword, role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (err: any) {
    console.error("Error creating user:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
