import { PrismaClient } from "@prisma/client";

export async function clearAll(db: PrismaClient) {
  console.log("🧹 Clearing old data...");

  //   await db.programBenefitRecipient.deleteMany();
  //   await db.dprdCalegResult.deleteMany();
  //   await db.dprdPartyResult.deleteMany();
  //   await db.dprdElectionAnalysis.deleteMany();
  //   await db.tps.deleteMany();
  //   await db.desa.deleteMany();
  //   await db.kecamatan.deleteMany();
  //   await db.dapil.deleteMany();
  //   await db.caleg.deleteMany();
  // Clear new gallery tables (using any to avoid strict typing if not generated)
  //   await (db as any).activityMedia.deleteMany();
  //   await (db as any).activity.deleteMany();
  //   await db.news.deleteMany();
  //   await db.program.deleteMany();
  await db.member.deleteMany();
  await db.strukturOrganisasi.deleteMany();
  await db.region.deleteMany();
  await db.sayapType.deleteMany();
  //   await db.party.deleteMany();
  //   await db.user.deleteMany();
  //   await db.cmsAbout.deleteMany();
  //   await db.cmsContact.deleteMany();
  //   await db.cmsHeroBanner.deleteMany();
  //   await db.activity.deleteMany();
  //   await db.activityMedia.deleteMany();

  console.log("✅ All tables truncated.");
}

export async function hash(password: string) {
  const bcrypt = await import("bcrypt");
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
  return bcrypt.hash(password, rounds);
}

export type SeededTaxonomy = {
  kabupaten: { id: number } | null;
  kecamatanList: Array<{ id: number; name: string }>;
  desaList: Array<{ id: number; name: string }>;
  sayapTypes: Array<{ id: number; name: string }>;
};
