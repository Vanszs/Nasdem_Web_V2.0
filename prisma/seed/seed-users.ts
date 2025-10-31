import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "./helpers";

export async function seedUsers(db: PrismaClient) {
  const [superadminHash, editorHash, analystHash] = await Promise.all([
    hash(process.env.SEED_SUPERADMIN_PASSWORD || "Nasdem!123"),
    hash(process.env.SEED_EDITOR_PASSWORD || "Editor!123"),
    hash(process.env.SEED_ANALYST_PASSWORD || "Analyst!123"),
  ]);

  const [superadmin, editor, analyst] = await Promise.all([
    db.user.create({
      data: {
        username: "superadmin",
        email: "superadmin@nasdem.local",
        password: superadminHash,
        role: UserRole.superadmin,
      },
    }),
    db.user.create({
      data: {
        username: "editor",
        email: "editor@nasdem.local",
        password: editorHash,
        role: UserRole.editor,
      },
    }),
    db.user.create({
      data: {
        username: "analyst",
        email: "analyst@nasdem.local",
        password: analystHash,
        role: UserRole.analyst,
      },
    }),
  ]);

  return { superadmin, editor, analyst };
}
