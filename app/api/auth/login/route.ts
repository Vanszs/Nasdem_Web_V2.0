import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { UserRole } from "@/lib/rbac";

// Enforce JWT_SECRET - throw error if not set
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Input validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting for login attempts
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const rateLimitResult = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes
    if (rateLimitResult.limited) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts. Please try again later.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        username: true,
      },
    });

    console.log(user);

    if (!user) {
      // Generic error message to prevent user enumeration
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // Generic error message to prevent user enumeration
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET!,
      {
        expiresIn: "24h",
        issuer: "nasdem-web-v2",
        audience: "nasdem-users",
      }
    );

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role as UserRole,
          username: user.username,
        },
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // Changed from lax to strict for better security
    });

    return response;
  } catch (err: any) {
    // Generic error message for production
    console.error("Login error:", err); // Log for debugging
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
