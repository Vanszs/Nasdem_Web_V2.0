import { PrismaClient } from "@prisma/client";

export async function seedNews(db: PrismaClient, superadminId: number) {
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
        userId: superadminId,
        thumbnailUrl: "https://i.ytimg.com/vi/gwwX9Ogb9L0/maxresdefault.jpg",
      },
      {
        title: "Program UMKM Diluncurkan",
        content: `<p>Deskripsi peluncuran <em>program UMKM</em> baru. Peserta mendapatkan materi <strong>pendidikan kewirausahaan</strong> dan workshop.</p>
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/UMKM_Logo.png" alt="Program UMKM" />`,
        publishDate: new Date(),
        userId: superadminId,
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
        userId: superadminId,
        thumbnailUrl:
          "https://i.ytimg.com/vi/RFgNhS5k3nA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCoR6_4gYrKleYsu2HWdCbxsKK0bQ",
      },
      {
        title: "Pelatihan Digital Marketing UMKM",
        content: `<p>Workshop <em>Digital Marketing</em> untuk pelaku UMKM lokal. Fokus pada strategi <strong>media sosial</strong> dan <strong>e-commerce</strong>.</p>
                <p>Materi diberikan oleh pakar marketing digital nasional.</p>`,
        publishDate: new Date(),
        userId: superadminId,
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
        userId: superadminId,
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
        userId: superadminId,
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
        userId: superadminId,
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
        userId: superadminId,
        thumbnailUrl:
          "https://awsimages.detik.net.id/community/media/visual/2022/06/15/surya-paloh-buka-rakernas-partai-nasdem-6_169.jpeg?w=600&q=90",
      },
    ],
    skipDuplicates: true,
  });
}
