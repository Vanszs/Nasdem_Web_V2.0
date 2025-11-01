import { PrismaClient, OrgLevel, PositionEnum } from "@prisma/client";

/**
 * Seed dummy data untuk DPC (Dewan Pimpinan Cabang)
 * Mengisi posisi Ketua DPC untuk setiap kecamatan dengan member dummy
 */

const dpcKetuaNames = [
  "H. Ahmad Subagyo, S.H., M.H.",
  "Hj. Sulistyowati, S.E.",
  "Drs. Bambang Tri Handoko",
  "Hj. Nur Aini Hidayati, S.Pd.",
  "H. Agus Supriyanto, S.T.",
  "Ir. Dewi Kusuma Wardani, M.Si.",
  "H. Eko Wahyudi, S.Sos.",
  "Hj. Sri Murtini, S.Pd., M.Pd.",
  "Drs. Hadi Kusuma",
  "Hj. Lilis Suryani, S.H.",
  "H. Taufik Hidayat, S.E., M.M.",
  "Ir. Indah Permatasari, M.T.",
  "H. Yudi Prasetyo, S.Kom.",
  "Hj. Ani Susilowati, S.Pd.",
  "Drs. Supardi, M.Si.",
  "Hj. Rina Kusumawati, S.E.",
  "H. Firman Abdullah, S.H., M.H.",
  "Hj. Maya Sari Dewi, S.Sos.",
];

export async function seedDpcDummyMembers(db: PrismaClient) {
  console.log("🌱 Seeding dummy members for DPC Ketua positions...");

  // Fetch all kecamatan regions
  const kecamatanRegions = await db.region.findMany({
    where: { type: "kecamatan" },
    orderBy: { name: "asc" },
  });

  console.log(`📍 Found ${kecamatanRegions.length} kecamatan regions`);

  // For each kecamatan, find DPC Ketua structure and assign a member
  let assignedCount = 0;

  for (let i = 0; i < kecamatanRegions.length; i++) {
    const kecamatan = kecamatanRegions[i];
    
    // Find DPC Ketua structure for this kecamatan
    const dpcKetua = await db.strukturOrganisasi.findFirst({
      where: {
        level: OrgLevel.dpc,
        regionId: kecamatan.id,
        position: PositionEnum.ketua,
      },
    });

    if (!dpcKetua) {
      console.log(`⚠️  No DPC Ketua structure found for ${kecamatan.name}`);
      continue;
    }

    // Create a dummy member for this ketua
    const ketuaName = dpcKetuaNames[i % dpcKetuaNames.length];
    const member = await db.member.create({
      data: {
        fullName: ketuaName,
        email: `ketua.dpc.${kecamatan.name.toLowerCase().replace(/\s+/g, "")}@nasdem.id`,
        phone: `0812345${String(i + 60).padStart(5, "0")}`,
        photoUrl: null,
        nik: `3515${String(i + 100).padStart(12, "0")}`,
        dateOfBirth: new Date(1965 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), 1),
        gender: i % 2 === 0 ? "male" : "female",
        address: `Jl. Raya ${kecamatan.name} No. ${i + 1}, Sidoarjo`,
        maritalStatus: "married",
        occupation: "Ketua DPC Partai NasDem",
        bio: `Ketua DPC Partai NasDem Kecamatan ${kecamatan.name}`,
        status: "active",
      },
    });

    // Link member to DPC Ketua structure
    await db.strukturOrganisasi.update({
      where: { id: dpcKetua.id },
      data: {
        members: {
          connect: { id: member.id },
        },
      },
    });

    console.log(`✅ Linked ${ketuaName} to DPC Ketua ${kecamatan.name}`);
    assignedCount++;
  }

  console.log(`✅ Successfully seeded ${assignedCount} DPC Ketua members!`);
}
