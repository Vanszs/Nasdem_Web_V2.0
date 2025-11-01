import { PrismaClient, OrgLevel } from "@prisma/client";

/**
 * Seed dummy data untuk DPD (Dewan Pimpinan Daerah)
 * Mengisi 35 posisi DPD dengan member dummy
 */

const dummyMembers = [
  {
    fullName: "H. Ahmad Hidayat, S.E., M.M.",
    email: "ahmad.hidayat@nasdem.id",
    phone: "081234567001",
    photoUrl: null,
  },
  {
    fullName: "Hj. Siti Nurjanah, S.Pd., M.Pd.",
    email: "siti.nurjanah@nasdem.id",
    phone: "081234567002",
    photoUrl: null,
  },
  {
    fullName: "Dr. Budi Santoso, S.H., M.H.",
    email: "budi.santoso@nasdem.id",
    phone: "081234567003",
    photoUrl: null,
  },
  {
    fullName: "Ir. Ratna Dewi Susanti, M.T.",
    email: "ratna.dewi@nasdem.id",
    phone: "081234567004",
    photoUrl: null,
  },
  {
    fullName: "Drs. Eko Prasetyo, M.Si.",
    email: "eko.prasetyo@nasdem.id",
    phone: "081234567005",
    photoUrl: null,
  },
  {
    fullName: "Hj. Indah Permata Sari, S.Sos.",
    email: "indah.permata@nasdem.id",
    phone: "081234567006",
    photoUrl: null,
  },
  {
    fullName: "H. Bambang Suryanto, S.T.",
    email: "bambang.suryanto@nasdem.id",
    phone: "081234567007",
    photoUrl: null,
  },
  {
    fullName: "Dr. Lestari Wulandari, S.Psi., M.Psi.",
    email: "lestari.wulandari@nasdem.id",
    phone: "081234567008",
    photoUrl: null,
  },
  {
    fullName: "H. Rudi Hartono, S.E., Ak., M.M.",
    email: "rudi.hartono@nasdem.id",
    phone: "081234567009",
    photoUrl: null,
  },
  {
    fullName: "Hj. Yuni Rahayu, S.Kom., M.Kom.",
    email: "yuni.rahayu@nasdem.id",
    phone: "081234567010",
    photoUrl: null,
  },
  {
    fullName: "Drs. Agus Salim, M.Pd.",
    email: "agus.salim@nasdem.id",
    phone: "081234567011",
    photoUrl: null,
  },
  {
    fullName: "Ir. Dwi Hastuti, M.Eng.",
    email: "dwi.hastuti@nasdem.id",
    phone: "081234567012",
    photoUrl: null,
  },
  {
    fullName: "H. Hendra Kusuma, S.H.",
    email: "hendra.kusuma@nasdem.id",
    phone: "081234567013",
    photoUrl: null,
  },
  {
    fullName: "Dr. Rina Marlina, S.Ked., M.Kes.",
    email: "rina.marlina@nasdem.id",
    phone: "081234567014",
    photoUrl: null,
  },
  {
    fullName: "H. Joko Widodo, S.Sos., M.Si.",
    email: "joko.widodo@nasdem.id",
    phone: "081234567015",
    photoUrl: null,
  },
  {
    fullName: "Hj. Maya Safitri, S.Pd.",
    email: "maya.safitri@nasdem.id",
    phone: "081234567016",
    photoUrl: null,
  },
  {
    fullName: "Drs. Taufik Rahman, M.M.",
    email: "taufik.rahman@nasdem.id",
    phone: "081234567017",
    photoUrl: null,
  },
  {
    fullName: "Ir. Novi Andriani, M.T.",
    email: "novi.andriani@nasdem.id",
    phone: "081234567018",
    photoUrl: null,
  },
  {
    fullName: "H. Arief Budiman, S.E., M.B.A.",
    email: "arief.budiman@nasdem.id",
    phone: "081234567019",
    photoUrl: null,
  },
  {
    fullName: "Dr. Sri Wahyuni, S.Si., M.Si.",
    email: "sri.wahyuni@nasdem.id",
    phone: "081234567020",
    photoUrl: null,
  },
  {
    fullName: "H. Firman Hidayat, S.Pt., M.P.",
    email: "firman.hidayat@nasdem.id",
    phone: "081234567021",
    photoUrl: null,
  },
  {
    fullName: "Hj. Nurul Aini, S.Ag., M.Pd.I.",
    email: "nurul.aini@nasdem.id",
    phone: "081234567022",
    photoUrl: null,
  },
  {
    fullName: "Drs. Wawan Setiawan, M.Si.",
    email: "wawan.setiawan@nasdem.id",
    phone: "081234567023",
    photoUrl: null,
  },
  {
    fullName: "Dr. Ani Purwanti, S.Kep., M.Kep.",
    email: "ani.purwanti@nasdem.id",
    phone: "081234567024",
    photoUrl: null,
  },
  {
    fullName: "H. Sutrisno, S.Sos.",
    email: "sutrisno@nasdem.id",
    phone: "081234567025",
    photoUrl: null,
  },
  {
    fullName: "Ir. Dewi Anggraini, M.Si.",
    email: "dewi.anggraini@nasdem.id",
    phone: "081234567026",
    photoUrl: null,
  },
  {
    fullName: "H. Irfan Syahputra, S.T., M.T.",
    email: "irfan.syahputra@nasdem.id",
    phone: "081234567027",
    photoUrl: null,
  },
  {
    fullName: "Hj. Fitria Rahmawati, S.E., M.M.",
    email: "fitria.rahmawati@nasdem.id",
    phone: "081234567028",
    photoUrl: null,
  },
  {
    fullName: "Drs. Yusuf Hidayat, M.Pd.",
    email: "yusuf.hidayat@nasdem.id",
    phone: "081234567029",
    photoUrl: null,
  },
  {
    fullName: "Dr. Lia Amalia, S.H., M.H.",
    email: "lia.amalia@nasdem.id",
    phone: "081234567030",
    photoUrl: null,
  },
  {
    fullName: "H. Rizki Pratama, S.Kom., M.Kom.",
    email: "rizki.pratama@nasdem.id",
    phone: "081234567031",
    photoUrl: null,
  },
  {
    fullName: "Hj. Diah Puspitasari, S.Sos., M.Si.",
    email: "diah.puspita@nasdem.id",
    phone: "081234567032",
    photoUrl: null,
  },
  {
    fullName: "Drs. Hadi Wijaya, M.M.",
    email: "hadi.wijaya@nasdem.id",
    phone: "081234567033",
    photoUrl: null,
  },
  {
    fullName: "Ir. Santi Kusumawati, M.B.A.",
    email: "santi.kusuma@nasdem.id",
    phone: "081234567034",
    photoUrl: null,
  },
  {
    fullName: "H. Faisal Abdullah, S.E., Ak., M.M.",
    email: "faisal.abdullah@nasdem.id",
    phone: "081234567035",
    photoUrl: null,
  },
];

