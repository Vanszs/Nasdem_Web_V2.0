import {
  Prisma,
  PrismaClient,
  UserRole,
  OrgLevel,
  PositionEnum,
  RegionType,
  MemberStatus,
  GenderEnum,
} from "@prisma/client";
import bcrypt from "bcrypt";

const db = new PrismaClient();

async function hash(password: string) {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
  return bcrypt.hash(password, rounds);
}

async function main() {
  console.log("Seeding database...");

  // Hapus data lama agar tidak duplikat
  await db.news.deleteMany({});
  await db.program.deleteMany({});
  await db.gallery.deleteMany({});
  await db.member.deleteMany({});
  await db.strukturOrganisasi.deleteMany({});
  await db.region.deleteMany({});
  await db.sayapType.deleteMany({});
  await db.category.deleteMany({});
  await db.party.deleteMany({});
  await db.user.deleteMany({});

  console.log("Old data cleared.");

  // Lanjutkan seeding users, parties, categories, dll.
  const DEFAULT_SUPERADMIN_PASSWORD =
    process.env.SEED_SUPERADMIN_PASSWORD || "Nasdem!123";
  const DEFAULT_EDITOR_PASSWORD =
    process.env.SEED_EDITOR_PASSWORD || "Editor!123";
  const DEFAULT_ANALYST_PASSWORD =
    process.env.SEED_ANALYST_PASSWORD || "Analyst!123";

  const [superadminHash, editorHash, analystHash] = await Promise.all([
    hash(DEFAULT_SUPERADMIN_PASSWORD),
    hash(DEFAULT_EDITOR_PASSWORD),
    hash(DEFAULT_ANALYST_PASSWORD),
  ]);

  // USERS
  const users = await Promise.all([
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

  const superadmin = users[0];

  // PARTIES, CATEGORY, SAYAP TYPE, REGION, STRUKTUR, MEMBERS
  // Lanjutkan seperti sebelumnya...
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
