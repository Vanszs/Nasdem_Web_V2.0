import { PrismaClient } from "@prisma/client";
import { seedBothPrograms, seedKipRegistrations, seedPipRegistrations } from "./seed/seed-kip";

const db = new PrismaClient();

async function main() {
  console.log("🎓 Starting PIP & KIP seed...");

  // Check if we need to create a temporary member as coordinator
  let member = await db.member.findFirst({ orderBy: { id: "asc" } });
  if (!member) {
    console.log("⚠️ No member found, creating temporary coordinator...");
    
    // Get first struktur
    const struktur = await db.strukturOrganisasi.findFirst();
    if (!struktur) {
      throw new Error("No struktur found. Please seed struktur first.");
    }

    member = await db.member.create({
      data: {
        fullName: "Koordinator Program",
        nik: "9999999999999999",
        email: "koordinator.program@nasdem-sidoarjo.or.id",
        phone: "081234567890",
        dateOfBirth: new Date("1980-01-01"),
        gender: "male",
        address: "Sidoarjo",
        strukturId: struktur.id,
      },
    });
    console.log("✅ Created temporary coordinator:", member.fullName);
  }

  // Seed Both PIP & KIP Programs
  const { pipProgram, kipProgram } = await seedBothPrograms(db);
  
  // Seed PIP Registrations
  await seedPipRegistrations(db, pipProgram.id);
  
  // Seed KIP Registrations
  await seedKipRegistrations(db, kipProgram.id);

  console.log("✅ PIP & KIP seeding complete!");
  console.log(`📊 Program IDs: PIP=${pipProgram.id}, KIP=${kipProgram.id}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