export async function seedDpdDummyMembers(db: PrismaClient) {
  console.log("🌱 Seeding dummy members for DPD positions...");

  // Fetch all DPD structures
  const dpdStructures = await db.strukturOrganisasi.findMany({
    where: { level: OrgLevel.dpd },
    orderBy: { positionOrder: "asc" },
  });

  if (dpdStructures.length === 0) {
    console.log("⚠️  No DPD structures found. Please run seed-taxonomy first.");
    return;
  }

  // Create members first
  const createdMembers = [];
  for (let i = 0; i < Math.min(dummyMembers.length, dpdStructures.length); i++) {
    const memberData = dummyMembers[i];
    
    const member = await db.member.create({
      data: {
        fullName: memberData.fullName,
        email: memberData.email,
        phone: memberData.phone,
        photoUrl: memberData.photoUrl,
        nik: `3515${String(i + 1).padStart(12, "0")}`, // Dummy NIK
        dateOfBirth: new Date(1970 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), 1),
        gender: i % 2 === 0 ? "male" : "female",
        address: `Jl. Contoh No. ${i + 1}, Sidoarjo, Jawa Timur`,
        maritalStatus: "married",
        occupation: "Pengurus Partai",
        bio: `Pengurus aktif Partai NasDem Sidoarjo`,
        status: "active",
      },
    });

    createdMembers.push(member);
  }

  // Link members to structures
  for (let i = 0; i < createdMembers.length; i++) {
    const member = createdMembers[i];
    const struktur = dpdStructures[i];

    await db.strukturOrganisasi.update({
      where: { id: struktur.id },
      data: {
        members: {
          connect: { id: member.id },
        },
      },
    });

    console.log(
      `✅ Linked ${member.fullName} to position #${i + 1}`
    );
  }

  console.log(`✅ Successfully seeded ${createdMembers.length} DPD members!`);
}

