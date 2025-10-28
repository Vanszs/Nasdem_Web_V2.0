import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export interface UploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
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
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return buffer.toString("ascii", 1, 4) === "PNG";
  }
  if (mimeType === "image/webp") {
    return (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }
  return false;
}

/**
 * Upload file to public directory
 * @param file - File object from FormData
 * @param folder - Subfolder in /public/uploads/ (e.g., 'ktp', 'documents')
 * @returns UploadResult with url and filename or error
 */
export async function uploadFile(
  file: File,
  folder: string = "ktp"
): Promise<UploadResult> {
  try {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Tipe file harus JPG, PNG, atau WebP",
      };
    }

    // Validate file extension
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        success: false,
        error: "Ekstensi file tidak diizinkan",
      };
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return {
        success: false,
        error: "Ukuran file maksimal 5MB",
      };
    }

    // Minimum file size check
    if (file.size < 100) {
      return {
        success: false,
        error: "File terlalu kecil atau corrupt",
      };
    }

    // Read file content
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate file content to prevent file type spoofing
    if (!validateFileContent(buffer, file.type)) {
      return {
        success: false,
        error: "Konten file tidak sesuai dengan tipe yang dideklarasikan",
      };
    }

    // Generate secure filename
    const filename = generateSecureFilename(file.name);

    // Create upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });

    // Write file
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer, { mode: 0o644 });

    // Return public URL
    const publicUrl = `/uploads/${folder}/${filename}`;

    return {
      success: true,
      url: publicUrl,
      filename,
    };
  } catch (err: any) {
    console.error("Upload error:", err);
    return {
      success: false,
      error: "Gagal mengunggah file",
    };
  }
}

/**
 * Delete file from public directory
 * @param fileUrl - Public URL of the file (e.g., /uploads/ktp/filename.jpg)
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl || !fileUrl.startsWith("/uploads/")) {
      return false;
    }

    const filepath = path.join(process.cwd(), "public", fileUrl);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return true;
    }
    
    return false;
  } catch (err) {
    console.error("Delete file error:", err);
    return false;
  }
}
