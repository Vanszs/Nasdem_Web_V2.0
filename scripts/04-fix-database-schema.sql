-- Fix users table to include phone column
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

-- Create default admin users
INSERT INTO users (email, full_name, role, phone) VALUES 
('admin1@nasdem.id', 'Super Admin', 'super_admin', '081234567890'),
('admin2@nasdem.id', 'Admin Kecamatan', 'kecamatan_admin', '081234567891'),
('admin3@nasdem.id', 'Admin Berita', 'admin', '081234567892')
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone;

-- Insert dummy news data
INSERT INTO news (title, content, excerpt, image_url, author_id, published) VALUES 
(
  'Silaturahmi & Diskusi dengan PD Muhammadiyah Sidoarjo',
  'DPD Partai NasDem Sidoarjo menggelar silaturahmi dan diskusi dengan Pimpinan Daerah Muhammadiyah Sidoarjo. Pertemuan ini membahas berbagai isu strategis termasuk pendidikan inklusif, ekonomi kerakyatan, dan program pemberdayaan masyarakat. Kedua organisasi sepakat untuk berkolaborasi dalam berbagai program yang bermanfaat bagi masyarakat Sidoarjo.',
  'Membahas pendidikan inklusif, ekonomi kerakyatan, dan program pemberdayaan masyarakat bersama PD Muhammadiyah Sidoarjo.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1),
  true
),
(
  'Pembukaan Pendaftaran NasDem Muda 2025',
  'Program kaderisasi NasDem Muda 2025 resmi dibuka untuk pemuda berusia 17-30 tahun. Program ini fokus pada edukasi politik, pelatihan kepemimpinan, dan pengembangan kapasitas generasi muda dalam berpartisipasi aktif dalam pembangunan daerah. Pendaftaran dapat dilakukan melalui kantor DPD atau secara online.',
  'Program kaderisasi untuk pemuda 17-30 tahun dengan fokus edukasi politik dan pelatihan kepemimpinan.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  true
),
(
  'Aksi Fogging & Bantuan Sembako di Desa Sidorejo',
  'NasDem Muda bersama DPD NasDem Sidoarjo melakukan aksi sosial berupa fogging untuk pencegahan DBD dan pembagian sembako kepada warga Desa Sidorejo, Krian. Kegiatan ini merupakan bagian dari program kepedulian sosial partai terhadap kesehatan dan kesejahteraan masyarakat.',
  'Bersama NasDem Muda melakukan pencegahan DBD dan memberikan bantuan kepada warga Krian.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  true
),
(
  'Penyaluran 709 Ton Benih Padi ke 103 Kelompok Tani',
  'Dalam mendukung program swasembada pangan, DPD NasDem Sidoarjo menyalurkan 709 ton benih padi kepada 103 kelompok tani di seluruh Kabupaten Sidoarjo. Program ini bertujuan meningkatkan produktivitas pertanian dan kesejahteraan petani lokal.',
  'Dukungan swasembada pangan melalui pemberdayaan kelompok tani di seluruh Sidoarjo.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1),
  true
),
(
  'Catatan Fraksi NasDem-Demokrat atas RPJMD Sidoarjo 2025-2029',
  'Fraksi NasDem-Demokrat DPRD Sidoarjo memberikan catatan konstruktif terhadap Rencana Pembangunan Jangka Menengah Daerah (RPJMD) Sidoarjo 2025-2029. Catatan ini mencakup sinkronisasi program, penyelarasan antar sektor, dan optimalisasi anggaran untuk kesejahteraan masyarakat.',
  'Memberikan masukan konstruktif terkait sinkronisasi program dan penyelarasan antar sektor.',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1),
  true
);

-- Insert sample TPS coordinators and kaders
INSERT INTO users (email, full_name, role, phone, kecamatan) VALUES 
('koordinator1@nasdem.id', 'Budi Santoso', 'user', '081234567893', 'Sidoarjo'),
('koordinator2@nasdem.id', 'Siti Rahayu', 'user', '081234567894', 'Sidoarjo'),
('koordinator3@nasdem.id', 'Ahmad Fauzi', 'user', '081234567895', 'Buduran')
ON CONFLICT (email) DO NOTHING;

-- Insert sample TPS data
INSERT INTO tps (name, number, desa_id, coordinator_id) VALUES 
('TPS 001 Sidokare', 1, (SELECT id FROM desa WHERE code = 'SDK'), (SELECT id FROM users WHERE email = 'koordinator1@nasdem.id')),
('TPS 002 Sidokare', 2, (SELECT id FROM desa WHERE code = 'SDK'), (SELECT id FROM users WHERE email = 'koordinator2@nasdem.id')),
('TPS 001 Lemahputro', 1, (SELECT id FROM desa WHERE code = 'LMP'), (SELECT id FROM users WHERE email = 'koordinator3@nasdem.id'))
ON CONFLICT DO NOTHING;

-- Insert sample kaders (10 per TPS coordinator)
INSERT INTO kaders (full_name, phone, address, tps_id, coordinator_id) 
SELECT 
  'Kader ' || generate_series || ' - ' || t.name,
  '0812345678' || LPAD(generate_series::text, 2, '0'),
  'Alamat Kader ' || generate_series || ', ' || d.name,
  t.id,
  t.coordinator_id
FROM tps t
JOIN desa d ON t.desa_id = d.id
CROSS JOIN generate_series(1, 10)
ON CONFLICT DO NOTHING;
