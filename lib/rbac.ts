// Role-Based Access Control (RBAC) System
// This file defines the permissions matrix for different user roles

export enum UserRole {
  SUPERADMIN = "superadmin",
  EDITOR = "editor",
  ANALYST = "analyst",
}

export enum Permission {
  // User Management
  USER_READ = "user:read",
  USER_CREATE = "user:create",
  USER_UPDATE = "user:update",
  USER_DELETE = "user:delete",
  USER_LIST = "user:list",
  
  // Member Management
  MEMBER_READ = "member:read",
  MEMBER_CREATE = "member:create",
  MEMBER_UPDATE = "member:update",
  MEMBER_DELETE = "member:delete",
  MEMBER_LIST = "member:list",
  MEMBER_EXPORT = "member:export",
  
  // News Management
  NEWS_READ = "news:read",
  NEWS_CREATE = "news:create",
  NEWS_UPDATE = "news:update",
  NEWS_DELETE = "news:delete",
  NEWS_LIST = "news:list",
  NEWS_PUBLISH = "news:publish",
  
  // Program Management
  PROGRAM_READ = "program:read",
  PROGRAM_CREATE = "program:create",
  PROGRAM_UPDATE = "program:update",
  PROGRAM_DELETE = "program:delete",
  PROGRAM_LIST = "program:list",
  
  // Gallery Management
  GALLERY_READ = "gallery:read",
  GALLERY_CREATE = "gallery:create",
  GALLERY_UPDATE = "gallery:update",
  GALLERY_DELETE = "gallery:delete",
  GALLERY_LIST = "gallery:list",
  
  // Upload Management
  UPLOAD_IMAGE = "upload:image",
  UPLOAD_FILE = "upload:file",
  
  // Analytics & Reports
  ANALYTICS_READ = "analytics:read",
  ANALYTICS_EXPORT = "analytics:export",
  
  // System Settings
  SYSTEM_SETTINGS = "system:settings",
  SYSTEM_AUDIT = "system:audit",
}

// Permission matrix - defines which roles have which permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPERADMIN]: [
    // Superadmin has all permissions
    Permission.USER_READ,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_LIST,
    
    Permission.MEMBER_READ,
    Permission.MEMBER_CREATE,
    Permission.MEMBER_UPDATE,
    Permission.MEMBER_DELETE,
    Permission.MEMBER_LIST,
    Permission.MEMBER_EXPORT,
    
    Permission.NEWS_READ,
    Permission.NEWS_CREATE,
    Permission.NEWS_UPDATE,
    Permission.NEWS_DELETE,
    Permission.NEWS_LIST,
    Permission.NEWS_PUBLISH,
    
    Permission.PROGRAM_READ,
    Permission.PROGRAM_CREATE,
    Permission.PROGRAM_UPDATE,
    Permission.PROGRAM_DELETE,
    Permission.PROGRAM_LIST,
    
    Permission.GALLERY_READ,
    Permission.GALLERY_CREATE,
    Permission.GALLERY_UPDATE,
    Permission.GALLERY_DELETE,
    Permission.GALLERY_LIST,
    
    Permission.UPLOAD_IMAGE,
    Permission.UPLOAD_FILE,
    
    Permission.ANALYTICS_READ,
    Permission.ANALYTICS_EXPORT,
    
    Permission.SYSTEM_SETTINGS,
    Permission.SYSTEM_AUDIT,
  ],
  
  [UserRole.EDITOR]: [
    // Editor can manage most content but not users or system settings
    Permission.MEMBER_READ,
    Permission.MEMBER_CREATE,
    Permission.MEMBER_UPDATE,
    Permission.MEMBER_DELETE,
    Permission.MEMBER_LIST,
    Permission.MEMBER_EXPORT,
    
    Permission.NEWS_READ,
    Permission.NEWS_CREATE,
    Permission.NEWS_UPDATE,
    Permission.NEWS_DELETE,
    Permission.NEWS_LIST,
    Permission.NEWS_PUBLISH,
    
    Permission.PROGRAM_READ,
    Permission.PROGRAM_CREATE,
    Permission.PROGRAM_UPDATE,
    Permission.PROGRAM_DELETE,
    Permission.PROGRAM_LIST,
    
    Permission.GALLERY_READ,
    Permission.GALLERY_CREATE,
    Permission.GALLERY_UPDATE,
    Permission.GALLERY_DELETE,
    Permission.GALLERY_LIST,
    
    Permission.UPLOAD_IMAGE,
    Permission.UPLOAD_FILE,
    
    Permission.ANALYTICS_READ,
  ],
  
  [UserRole.ANALYST]: [
    // Analyst has read-only access to most content
    Permission.USER_READ,
    Permission.USER_LIST,
    
    Permission.MEMBER_READ,
    Permission.MEMBER_LIST,
    Permission.MEMBER_EXPORT,
    
    Permission.NEWS_READ,
    Permission.NEWS_LIST,
    
    Permission.PROGRAM_READ,
    Permission.PROGRAM_LIST,
    
    Permission.GALLERY_READ,
    Permission.GALLERY_LIST,
    
    Permission.ANALYTICS_READ,
    Permission.ANALYTICS_EXPORT,
  ],
};

