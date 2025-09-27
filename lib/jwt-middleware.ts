import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export function requireAuth(roles?: string[]) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return NextResponse.json(
          { success: false, error: "No token provided" },
          { status: 401 }
        );
      }

      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        role: string;
      };

      if (roles && !roles.includes(decoded.role)) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }

      (req as any).user = decoded;

      return null; // request diteruskan
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }
  };
}
