import { z } from "zod";

// Common validation patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const phoneRegex = /^\+?[\d\s\-\(\)]+$/;

// Base schemas
export const baseSchemas = {
  id: z.coerce.number().int().positive("ID must be a positive integer"),
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(passwordRegex, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username too long")
    .regex(usernameRegex, "Username can only contain letters, numbers, and underscores"),
  phone: z.string().regex(phoneRegex, "Invalid phone number format").optional().nullable(),
  name: z.string().min(1, "Name is required").max(150, "Name too long"),
  url: z.string().url("Invalid URL format").optional().nullable(),
  date: z.string().datetime("Invalid date format").optional().nullable(),
  boolean: z.coerce.boolean(),
  pagination: z.object({
    page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
    pageSize: z.coerce.number().int().min(1, "Page size must be at least 1").max(100, "Page size cannot exceed 100").default(20),
  }),
};

// User validation schemas
export const userSchemas = {
  create: z.object({
    username: baseSchemas.username,
    email: baseSchemas.email,
    password: baseSchemas.password,
    role: z.enum(["superadmin", "editor", "analyst"], {
      errorMap: () => ({ message: "Invalid role" })
    }),
  }),
  update: z.object({
    username: baseSchemas.username.optional(),
    email: baseSchemas.email.optional(),
    password: baseSchemas.password.optional(),
    role: z.enum(["superadmin", "editor", "analyst"]).optional(),
  }),
  login: z.object({
    email: baseSchemas.email,
    password: z.string().min(1, "Password is required"),
  }),
  list: z.object({
    search: z.string().optional(),
    role: z.enum(["superadmin", "editor", "analyst"]).optional(),
    ...baseSchemas.pagination.shape,
  }),
};

// Member validation schemas
export const memberSchemas = {
  create: z.object({
    fullName: baseSchemas.name,
    email: baseSchemas.email.optional(),
    phone: baseSchemas.phone,
    dateOfBirth: baseSchemas.date,
    address: z.string().max(500, "Address too long").optional(),
    bio: z.string().max(2000, "Bio too long").optional(),
    gender: z.enum(["male", "female"]).optional(),
    status: z.enum(["active", "inactive", "suspended"]).default("active"),
    strukturId: baseSchemas.id.optional(),
    photoUrl: baseSchemas.url,
    joinDate: baseSchemas.date,
    endDate: baseSchemas.date.optional(),
  }),
  update: z.object({
    fullName: baseSchemas.name.optional(),
    email: baseSchemas.email.optional(),
    phone: baseSchemas.phone.optional(),
    dateOfBirth: baseSchemas.date.optional(),
    address: z.string().max(500, "Address too long").optional(),
    bio: z.string().max(2000, "Bio too long").optional(),
    gender: z.enum(["male", "female"]).optional(),
    status: z.enum(["active", "inactive", "suspended"]).optional(),
    strukturId: baseSchemas.id.optional(),
    photoUrl: baseSchemas.url.optional(),
    joinDate: baseSchemas.date.optional(),
    endDate: baseSchemas.date.optional(),
  }),
  list: z.object({
    search: z.string().optional(),
    status: z.enum(["active", "inactive", "suspended"]).optional(),
    gender: z.enum(["male", "female"]).optional(),
    level: z.enum(["dpd", "sayap", "dpc", "dprt", "kader"]).optional(),
    position: z.enum(["ketua", "sekretaris", "bendahara", "wakil", "anggota"]).optional(),
    sayapTypeId: baseSchemas.id.optional(),
    regionId: baseSchemas.id.optional(),
    struktur: baseSchemas.boolean.optional(),
    ...baseSchemas.pagination.shape,
  }),
};

// News validation schemas
export const newsSchemas = {
  create: z.object({
    title: z.string().min(1, "Title is required").max(255, "Title too long"),
    content: z.string().optional(),
    publishDate: baseSchemas.date,
    thumbnailUrl: baseSchemas.url,
  }),
  update: z.object({
    title: z.string().min(1, "Title is required").max(255, "Title too long").optional(),
    content: z.string().optional(),
    publishDate: baseSchemas.date.optional(),
    thumbnailUrl: baseSchemas.url.optional(),
  }),
  list: z.object({
    search: z.string().optional(),
    ...baseSchemas.pagination.shape,
  }),
};

// Program validation schemas
export const programSchemas = {
  create: z.object({
    title: z.string().min(1, "Title is required").max(255, "Title too long"),
    description: z.string().max(2000, "Description too long").optional(),
    startDate: baseSchemas.date,
    endDate: baseSchemas.date.optional(),
    photoUrl: baseSchemas.url,
    categoryId: baseSchemas.id.optional(),
  }),
  update: z.object({
    title: z.string().min(1, "Title is required").max(255, "Title too long").optional(),
    description: z.string().max(2000, "Description too long").optional(),
    startDate: baseSchemas.date.optional(),
    endDate: baseSchemas.date.optional(),
    photoUrl: baseSchemas.url.optional(),
    categoryId: baseSchemas.id.optional(),
  }),
  list: z.object({
    search: z.string().optional(),
    categoryId: baseSchemas.id.optional(),
    ...baseSchemas.pagination.shape,
  }),
};

// Gallery validation schemas
export const gallerySchemas = {
  create: z.object({
    type: z.enum(["foto", "video"]).default("foto"),
    url: baseSchemas.url,
    caption: z.string().max(500, "Caption too long").optional(),
    uploadDate: baseSchemas.date,
  }),
  update: z.object({
    type: z.enum(["foto", "video"]).optional(),
    url: baseSchemas.url.optional(),
    caption: z.string().max(500, "Caption too long").optional(),
    uploadDate: baseSchemas.date.optional(),
  }),
  list: z.object({
    type: z.enum(["foto", "video"]).optional(),
    ...baseSchemas.pagination.shape,
  }),
};

// Upload validation schemas
export const uploadSchemas = {
  image: z.object({
    scope: z.enum(["member", "program", "struktur", "caleg"]).optional(),
  }),
};

// Helper function to validate and transform request data
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  details?: any;
} {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false,
      error: "Invalid input data",
      details: result.error.errors,
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
}

// Helper function to extract query parameters safely
export function extractQueryParams<T>(schema: z.ZodSchema<T>, searchParams: URLSearchParams): T {
  const params: Record<string, any> = {};
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return schema.parse(params);
}