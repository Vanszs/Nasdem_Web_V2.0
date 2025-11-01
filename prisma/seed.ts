import { PrismaClient } from "@prisma/client";
import { clearAll } from "./seed/helpers";
import { seedUsers } from "./seed/seed-users";
import { seedParties } from "./seed/seed-parties";
import { seedSayapAndRegions, seedStructures } from "./seed/seed-taxonomy";
import { seedMembers } from "./seed/seed-members";
import { seedPrograms, seedProgramBeneficiaries } from "./seed/seed-programs";
import { seedNews } from "./seed/seed-news";
import { seedActivities } from "./seed/seed-activities";
import { seedCms } from "./seed/seed-cms";
import { seedDpdDummyMembers } from "./seed/seed-dpd-dummy";
import { seedDpcDummyMembers } from "./seed/seed-dpc-dummy";
import { seedBothPrograms, seedKipRegistrations, seedPipRegistrations } from "./seed/seed-kip";

const db = new PrismaClient();

async function main() {
  // Temporarily skip clearAll to avoid user conflict
  // await clearAll(db);

  // 1. Users - ADMIN ACCOUNTS (skip if already exists)
  let superadmin = await db.user.findFirst({ where: { role: "superadmin" } });
  let editor = await db.user.findFirst({ where: { role: "editor" } });
  let analyst = await db.user.findFirst({ where: { role: "analyst" } });
  
  if (!superadmin || !editor || !analyst) {
    const seeded = await seedUsers(db);
    superadmin = seeded.superadmin;
    editor = seeded.editor;
    analyst = seeded.analyst;
  }
  console.log("✅ Admin users ready:", { superadmin: superadmin.email, editor: editor.email, analyst: analyst.email });

  // // 2. Parties
  // await seedParties(db);

  // 3. Sayap & Regions
  const taxonomy = await seedSayapAndRegions(db);

  // 4. Structures
  const strukturIds = await seedStructures(db, taxonomy);

  // 5. Members
  await seedMembers(db, strukturIds);

  // 5.1. Seed DPD Dummy Members
  await seedDpdDummyMembers(db);

  // 5.2. Seed DPC Dummy Members
  await seedDpcDummyMembers(db);

  // // 6. Programs
  // await seedPrograms(db);

  // // 7. Program beneficiaries
  // await seedProgramBeneficiaries(db);

  // 8. PIP & KIP Programs & Registrations
  const { pipProgram, kipProgram } = await seedBothPrograms(db);
  await seedPipRegistrations(db, pipProgram.id);
  await seedKipRegistrations(db, kipProgram.id);

  // // 9. News
  // await seedNews(db, superadmin.id);

  // // 10. Activities & Media
  // await seedActivities(db);

  // // 11. CMS
  // await seedCms(db);

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
