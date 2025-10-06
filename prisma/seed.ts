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
    db.user.upsert({
      where: { email: "superadmin@nasdem.local" },
      update: {},
      create: {
        username: "superadmin",
        email: "superadmin@nasdem.local",
        password: superadminHash,
        role: UserRole.superadmin,
      },
    }),
    db.user.upsert({
      where: { email: "editor@nasdem.local" },
      update: {},
      create: {
        username: "editor",
        email: "editor@nasdem.local",
        password: editorHash,
        role: UserRole.editor,
      },
    }),
    db.user.upsert({
      where: { email: "analyst@nasdem.local" },
      update: {},
      create: {
        username: "analyst",
        email: "analyst@nasdem.local",
        password: analystHash,
        role: UserRole.analyst,
      },
    }),
  ]);
  const superadmin = users[0];

  // PARTIES
  const partiesData = [
    {
      name: "Partai NasDem",
      abbreviation: "NASDEM",
      logoUrl: "/logos/nasdem.png",
    },
    { name: "Partai A", abbreviation: "PA", logoUrl: "/logos/a.png" },
    { name: "Partai B", abbreviation: "PB", logoUrl: "/logos/b.png" },
  ];
  for (const p of partiesData) {
    await db.party.upsert({ where: { name: p.name }, update: {}, create: p });
  }
  const parties = await db.party.findMany();

  // CATEGORY
  await db.category.createMany({
    data: [
      {
        name: "Pendidikan",
        subtitle: "Program edukasi",
        description: "Kegiatan peningkatan mutu pendidikan",
      },
      {
        name: "Kesehatan",
        subtitle: "Program kesehatan",
        description: "Layanan & sosialisasi kesehatan",
      },
      {
        name: "Ekonomi",
        subtitle: "Program ekonomi kerakyatan",
        description: "UMKM & pemberdayaan ekonomi",
      },
    ],
    skipDuplicates: true,
  });

  // SAYAP TYPE
  await db.sayapType.createMany({
    data: [
      { name: "Garnita", description: "Sayap perempuan" },
      { name: "Garda", description: "Sayap pemuda" },
    ],
    skipDuplicates: true,
  });
  const sayapTypeList = await db.sayapType.findMany();

  await db.region.createMany({
    data: [
      { name: "Kabupaten Sidoarjo", type: RegionType.kabupaten },
      { name: "Kecamatan A", type: RegionType.kecamatan },
      { name: "Kecamatan B", type: RegionType.kecamatan },
      { name: "Desa Alpha", type: RegionType.desa },
      { name: "Desa Beta", type: RegionType.desa },
    ],
    skipDuplicates: true,
  });
  const regions = await db.region.findMany();
  const kabupaten = regions.find((r) => r.type === RegionType.kabupaten);
  const kecA = regions.find((r) => r.name === "Kecamatan A");
  const garnita = sayapTypeList.find((s) => s.name === "Garnita");

  if (!kabupaten || !kecA || !garnita) {
    throw new Error("Seed prerequisite data missing (region/sayap type)");
  }

  const strukturData = [
    {
      level: OrgLevel.dpd,
      position: PositionEnum.ketua,
      regionId: kabupaten.id,
    },
    {
      level: OrgLevel.dpd,
      position: PositionEnum.sekretaris,
      regionId: kabupaten.id,
    },
    {
      level: OrgLevel.dpc,
      position: PositionEnum.ketua,
      regionId: kecA.id,
    },
    {
      level: OrgLevel.sayap,
      position: PositionEnum.ketua,
      sayapTypeId: garnita.id,
    },
  ].map((entry) => ({
    ...entry,
    regionId: entry.regionId ?? undefined,
    sayapTypeId: entry.sayapTypeId ?? undefined,
  }));

  await db.strukturOrganisasi.createMany({
    data: strukturData,
    skipDuplicates: true,
  });
  const strukturList = await db.strukturOrganisasi.findMany();

  // MEMBERS
  const strukturKetuaDpd = strukturList.find(
    (s) => s.position === PositionEnum.ketua && s.level === OrgLevel.dpd
  );
  const strukturSekretarisDpd = strukturList.find(
    (s) => s.position === PositionEnum.sekretaris && s.level === OrgLevel.dpd
  );
  const strukturKetuaDpc = strukturList.find(
    (s) => s.position === PositionEnum.ketua && s.level === OrgLevel.dpc
  );

  const membersData = [
    {
      fullName: "Ahmad Ketua",
      email: "ahmad.ketua@nasdem.local",
      phone: "08111111111",
      status: MemberStatus.active,
      gender: GenderEnum.male,
      strukturId: strukturKetuaDpd?.id,
      joinDate: new Date("2023-01-10"),
    },
    {
      fullName: "Siti Sekretaris",
      email: "siti.sekretaris@nasdem.local",
      phone: "08222222222",
      status: MemberStatus.active,
      gender: GenderEnum.female,
      strukturId: strukturSekretarisDpd?.id,
      joinDate: new Date("2023-02-15"),
    },
    {
      fullName: "Budi DPC",
      email: "budi.dpc@nasdem.local",
      phone: "08333333333",
      status: MemberStatus.inactive,
      gender: GenderEnum.male,
      strukturId: strukturKetuaDpc?.id,
      joinDate: new Date("2024-01-05"),
    },
  ].map((member) => ({
    ...member,
    strukturId: member.strukturId ?? undefined,
  }));

  await db.member.createMany({
    data: membersData,
    skipDuplicates: true,
  });

  // DAPIL → KECAMATAN → DESA → TPS
  const dapil = await db.dapil.upsert({
    where: { name: "Dapil 1" },
    update: {},
    create: { name: "Dapil 1" },
  });
  const kecamatan = await db.kecamatan.upsert({
    where: { dapilId_name: { dapilId: dapil.id, name: "Kecamatan A" } },
    update: {},
    create: { name: "Kecamatan A", dapilId: dapil.id },
  });
  const desa = await db.desa.upsert({
    where: { kecamatanId_name: { kecamatanId: kecamatan.id, name: "Desa A1" } },
    update: {},
    create: { name: "Desa A1", kecamatanId: kecamatan.id },
  });
  const tps1 = await db.tps.upsert({
    where: { desaId_number: { desaId: desa.id, number: "1" } },
    update: {},
    create: { number: "1", desaId: desa.id },
  });
  await db.tps.upsert({
    where: { desaId_number: { desaId: desa.id, number: "2" } },
    update: {},
    create: { number: "2", desaId: desa.id },
  });

  // CALEG (field = fullName)
  const calegA = await db.caleg.upsert({
    where: {
      partyId_fullName: { partyId: parties[0].id, fullName: "Caleg Utama" },
    },
    update: {},
    create: { fullName: "Caleg Utama", partyId: parties[0].id },
  });
  const calegB = await db.caleg.upsert({
    where: {
      partyId_fullName: { partyId: parties[1].id, fullName: "Caleg Penantang" },
    },
    update: {},
    create: { fullName: "Caleg Penantang", partyId: parties[1].id },
  });

  // ANALISIS + HASIL (turnoutPercent Decimal -> string OK)
  const analysis2024 = await db.dprdElectionAnalysis.upsert({
    where: { year_tpsId: { year: 2024, tpsId: tps1.id } },
    update: {},
    create: {
      year: 2024,
      dapilId: dapil.id,
      kecamatanId: kecamatan.id,
      desaId: desa.id,
      tpsId: tps1.id,
      totalValidVotes: 1200,
      invalidVotes: 45,
      totalVotes: 1245,
      turnoutPercent: new Prisma.Decimal("72.50"),
      notes: "TPS 1 berjalan lancar",
    },
  });

  await db.dprdPartyResult.createMany({
    data: [
      {
        electionAnalysisId: analysis2024.id,
        partyId: parties[0].id,
        votes: 450,
      },
      {
        electionAnalysisId: analysis2024.id,
        partyId: parties[1].id,
        votes: 300,
      },
    ],
    skipDuplicates: true,
  });

  await db.dprdCalegResult.createMany({
    data: [
      { electionAnalysisId: analysis2024.id, calegId: calegA.id, votes: 260 },
      { electionAnalysisId: analysis2024.id, calegId: calegB.id, votes: 210 },
    ],
    skipDuplicates: true,
  });

  // PROGRAM
  const categoryFirst = await db.category.findFirst();
  const programData = [
    {
      title: "Pelatihan UMKM",
      description: "Meningkatkan kapasitas wirausaha lokal.",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-03-05"),
      categoryId: categoryFirst?.id,
      userId: superadmin.id,
    },
    {
      title: "Gerakan Sehat",
      description: "Sosialisasi hidup sehat di kecamatan.",
      startDate: new Date("2024-04-10"),
      endDate: new Date("2024-04-12"),
      categoryId: categoryFirst?.id,
      userId: superadmin.id,
    },
  ].map((program) => ({
    ...program,
    categoryId: program.categoryId ?? undefined,
  }));

  await db.program.createMany({
    data: programData,
    skipDuplicates: true,
  });

  // NEWS
  await db.news.createMany({
    data: [
      {
        title: "Rapat Konsolidasi DPD",
        content: "Laporan kegiatan rapat konsolidasi internal.",
        publishDate: new Date(),
        userId: superadmin.id,
      },
      {
        title: "Program UMKM Diluncurkan",
        content: "Deskripsi peluncuran program UMKM baru.",
        publishDate: new Date(),
        userId: superadmin.id,
      },
    ],
    skipDuplicates: true,
  });

  // GALLERY (type string sesuai schema)
  await db.gallery.createMany({
    data: [
      {
        type: "photo",
        url: "/uploads/gallery/rapat-1.jpg",
        caption: "Rapat internal pengurus",
        uploadDate: new Date(),
        userId: superadmin.id,
      },
      {
        type: "photo",
        url: "/uploads/gallery/umkm-1.jpg",
        caption: "Program UMKM berjalan",
        uploadDate: new Date(),
        userId: superadmin.id,
      },
      {
        type: "video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        caption: "Dokumentasi kegiatan",
        uploadDate: new Date(),
        userId: superadmin.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
