import {
  PrismaClient,
  UserRole,
  OrgLevel,
  PositionEnum,
  RegionType,
  MemberStatus,
  GenderEnum,
  ProgramStatus,
  Prisma,
} from "@prisma/client";
import bcrypt from "bcrypt";

const db = new PrismaClient();

async function hash(password: string) {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
  return bcrypt.hash(password, rounds);
}

async function main() {
  console.log("🧹 Clearing old data...");

  // Hapus semua data dengan urutan aman
  await db.dprdCalegResult.deleteMany();
  await db.dprdPartyResult.deleteMany();
  await db.dprdElectionAnalysis.deleteMany();
  await db.tps.deleteMany();
  await db.desa.deleteMany();
  await db.kecamatan.deleteMany();
  await db.dapil.deleteMany();
  await db.caleg.deleteMany();
  // Clear new gallery tables
  await (db as any).activityMedia.deleteMany();
  await (db as any).activity.deleteMany();
  await db.news.deleteMany();
  await db.program.deleteMany();
  await db.member.deleteMany();
  await db.strukturOrganisasi.deleteMany();
  await db.region.deleteMany();
  await db.sayapType.deleteMany();
  await db.party.deleteMany();
  await db.user.deleteMany();

  console.log("✅ All tables truncated.");

  // --------------------------
  // 1. USERS
  // --------------------------
  const [superadminHash, editorHash, analystHash] = await Promise.all([
    hash(process.env.SEED_SUPERADMIN_PASSWORD || "Nasdem!123"),
    hash(process.env.SEED_EDITOR_PASSWORD || "Editor!123"),
    hash(process.env.SEED_ANALYST_PASSWORD || "Analyst!123"),
  ]);

  const [superadmin, editor, analyst] = await Promise.all([
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

  // --------------------------
  // 2. PARTIES
  // --------------------------
  await db.party.createMany({
    data: [
      {
        name: "Partai NasDem",
        abbreviation: "NASDEM",
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/5/5a/Nasdem_logo.png",
      },
      { name: "Partai A", abbreviation: "PA", logoUrl: "/logos/a.png" },
      { name: "Partai B", abbreviation: "PB", logoUrl: "/logos/b.png" },
    ],
  });

  // --------------------------
  // 4. SAYAP TYPE & REGION
  // --------------------------
  await db.sayapType.createMany({
    data: [
      { name: "Garnita", description: "Sayap perempuan" },
      { name: "Garda", description: "Sayap pemuda" },
    ],
  });

  await db.region.createMany({
    data: [
      { name: "Kabupaten Sidoarjo", type: RegionType.kabupaten },
      { name: "Kecamatan A", type: RegionType.kecamatan },
      { name: "Kecamatan B", type: RegionType.kecamatan },
      { name: "Desa Alpha", type: RegionType.desa },
      { name: "Desa Beta", type: RegionType.desa },
    ],
  });

  const kabupaten = await db.region.findFirst({
    where: { type: RegionType.kabupaten },
  });

  // --------------------------
  // 5. STRUKTUR ORGANISASI
  // --------------------------
  await db.strukturOrganisasi.createMany({
    data: [
      {
        level: OrgLevel.dpd,
        position: PositionEnum.ketua,
        regionId: kabupaten?.id,
      },
      {
        level: OrgLevel.dpd,
        position: PositionEnum.sekretaris,
        regionId: kabupaten?.id,
      },
    ],
  });

  // --------------------------
  // 6. MEMBERS
  // --------------------------
  const struktur = await db.strukturOrganisasi.findFirst();
  await db.member.createMany({
    data: [
      {
        fullName: "Ahmad Ketua",
        phone: "08111111111",
        gender: GenderEnum.male,
        status: MemberStatus.active,
        strukturId: struktur?.id,
        email: "ahmad.ketua@nasdem.local",
        address: "Jl. Pahlawan No. 1, Sidoarjo",
        photoUrl: "/placeholder-user.jpg",
        nik: "3515xxxxxxxx0001",
        ktaNumber: "KTA-0001",
        occupation: "Wiraswasta",
        familyMemberCount: 4,
        maritalStatus: "Menikah",
        dateOfBirth: new Date("1980-01-15"),
        joinDate: new Date("2024-01-10"),
      },
      {
        fullName: "Siti Sekretaris",
        phone: "08222222222",
        gender: GenderEnum.female,
        status: MemberStatus.active,
        strukturId: struktur?.id,
        email: "siti.sekretaris@nasdem.local",
        address: "Jl. Diponegoro No. 10, Sidoarjo",
        photoUrl: "/placeholder-user.jpg",
        nik: "3515xxxxxxxx0002",
        ktaNumber: "KTA-0002",
        occupation: "Ibu Rumah Tangga",
        familyMemberCount: 3,
        maritalStatus: "Menikah",
        dateOfBirth: new Date("1985-05-20"),
        joinDate: new Date("2024-01-12"),
      },
    ],
  });

  // Tambah banyak member dengan data lengkap
  const moreMembers = Array.from({ length: 40 }).map((_, i) => {
    const isFemale = i % 2 === 1;
    const idSuffix = (i + 3).toString().padStart(4, "0");
    return {
      fullName: isFemale
        ? `Hj. Dewi Anggraini ${i + 1}`
        : `H. Budi Santosa ${i + 1}`,
      email: `member${idSuffix}@nasdem.local`,
      phone: `08${Math.floor(100000000 + Math.random() * 899999999)}`,
      gender: isFemale ? GenderEnum.female : GenderEnum.male,
      status: MemberStatus.active,
      strukturId: struktur?.id ?? null,
      address: `Perum Sutorejo Blok ${String.fromCharCode(65 + (i % 26))} No.${
        (i % 50) + 1
      }, Sidoarjo`,
      bio: "Kader aktif Partai NasDem Sidoarjo",
      photoUrl: "/placeholder-user.jpg",
      ktpPhotoUrl: "/placeholder-user.jpg",
      nik: `3515xxxxxxxx${idSuffix}`,
      ktaNumber: `KTA-${idSuffix}`,
      occupation: isFemale ? "Guru" : "Karyawan Swasta",
      familyMemberCount: (i % 5) + 2,
      maritalStatus: i % 3 === 0 ? "Lajang" : "Menikah",
      dateOfBirth: new Date(1975 + (i % 25), i % 12, (i % 27) + 1),
      joinDate: new Date(2024, i % 12, (i % 27) + 1),
      endDate: null as any,
    };
  });

  if (moreMembers.length) {
    await db.member.createMany({ data: moreMembers as any });
  }

  // --------------------------
  // 7. PROGRAMS
  // --------------------------
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

  // --------------------------
  // 8. NEWS
  // --------------------------
  await db.news.createMany({
    data: [
      {
        title: "Rapat Konsolidasi DPD",
        content: `<p>Laporan kegiatan <strong>rapat konsolidasi</strong> internal. Semua anggota hadir tepat waktu dan membahas program kerja 2025.</p>
                <ul>
                  <li>Agenda 1: Evaluasi Program</li>
                  <li>Agenda 2: Pembagian Tugas</li>
                  <li>Agenda 3: Diskusi Strategi</li>
                </ul>`,
        publishDate: new Date(),
        userId: superadmin.id,
        thumbnailUrl: "https://i.ytimg.com/vi/gwwX9Ogb9L0/maxresdefault.jpg",
      },
      {
        title: "Program UMKM Diluncurkan",
        content: `<p>Deskripsi peluncuran <em>program UMKM</em> baru. Peserta mendapatkan materi <strong>pendidikan kewirausahaan</strong> dan workshop.</p>
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/UMKM_Logo.png" alt="Program UMKM" />`,
        publishDate: new Date(),
        userId: superadmin.id,
        thumbnailUrl:
          "https://media.kompas.tv/library/image/content_article/article_img/20221003031206.jpg",
      },
      {
        title: "Kegiatan Sosialisasi Kesehatan",
        content: `<p>Tim kesehatan melakukan <strong>sosialisasi hidup sehat</strong> di beberapa kecamatan. Materi yang disampaikan mencakup:</p>
                <ol>
                  <li>Pola makan sehat</li>
                  <li>Olahraga rutin</li>
                  <li>Pemeriksaan kesehatan gratis</li>
                </ol>`,
        publishDate: new Date(),
        userId: superadmin.id,
        thumbnailUrl:
          "https://i.ytimg.com/vi/RFgNhS5k3nA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCoR6_4gYrKleYsu2HWdCbxsKK0bQ",
      },
      {
        title: "Pelatihan Digital Marketing UMKM",
        content: `<p>Workshop <em>Digital Marketing</em> untuk pelaku UMKM lokal. Fokus pada strategi <strong>media sosial</strong> dan <strong>e-commerce</strong>.</p>
                <p>Materi diberikan oleh pakar marketing digital nasional.</p>`,
        publishDate: new Date(),
        userId: superadmin.id,
        thumbnailUrl:
          "https://i.ytimg.com/vi/UJb8EVJa6-o/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBzj69K6x4puhZPfwWxmfs1DnfmFg",
      },
      {
        title: "Monitoring Program Pendidikan",
        content: `<p>Laporan hasil <strong>monitoring program pendidikan</strong> di sekolah-sekolah mitra. Evaluasi dilakukan setiap bulan dan meliputi:</p>
                <ul>
                  <li>Presensi guru & murid</li>
                  <li>Evaluasi kurikulum</li>
                  <li>Kegiatan ekstrakurikuler</li>
                </ul>`,
        publishDate: new Date(),
        userId: superadmin.id,
        thumbnailUrl:
          "https://i.ytimg.com/vi/F1RuAkxUwWo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDugzrFIMZd370-hEKmpV-WzLmrSw",
      },
      {
        title: "Gerakan Sehat di Kecamatan A",
        content: `<p>Program <strong>Gerakan Sehat</strong> dilakukan di Kecamatan A. Kegiatan meliputi:</p>
                <ul>
                  <li>Senam bersama</li>
                  <li>Screening kesehatan gratis</li>
                  <li>Penyuluhan gizi</li>
                </ul>`,
        publishDate: new Date(),
        userId: superadmin.id,
        thumbnailUrl: "https://i.ytimg.com/vi/VD1_JGyeuBM/maxresdefault.jpg",
      },
      {
        title: "Peluncuran Aplikasi Monitoring UMKM",
        content: `<p>Aplikasi baru diluncurkan untuk <em>monitoring UMKM</em>. Fitur utama:</p>
                <ul>
                  <li>Dashboard penjualan</li>
                  <li>Analisis HPP & BEP</li>
                  <li>Laporan real-time</li>
                </ul>`,
        publishDate: new Date(),
        userId: superadmin.id,
        thumbnailUrl: "https://i.ytimg.com/vi/Hsc2XZSk_fE/maxresdefault.jpg",
      },
      {
        title: "Kegiatan Pengabdian Masyarakat",
        content: `<p>Tim pengabdian masyarakat melaksanakan <strong>program literasi digital</strong> untuk masyarakat desa. Materi mencakup:</p>
                <ul>
                  <li>Penggunaan smartphone</li>
                  <li>Transaksi digital</li>
                  <li>Pembuatan toko online sederhana</li>
                </ul>`,
        publishDate: new Date(),
        userId: superadmin.id,
        thumbnailUrl:
          "https://awsimages.detik.net.id/community/media/visual/2022/06/15/surya-paloh-buka-rakernas-partai-nasdem-6_169.jpeg?w=600&q=90",
      },
    ],
    skipDuplicates: true,
  });

  // --------------------------
  // 9. ACTIVITIES & MEDIA (Gallery replacement)
  // --------------------------
  const activities = await db.$transaction(async (tx) => {
    const a1 = await (tx as any).activity.create({
      data: {
        title: "Rapat Koordinasi DPD",
        description: "Rapat koordinasi pengurus membahas program kerja 2025",
        category: "internal",
        eventDate: new Date("2024-01-15"),
        location: "Kantor DPD NasDem Sidoarjo",
      },
    });

    await (tx as any).activityMedia.createMany({
      data: [
        {
          activityId: a1.id,
          type: "image",
          url: "https://i.ytimg.com/vi/8c23rO8r0yc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCqlXnTDUdl_4zt1E_OGCpuOhXu4w",
          caption: "Pembukaan rapat",
          order: 0,
        },
        {
          activityId: a1.id,
          type: "image",
          url: "https://i.ytimg.com/vi/1UaElu_gwKw/hqdefault.jpg",
          caption: "Diskusi program",
          order: 1,
        },
      ],
    });

    const a2 = await (tx as any).activity.create({
      data: {
        title: "Bakti Sosial Ramadan",
        description: "Program bakti sosial membagikan sembako",
        category: "sosial",
        eventDate: new Date("2024-03-20"),
        location: "Kelurahan Sidoarjo",
      },
    });

    await (tx as any).activityMedia.createMany({
      data: [
        {
          activityId: a2.id,
          type: "image",
          url: "https://cdn.antaranews.com/cache/1200x800/2025/10/09/IMG_20251009_232808.jpg",
          caption: "Pembagian sembako",
          order: 0,
        },
        {
          activityId: a2.id,
          type: "video",
          url: "https://www.youtube.com/watch?v=L7B6V_OgzSY",
          caption: "Rangkuman kegiatan",
          order: 1,
        },
      ],
    });

    return [a1, a2];
  });

  // --------------------------
  // 10. CMS: ABOUT, CONTACT, HERO BANNERS
  // --------------------------
  await db.cmsAbout.create({
    data: {
      vision:
        "Mewujudkan Sidoarjo sebagai daerah yang maju, demokratis, dan berkeadilan sosial melalui gerakan perubahan yang berkelanjutan.",
      mission:
        "Membangun kaderitas yang kuat, melayani masyarakat dengan integritas, dan mengadvokasi kebijakan pro-rakyat.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  });

  await db.cmsContact.create({
    data: {
      phone: "+62 31 1234567",
      email: "dpd.sidoarjo@nasdem.id",
      address: "Jl. Raya Sidoarjo No. 123, Sidoarjo, Jawa Timur",
      operationalHours: "Senin - Jumat: 08:00 - 16:00 WIB",
      instagramUrl: "https://instagram.com/nasdemsidoarjo",
      facebookUrl: "https://facebook.com/nasdemsidoarjo",
      twitterUrl: "https://twitter.com/nasdemsidoarjo",
      youtubeUrl: "https://youtube.com/c/nasdemsidoarjo",
    },
  });

  await db.cmsHeroBanner.createMany({
    data: [
      {
        imageUrl: "/api/placeholder/800/400",
        order: 1,
        isActive: true,
      },
      {
        imageUrl: "/api/placeholder/800/400",
        order: 2,
        isActive: true,
      },
    ],
  });

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
