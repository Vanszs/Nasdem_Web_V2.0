import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import {
  UserRole,
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from "@/lib/rbac";
import {
  AuthenticationError,
  AuthorizationError,
  formatErrorResponse,
} from "@/lib/error-handler";

// Enforce JWT_SECRET - throw error if not set
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Token blacklist storage (in production, use Redis)
const tokenBlacklist = new Set<string>();

export function addToBlacklist(token: string) {
  tokenBlacklist.add(token);
}

export function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token);
}

export async function requireAuth(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      throw new AuthenticationError("Authentication required");
    }

    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
      throw new AuthenticationError("Token has been revoked");
    }

    const decoded = jwt.verify(token, JWT_SECRET!) as {
      userId: number;
      role: string;
      iat: number;
      exp: number;
    };

    // Additional check for token expiry (redundant but explicit)
    if (decoded.exp * 1000 < Date.now()) {
      throw new AuthenticationError("Token expired");
    }

    // Verify user still exists and not soft-deleted
    const userRecord = await db.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!userRecord || userRecord.deletedAt) {
      throw new AuthenticationError("User not found or deactivated");
    }

    // Attach user with role from DB (authoritative)
    (req as any).user = {
      userId: userRecord.id,
      role: (userRecord.role?.toString?.().toUpperCase?.() ||
        decoded.role) as UserRole,
    };

    return null; // request diteruskan
  } catch (err: any) {
    // Different error messages for different scenarios
    if (err.name === "TokenExpiredError") {
      return NextResponse.json(
        { success: false, error: "Token expired" },
        { status: 401 }
      );
    }
    if (err.name === "JsonWebTokenError") {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }
    if (err instanceof AuthenticationError) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 401 }
    );
  }
}

export function requireRole(req: NextRequest, allowedRoles: UserRole[]) {
  const user = (req as any).user;
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { success: false, error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  return null; // request diteruskan
}

// Permission-based middleware functions
export function requirePermission(permission: Permission) {
  return (req: NextRequest) => {
    const user = (req as any).user;
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!hasPermission(user.role, permission)) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    return null;
  };
}

export function requireAnyPermission(permissions: Permission[]) {
  return (req: NextRequest) => {
    const user = (req as any).user;
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!hasAnyPermission(user.role, permissions)) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    return null;
  };
}

export function requireAllPermissions(permissions: Permission[]) {
  return (req: NextRequest) => {
    const user = (req as any).user;
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!hasAllPermissions(user.role, permissions)) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    return null;
  };
}

// Role hierarchy for more granular control
export const ROLE_HIERARCHY = {
  [UserRole.SUPERADMIN]: 3,
  [UserRole.EDITOR]: 2,
  [UserRole.ANALYST]: 1,
};

export function hasMinimumRole(
  userRole: UserRole,
  minimumRole: UserRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}

export function requireMinimumRole(req: NextRequest, minimumRole: UserRole) {
  const user = (req as any).user;
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  if (!hasMinimumRole(user.role, minimumRole)) {
    return NextResponse.json(
      { success: false, error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  return null;
}

// Helper function to check if user can access a specific resource
export function requireResourceAccess(resourceType: string, action: string) {
  return (req: NextRequest, resourceId?: number) => {
    const user = (req as any).user;
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // This would need to be implemented based on your specific requirements
    // For now, just check role-based permissions
    const permission = `${resourceType}:${action}` as Permission;

    if (!hasPermission(user.role, permission)) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    return null;
  };
}

// Optional auth: return user if a valid token exists, otherwise null (no errors thrown)
export function getUserIfAuthenticated(
  req: NextRequest
): { userId: number; role: UserRole } | null {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    if (isTokenBlacklisted(token)) return null;

    const decoded = jwt.verify(token, JWT_SECRET!) as {
      userId: number;
      role: string;
      iat?: number;
      exp?: number;
    };

    if (decoded?.exp && decoded.exp * 1000 < Date.now()) return null;

    return {
      userId: decoded.userId,
      role: decoded.role as UserRole,
    };
  } catch {
    // Any verification error -> treat as unauthenticated
    return null;
  }
}
