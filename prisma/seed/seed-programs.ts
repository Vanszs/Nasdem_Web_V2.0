import {
  GenderEnum,
  Prisma,
  PrismaClient,
  ProgramStatus,
  BenefitStatus,
} from "@prisma/client";

export async function seedPrograms(db: PrismaClient) {
  const coordinator = await db.member.findFirst({ orderBy: { id: "asc" } });
  if (!coordinator) {
    throw new Error(
      "Coordinator member not found. Ensure members are seeded before programs."
    );
  }
  await db.program.createMany({
    data: [
      {
        category: "ekonomi",
        name: "Pelatihan UMKM",
        description: "Meningkatkan kapasitas wirausaha lokal.",
        target: 100,
        currentTarget: 25,
        budget: new Prisma.Decimal("50000000"),
        status: ProgramStatus.ongoing,
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-03-05"),
        coordinatorId: coordinator.id,
      },
      {
        category: "kesehatan",
        name: "Gerakan Sehat",
        description: "Sosialisasi hidup sehat di kecamatan.",
        target: 200,
        currentTarget: 80,
        budget: new Prisma.Decimal("30000000"),
        status: ProgramStatus.planning,
        startDate: new Date("2024-04-10"),
        endDate: new Date("2024-04-12"),
        coordinatorId: coordinator.id,
      },
    ],
    skipDuplicates: true,
  });
}

export async function seedProgramBeneficiaries(db: PrismaClient) {
  const programs = await db.program.findMany({ take: 2 });
  if (programs.length === 0) return;

  const beneficiariesData = [
    {
      programId: programs[0].id,
      fullName: "Budi Hartono",
      email: "budi.hartono@example.com",
      nik: "3515081234567801",
      phone: "081234567801",
      dateOfBirth: new Date("1985-03-15"),
      gender: GenderEnum.male,
      occupation: "Pedagang Kecil",
      familyMemberCount: 4,
      proposerName: "Ahmad Ketua",
      fullAddress: "Jl. Mawar No. 12, Sidoarjo",
      notes: "Membutuhkan pelatihan manajemen usaha",
      status: BenefitStatus.completed,
    },
    {
      programId: programs[0].id,
      fullName: "Siti Nurhaliza",
      email: "siti.nurhaliza@example.com",
      nik: "3515082345678902",
      phone: "081234567802",
      dateOfBirth: new Date("1990-07-20"),
      gender: GenderEnum.female,
      occupation: "Ibu Rumah Tangga",
      familyMemberCount: 3,
      proposerName: "Siti Sekretaris",
      fullAddress: "Jl. Melati No. 5, Sidoarjo",
      notes: "Ingin memulai usaha rumahan",
      status: BenefitStatus.completed,
    },
    {
      programId: programs[0].id,
      fullName: "Agus Setiawan",
      email: "agus.setiawan@example.com",
      nik: "3515083456789013",
      phone: "081234567803",
      dateOfBirth: new Date("1988-11-10"),
      gender: GenderEnum.male,
      occupation: "Buruh Lepas",
      familyMemberCount: 5,
      proposerName: "Ahmad Ketua",
      fullAddress: "Jl. Dahlia No. 8, Sidoarjo",
      notes: "Bergabung untuk meningkatkan pendapatan",
      status: BenefitStatus.pending,
    },
    {
      programId: programs[1]?.id ?? programs[0].id,
      fullName: "Dewi Kusuma",
      email: "dewi.kusuma@example.com",
      nik: "3515084567890124",
      phone: "081234567804",
      dateOfBirth: new Date("1992-05-25"),
      gender: GenderEnum.female,
      occupation: "Guru",
      familyMemberCount: 2,
      proposerName: "Siti Sekretaris",
      fullAddress: "Jl. Anggrek No. 15, Sidoarjo",
      notes: "Peserta program pemeriksaan kesehatan",
      status: BenefitStatus.completed,
    },
    {
      programId: programs[1]?.id ?? programs[0].id,
      fullName: "Rudi Prasetyo",
      email: "rudi.prasetyo@example.com",
      nik: "3515085678901235",
      phone: "081234567805",
      dateOfBirth: new Date("1983-09-08"),
      gender: GenderEnum.male,
      occupation: "Petani",
      familyMemberCount: 6,
      proposerName: "Ahmad Ketua",
      fullAddress: "Jl. Kenanga No. 20, Sidoarjo",
      notes: "Mengikuti sosialisasi hidup sehat",
      status: BenefitStatus.completed,
    },
    {
      programId: programs[1]?.id ?? programs[0].id,
      fullName: "Lina Marlina",
      email: "lina.marlina@example.com",
      nik: "3515086789012346",
      phone: "081234567806",
      dateOfBirth: new Date("1995-12-30"),
      gender: GenderEnum.female,
      occupation: "Karyawan Swasta",
      familyMemberCount: 3,
      proposerName: "Siti Sekretaris",
      fullAddress: "Jl. Tulip No. 7, Sidoarjo",
      notes: "Tertarik dengan program senam bersama",
      status: BenefitStatus.pending,
    },
  ];

  for (const beneficiary of beneficiariesData) {
    await db.programBenefitRecipient.upsert({
      where: {
        programId_nik: {
          programId: beneficiary.programId,
          nik: beneficiary.nik!,
        },
      },
      update: {},
      create: beneficiary,
    });
  }

  console.log(
    `✅ Seeded ${beneficiariesData.length} program benefit recipients`
  );
}
