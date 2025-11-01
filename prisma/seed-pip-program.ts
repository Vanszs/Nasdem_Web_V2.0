import { db } from "../lib/db";

/**
 * Seed Program Pendidikan PIP untuk testing
 */
async function seedPipProgram() {
  console.log("🌱 Seeding Program PIP (Pendidikan)...\n");

  try {
    // Check if program already exists
    const existingProgram = await db.program.findFirst({
      where: {
        name: "Program Indonesia Pintar (PIP) 2025",
      },
    });

    if (existingProgram) {
      console.log("⏭️  Program PIP already exists:");
      console.log(`   ID: ${existingProgram.id}`);
      console.log(`   Name: ${existingProgram.name}`);
      console.log(`   Category: ${existingProgram.category}`);
      console.log("\n✅ No need to seed.");
      return;
    }

    // Check if coordinator exists (use first member as coordinator)
    let coordinatorId = 1;
    const coordinator = await db.member.findFirst({
      orderBy: { id: "asc" },
    });

    if (coordinator) {
      coordinatorId = coordinator.id;
      console.log(`✅ Using coordinator: ${coordinator.fullName} (ID: ${coordinatorId})`);
    } else {
      console.log("⚠️  No member found in database. Creating dummy coordinator...");
      const dummyCoordinator = await db.member.create({
        data: {
          fullName: "Admin Koordinator PIP",
          email: "admin.pip@nasdemsidoarjo.id",
          phone: "081234567890",
          address: "Sidoarjo",
          status: "active",
        },
      });
      coordinatorId = dummyCoordinator.id;
      console.log(`✅ Created dummy coordinator: ID ${coordinatorId}`);
    }

    // Create PIP Program
    const program = await db.program.create({
      data: {
        name: "Program Indonesia Pintar (PIP) 2025",
        category: "pendidikan",
        description: "Program bantuan pendidikan untuk siswa kurang mampu di Kabupaten Sidoarjo dari DPD Partai NasDem Sidoarjo. Meliputi bantuan biaya pendidikan untuk jenjang SD, SMP, SMA, dan SMK.",
        target: 500,
        currentTarget: 0,
        budget: 500000000, // 500 juta rupiah
        status: "ongoing",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        photoUrl: "/uploads/programs/pip-2025.jpg",
        coordinatorId: coordinatorId,
      },
    });

    console.log("\n✅ Program PIP created successfully!\n");
    console.log(`   ID: ${program.id}`);
    console.log(`   Name: ${program.name}`);
    console.log(`   Category: ${program.category}`);
    console.log(`   Status: ${program.status}`);
    console.log(`   Target: ${program.target} siswa`);
    console.log(`   Budget: Rp ${program.budget.toLocaleString()}`);
    console.log("\n🎉 Now you can register for PIP using programId: " + program.id);
    console.log(`   URL: http://localhost:3000/pendaftaran-pip?programId=${program.id}`);
  } catch (error: any) {
    console.error("❌ Error seeding program:", error.message);
    console.error(error);
  } finally {
    await db.$disconnect();
  }
}

seedPipProgram();
