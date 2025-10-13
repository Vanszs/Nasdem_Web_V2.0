import {
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
  await db.gallery.deleteMany();
  await db.news.deleteMany();
  await db.program.deleteMany();
  await db.member.deleteMany();
  await db.strukturOrganisasi.deleteMany();
  await db.region.deleteMany();
  await db.sayapType.deleteMany();
  await db.category.deleteMany();
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
  // 3. CATEGORY
  // --------------------------
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
      },
      {
        fullName: "Siti Sekretaris",
        phone: "08222222222",
        gender: GenderEnum.female,
        status: MemberStatus.active,
        strukturId: struktur?.id,
      },
    ],
  });

  // --------------------------
  // 7. PROGRAMS
  // --------------------------
  const category = await db.category.findFirst();
  await db.program.createMany({
    data: [
      {
        title: "Pelatihan UMKM",
        description: "Meningkatkan kapasitas wirausaha lokal.",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-03-05"),
        categoryId: category?.id,
        userId: superadmin.id,
      },
      {
        title: "Gerakan Sehat",
        description: "Sosialisasi hidup sehat di kecamatan.",
        startDate: new Date("2024-04-10"),
        endDate: new Date("2024-04-12"),
        categoryId: category?.id,
        userId: editor.id,
      },
    ],
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
        thumbnailUrl:
          "https://upload.wikimedia.org/wikipedia/commons/8/80/App_icon.png",
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
  // 9. GALLERY
  // --------------------------
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
        type: "video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        caption: "Dokumentasi kegiatan",
        uploadDate: new Date(),
        userId: editor.id,
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
