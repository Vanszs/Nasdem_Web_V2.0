import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { z } from "zod";
import { UserRole } from "@/lib/rbac";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_SIZE = 5 * 1024 * 1024;

// Folder yang diizinkan (key → nama folder fisik di /public/uploads)
const ALLOWED_SCOPES: Record<string, string> = {
  member: "members",
  program: "programs",
  struktur: "struktur",
  caleg: "caleg",
};

function resolveScope(input?: string | null): string {
  if (!input) return ALLOWED_SCOPES.member; // default
  const normalized = input.toLowerCase();
  return ALLOWED_SCOPES[normalized] || ALLOWED_SCOPES.member;
}

// Generate secure random filename
function generateSecureFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const randomString = randomBytes(16).toString("hex");
  return `${timestamp}-${randomString}${ext}`;
}

// Validate file content by reading magic numbers
function validateFileContent(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  }
  if (mimeType === "image/png") {
    return buffer.toString('ascii', 1, 4) === 'PNG';
  }
  if (mimeType === "image/webp") {
    return buffer.toString('ascii', 0, 4) === 'RIFF' &&
           buffer.toString('ascii', 8, 12) === 'WEBP';
  }
  return false;
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, [UserRole.EDITOR, UserRole.SUPERADMIN]);
  if (roleError) return roleError;

  try {
    const urlScope = req.nextUrl.searchParams.get("scope");
    const form = await req.formData();
    const formScope = form.get("scope") as string | null;
    const scopeFolder = resolveScope(formScope || urlScope);

    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { success: false, error: "File is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "File type must be jpg/png/webp" },
        { status: 400 }
      );
    }

    // Validate file extension
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { success: false, error: "File extension not allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Additional validation: minimum file size to prevent empty files
    if (file.size < 100) {
      return NextResponse.json(
        { success: false, error: "File is too small" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate file content to prevent file type spoofing
    if (!validateFileContent(buffer, file.type)) {
      return NextResponse.json(
        { success: false, error: "File content does not match the declared type" },
        { status: 400 }
      );
    }

    // Generate secure filename (don't use user input)
    const filename = generateSecureFilename(file.name);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      scopeFolder
    );

    // Ensure directory exists with proper permissions
    fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });

    const filepath = path.join(uploadDir, filename);
    
    // Write file with proper permissions
    fs.writeFileSync(filepath, buffer, { mode: 0o644 });

    const publicUrl = `/uploads/${scopeFolder}/${filename}`;

    return NextResponse.json({
      success: true,
      scope: scopeFolder,
      url: publicUrl,
      filename,
      size: file.size,
      mime: file.type,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}
