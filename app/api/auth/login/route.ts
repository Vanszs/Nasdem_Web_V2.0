import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await db.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