// Helper functions for checking permissions
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

// Middleware functions for checking permissions
export function requirePermission(permission: Permission) {
  return (user: { role: UserRole }): boolean => {
    return hasPermission(user.role, permission);
  };
}

export function requireAnyPermission(permissions: Permission[]) {
  return (user: { role: UserRole }): boolean => {
    return hasAnyPermission(user.role, permissions);
  };
}

export function requireAllPermissions(permissions: Permission[]) {
  return (user: { role: UserRole }): boolean => {
    return hasAllPermissions(user.role, permissions);
  };
}

// Resource-based permission checks
export function canAccessResource(
  user: { role: UserRole, userId?: number },
  resourceType: string,
  resourceId: number,
  action: string
): boolean {
  // Superadmin can access everything
  if (user.role === UserRole.SUPERADMIN) {
    return true;
  }
  
  // For now, implement basic checks
  // In a real system, you might check resource ownership or other attributes
  
  switch (resourceType) {
    case "user":
      // Only superadmin can manage users
      return (user.role as UserRole) === UserRole.SUPERADMIN;
      
    case "member":
      // Editor and superadmin can manage members
      return (user.role as UserRole) === UserRole.EDITOR || (user.role as UserRole) === UserRole.SUPERADMIN;
      
    case "news":
      // Editor and superadmin can manage news
      return (user.role as UserRole) === UserRole.EDITOR || (user.role as UserRole) === UserRole.SUPERADMIN;
      
    case "program":
      // Editor and superadmin can manage programs
      return (user.role as UserRole) === UserRole.EDITOR || (user.role as UserRole) === UserRole.SUPERADMIN;
      
    case "gallery":
      // Editor and superadmin can manage gallery
      return (user.role as UserRole) === UserRole.EDITOR || (user.role as UserRole) === UserRole.SUPERADMIN;
      
    default:
      return false;
  }
}

// Get all permissions for a role
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Check if a role is higher in the hierarchy than another
export function isRoleHigher(role1: UserRole, role2: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.SUPERADMIN]: 3,
    [UserRole.EDITOR]: 2,
    [UserRole.ANALYST]: 1,
  };
  
  return roleHierarchy[role1] > roleHierarchy[role2];
}

// Get the minimum role required for a permission
export function getMinimumRoleForPermission(permission: Permission): UserRole | null {
  for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    if (permissions.includes(permission)) {
      return role as UserRole;
    }
  }
  return null;
}

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  USER_MANAGEMENT: [
    Permission.USER_READ,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_LIST,
  ],
  
  MEMBER_MANAGEMENT: [
    Permission.MEMBER_READ,
    Permission.MEMBER_CREATE,
    Permission.MEMBER_UPDATE,
    Permission.MEMBER_DELETE,
    Permission.MEMBER_LIST,
    Permission.MEMBER_EXPORT,
  ],
  
  CONTENT_MANAGEMENT: [
    Permission.NEWS_READ,
    Permission.NEWS_CREATE,
    Permission.NEWS_UPDATE,
    Permission.NEWS_DELETE,
    Permission.NEWS_LIST,
    Permission.NEWS_PUBLISH,
    Permission.PROGRAM_READ,
    Permission.PROGRAM_CREATE,
    Permission.PROGRAM_UPDATE,
    Permission.PROGRAM_DELETE,
    Permission.PROGRAM_LIST,
    Permission.GALLERY_READ,
    Permission.GALLERY_CREATE,
    Permission.GALLERY_UPDATE,
    Permission.GALLERY_DELETE,
    Permission.GALLERY_LIST,
  ],
  
  UPLOAD_MANAGEMENT: [
    Permission.UPLOAD_IMAGE,
    Permission.UPLOAD_FILE,
  ],
  
  ANALYTICS: [
    Permission.ANALYTICS_READ,
    Permission.ANALYTICS_EXPORT,
  ],
  
  SYSTEM_ADMINISTRATION: [
    Permission.SYSTEM_SETTINGS,
    Permission.SYSTEM_AUDIT,
  ],
};

// Check if a role has all permissions in a group
export function hasPermissionGroup(role: UserRole, group: Permission[]): boolean {
  return hasAllPermissions(role, group);
}