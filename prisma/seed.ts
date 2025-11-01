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

const db = new PrismaClient();

async function main() {
  await clearAll(db);

  // 1. Users - ADMIN ACCOUNTS
  const { superadmin, editor, analyst } = await seedUsers(db);
  console.log("✅ Seeded admin users:", { superadmin: superadmin.email, editor: editor.email, analyst: analyst.email });

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

  // // 8. News
  // await seedNews(db, superadmin.id);

  // // 9. Activities & Media
  // await seedActivities(db);

  // // 10. CMS
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
