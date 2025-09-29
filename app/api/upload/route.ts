import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/jwt-middleware";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
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

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const roleError = requireRole(req, ["editor", "superadmin"]);
  if (roleError) return roleError;

  try {
    const urlScope = req.nextUrl.searchParams.get("scope");
    const form = await req.formData();
    const formScope = form.get("scope") as string | null;
    const scopeFolder = resolveScope(formScope || urlScope);

    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { success: false, error: "Field 'file' wajib dikirim." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Tipe file harus jpg/png/webp." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Ukuran file maksimal 5MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = (path.extname(file.name || "") || ".jpg").toLowerCase();
    const rawBase = path.basename(file.name || "image", ext);
    const safeBase =
      rawBase.replace(/[^a-z0-9_-]/gi, "").toLowerCase() || "image";
    const filename = `${safeBase}-${Date.now()}${ext}`;

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      scopeFolder
    );
    fs.mkdirSync(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

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
    return NextResponse.json(
      { success: false, error: err.message || "Upload gagal" },
      { status: 500 }
    );
  }
}
