-- Insert sample news data
INSERT INTO news (title, content, excerpt, image_url, author_id, published) VALUES 
(
  'Silaturahmi & Diskusi dengan PD Muhammadiyah Sidoarjo',
  'DPD Partai NasDem Sidoarjo menggelar silaturahmi dan diskusi dengan Pimpinan Daerah Muhammadiyah Sidoarjo. Pertemuan ini membahas berbagai isu strategis termasuk pendidikan inklusif, ekonomi kerakyatan, dan program pemberdayaan masyarakat. Kedua organisasi sepakat untuk berkolaborasi dalam berbagai program yang bermanfaat bagi masyarakat Sidoarjo.',
  'Membahas pendidikan inklusif, ekonomi kerakyatan, dan program pemberdayaan masyarakat bersama PD Muhammadiyah Sidoarjo.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM users WHERE email = 'admin@nasdemsidoarjo.id'),
  true
),
(
  'Pembukaan Pendaftaran NasDem Muda 2025',
  'Program kaderisasi NasDem Muda 2025 resmi dibuka untuk pemuda berusia 17-30 tahun. Program ini fokus pada edukasi politik, pelatihan kepemimpinan, dan pengembangan kapasitas organisasi. Peserta akan mendapatkan sertifikat dan kesempatan magang di berbagai instansi pemerintah dan swasta.',
  'Program kaderisasi untuk pemuda 17-30 tahun dengan fokus edukasi politik dan pelatihan kepemimpinan.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM users WHERE email = 'admin@nasdemsidoarjo.id'),
  true
),
(
  'Aksi Fogging & Bantuan Sembako di Desa Sidorejo',
  'NasDem Muda Sidoarjo bersama dengan Dinas Kesehatan melakukan aksi fogging untuk pencegahan Demam Berdarah Dengue (DBD) di Desa Sidorejo, Krian. Selain fogging, juga disalurkan bantuan sembako kepada 100 keluarga kurang mampu. Kegiatan ini merupakan bagian dari program kepedulian sosial NasDem.',
  'Bersama NasDem Muda melakukan pencegahan DBD dan memberikan bantuan kepada warga Krian.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM users WHERE email = 'admin@nasdemsidoarjo.id'),
  true
),
(
  'Penyaluran 709 Ton Benih Padi ke 103 Kelompok Tani',
  'Dalam rangka mendukung program swasembada pangan, DPD NasDem Sidoarjo menyalurkan 709 ton benih padi kepada 103 kelompok tani di seluruh Kabupaten Sidoarjo. Program ini bertujuan meningkatkan produktivitas pertanian dan kesejahteraan petani. Benih yang disalurkan merupakan varietas unggul dengan daya tahan tinggi.',
  'Dukungan swasembada pangan melalui pemberdayaan kelompok tani di seluruh Sidoarjo.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM users WHERE email = 'admin@nasdemsidoarjo.id'),
  true
),
(
  'Catatan Fraksi NasDem-Demokrat atas RPJMD Sidoarjo 2025-2029',
  'Fraksi NasDem-Demokrat DPRD Sidoarjo memberikan catatan konstruktif terhadap Rancangan Peraturan Daerah tentang RPJMD Sidoarjo 2025-2029. Catatan meliputi sinkronisasi program antar sektor, penyelarasan dengan RPJMN, dan optimalisasi anggaran untuk program prioritas. Fraksi mendorong transparansi dan akuntabilitas dalam pelaksanaan pembangunan.',
  'Memberikan masukan konstruktif terkait sinkronisasi program dan penyelarasan antar sektor.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM users WHERE email = 'admin@nasdemsidoarjo.id'),
  true
),
(
  'Program Beasiswa NasDem untuk Mahasiswa Berprestasi',
  'DPD NasDem Sidoarjo meluncurkan program beasiswa untuk 50 mahasiswa berprestasi dari keluarga kurang mampu. Beasiswa mencakup biaya kuliah, buku, dan biaya hidup selama 4 tahun. Program ini merupakan komitmen NasDem dalam mencerdaskan anak bangsa dan memutus mata rantai kemiskinan melalui pendidikan.',
  'Beasiswa untuk 50 mahasiswa berprestasi sebagai komitmen mencerdaskan anak bangsa.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM users WHERE email = 'admin@nasdemsidoarjo.id'),
  true
)
ON CONFLICT DO NOTHING;

-- Insert sample gallery data
INSERT INTO gallery (title, description, image_url, author_id) VALUES 
(
  'Rapat Koordinasi DPD NasDem Sidoarjo',
  'Dokumentasi rapat koordinasi bulanan pengurus DPD NasDem Sidoarjo membahas program kerja dan evaluasi kegiatan.',
  '/placeholder.svg?height=300&width=400',
  (SELECT id FROM users WHERE email = 'admin@nasdemsidoarjo.id')
),
(
  'Bakti Sosial di Kecamatan Buduran',
  'Kegiatan bakti sosial berupa pembagian sembako dan layanan kesehatan gratis untuk masyarakat Buduran.',
  '/placeholder.svg?height=300&width=400',
  (SELECT id FROM users WHERE email = 'admin@nasdemsidoarjo.id')
),
(
  'Kunjungan Lapangan ke Petani Sidoarjo',
  'Kunjungan ke kelompok tani untuk memantau distribusi benih padi dan memberikan pendampingan teknis.',
  '/placeholder.svg?height=300&width=400',
  (SELECT id FROM users WHERE email = 'admin@nasdemsidoarjo.id')
),
(
  'Pelatihan Kaderisasi NasDem Muda',
  'Dokumentasi kegiatan pelatihan kepemimpinan dan kaderisasi untuk anggota NasDem Muda Sidoarjo.',
  '/placeholder.svg?height=300&width=400',
  (SELECT id FROM users WHERE email = 'admin@nasdemsidoarjo.id')
)
ON CONFLICT DO NOTHING;
