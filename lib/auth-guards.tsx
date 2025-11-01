"use client";

/**
 * Role-Based Access Control Guards
 * Provides components and hooks for granular permission checking
 */

import { ReactNode } from "react";
import { useAuth } from "@/lib/providers/UnifiedAuthProvider";
import { UserRole } from "@/lib/rbac";
import { authLogger } from "@/lib/auth-logger";
import { useRouter } from "next/navigation";

// ============================================================================
// Type Definitions
// ============================================================================

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole | UserRole[];
  fallback?: ReactNode;
  redirectTo?: string;
  showFallback?: boolean; // If true, show fallback instead of redirecting
}

interface PermissionGuardProps {
  children: ReactNode;
  requireAll?: boolean; // If true, user must have ALL roles
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

// ============================================================================
// Role Guard Component
// ============================================================================

/**
 * Guards content based on user role
 * Redirects or shows fallback if user doesn't have required role
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
  redirectTo,
  showFallback = true,
}: RoleGuardProps) {
  const { user, hasRole, isAuthenticated } = useAuth();
  const router = useRouter();

  // Not authenticated
  if (!isAuthenticated || !user) {
    if (redirectTo) {
      router.push(redirectTo);
      return null;
    }
    return showFallback ? <>{fallback}</> : null;
  }

  // Check role
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasRequiredRole = hasRole(roles);

  if (!hasRequiredRole) {
    authLogger.roleCheckFailed(
      user.id,
      roles.join(", "),
      user.role,
      window.location.pathname
    );

    if (redirectTo) {
      router.push(redirectTo);
      return null;
    }

    return showFallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

// ============================================================================
// Permission Guard Component
// ============================================================================

/**
 * Guards content based on multiple role requirements
 */
export function PermissionGuard({
  children,
  requireAll = false,
  allowedRoles,
  fallback = null,
}: PermissionGuardProps) {
  const { user, hasRole } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  const hasPermission = requireAll
    ? allowedRoles.every((role) => hasRole(role))
    : allowedRoles.some((role) => hasRole(role));

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// ============================================================================
// Minimum Role Guard Component
// ============================================================================

/**
 * Guards content based on minimum role level
 * Uses role hierarchy from AUTH_CONFIG
 */
export function MinimumRoleGuard({
  children,
  minimumRole,
  fallback = null,
}: {
  children: ReactNode;
  minimumRole: UserRole;
  fallback?: ReactNode;
}) {
  const { user, hasMinimumRole } = useAuth();

  if (!user || !hasMinimumRole(minimumRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// ============================================================================
// Conditional Render Based on Role
// ============================================================================

/**
 * Conditionally render content based on user role
 * More flexible than guards - doesn't redirect or log
 */
export function RoleContent({
  children,
  roles,
  fallback = null,
}: {
  children: ReactNode;
  roles: UserRole | UserRole[];
  fallback?: ReactNode;
}) {
  const { hasRole } = useAuth();

  const roleArray = Array.isArray(roles) ? roles : [roles];

  if (!hasRole(roleArray)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// ============================================================================
// Role-Specific Components
// ============================================================================

/**
 * Only visible to superadmins
 */
export function SuperAdminOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleContent roles={UserRole.SUPERADMIN} fallback={fallback}>
      {children}
    </RoleContent>
  );
}

/**
 * Only visible to editors and superadmins
 */
export function EditorOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleContent roles={[UserRole.SUPERADMIN, UserRole.EDITOR]} fallback={fallback}>
      {children}
    </RoleContent>
  );
}

/**
 * Visible to all authenticated users
 */
export function AuthenticatedOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// ============================================================================
// Higher-Order Component for Role Protection
// ============================================================================

/**
 * HOC to wrap components with role-based access control
 */
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole | UserRole[],
  fallback?: ReactNode
) {
  return function GuardedComponent(props: P) {
    const { hasRole, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return fallback || <div>Not authenticated</div>;
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!hasRole(roles)) {
      return fallback || <div>Access denied</div>;
    }

    return <Component {...props} />;
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if current user can perform an action
 */
export function useCanPerform(action: string, resource?: string): boolean {
  const { user, hasMinimumRole } = useAuth();

  if (!user) return false;

  // Define action permissions
  const actionPermissions: Record<string, UserRole> = {
    create: UserRole.EDITOR,
    edit: UserRole.EDITOR,
    delete: UserRole.SUPERADMIN,
    view: UserRole.ANALYST,
    manage_users: UserRole.SUPERADMIN,
    manage_roles: UserRole.SUPERADMIN,
    publish: UserRole.EDITOR,
    draft: UserRole.EDITOR,
  };

  const requiredRole = actionPermissions[action] || UserRole.SUPERADMIN;
  return hasMinimumRole(requiredRole);
}

/**
 * Get accessible routes based on user role
 */
export function useAccessibleRoutes(): string[] {
  const { user } = useAuth();

  if (!user) return [];

  const routesByRole: Record<UserRole, string[]> = {
    [UserRole.SUPERADMIN]: [
      "/admin",
      "/admin/news",
      "/admin/gallery",
      "/admin/programs",
      "/admin/organizations",
      "/admin/user",
      "/admin/statistik-pemilu",
      "/admin/beneficiaries",
      "/admin/landing",
      "/admin/pending-requests",
    ],
    [UserRole.EDITOR]: [
      "/admin",
      "/admin/news",
      "/admin/gallery",
      "/admin/programs",
      "/admin/organizations",
      "/admin/beneficiaries",
      "/admin/landing",
    ],
    [UserRole.ANALYST]: ["/admin", "/admin/statistik-pemilu"],
  };

  return routesByRole[user.role] || [];
}

// ============================================================================
// Permission Hooks
// ============================================================================

/**
 * Hook to check if user has specific role
 */
export function useHasRole(role: UserRole | UserRole[]): boolean {
  const { hasRole } = useAuth();
  return hasRole(role);
}

/**
 * Hook to check if user has minimum role level
 */
export function useHasMinimumRole(minRole: UserRole): boolean {
  const { hasMinimumRole } = useAuth();
  return hasMinimumRole(minRole);
}

/**
 * Hook to get current user's role
 */
export function useUserRole(): UserRole | null {
  const { user } = useAuth();
  return user?.role || null;
}
