-- Insert sample TPS data
INSERT INTO tps (name, number, desa_id) VALUES 
('TPS 001 Sidokare', 1, (SELECT id FROM desa WHERE code = 'SDK')),
('TPS 002 Sidokare', 2, (SELECT id FROM desa WHERE code = 'SDK')),
('TPS 003 Sidokare', 3, (SELECT id FROM desa WHERE code = 'SDK')),
('TPS 001 Lemahputro', 1, (SELECT id FROM desa WHERE code = 'LMP')),
('TPS 002 Lemahputro', 2, (SELECT id FROM desa WHERE code = 'LMP')),
('TPS 001 Buduran', 1, (SELECT id FROM desa WHERE code = 'BDR1')),
('TPS 002 Buduran', 2, (SELECT id FROM desa WHERE code = 'BDR1')),
('TPS 001 Siwalanpanji', 1, (SELECT id FROM desa WHERE code = 'SWP'))
ON CONFLICT DO NOTHING;

-- Insert sample users (coordinators)
INSERT INTO users (email, full_name, role) VALUES 
('koordinator1@nasdemsidoarjo.id', 'Budi Santoso', 'user'),
('koordinator2@nasdemsidoarjo.id', 'Siti Rahayu', 'user'),
('koordinator3@nasdemsidoarjo.id', 'Ahmad Wijaya', 'user'),
('koordinator4@nasdemsidoarjo.id', 'Dewi Sartika', 'user'),
('koordinator5@nasdemsidoarjo.id', 'Hendra Gunawan', 'user'),
('admin@nasdemsidoarjo.id', 'Admin NasDem', 'super_admin'),
('admin.kec@nasdemsidoarjo.id', 'Admin Kecamatan', 'kecamatan_admin')
ON CONFLICT (email) DO NOTHING;

-- Update TPS with coordinators
UPDATE tps SET coordinator_id = (SELECT id FROM users WHERE email = 'koordinator1@nasdemsidoarjo.id') 
WHERE name = 'TPS 001 Sidokare';

UPDATE tps SET coordinator_id = (SELECT id FROM users WHERE email = 'koordinator2@nasdemsidoarjo.id') 
WHERE name = 'TPS 002 Sidokare';

UPDATE tps SET coordinator_id = (SELECT id FROM users WHERE email = 'koordinator3@nasdemsidoarjo.id') 
WHERE name = 'TPS 001 Lemahputro';

UPDATE tps SET coordinator_id = (SELECT id FROM users WHERE email = 'koordinator4@nasdemsidoarjo.id') 
WHERE name = 'TPS 001 Buduran';

UPDATE tps SET coordinator_id = (SELECT id FROM users WHERE email = 'koordinator5@nasdemsidoarjo.id') 
WHERE name = 'TPS 001 Siwalanpanji';

-- Insert sample kaders (10 per coordinator)
INSERT INTO kaders (full_name, phone, address, tps_id, coordinator_id) VALUES 
-- Kaders for TPS 001 Sidokare
('Agus Setiawan', '081234567890', 'Jl. Merdeka No. 1', (SELECT id FROM tps WHERE name = 'TPS 001 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator1@nasdemsidoarjo.id')),
('Rina Wati', '081234567891', 'Jl. Merdeka No. 2', (SELECT id FROM tps WHERE name = 'TPS 001 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator1@nasdemsidoarjo.id')),
('Bambang Sutrisno', '081234567892', 'Jl. Merdeka No. 3', (SELECT id FROM tps WHERE name = 'TPS 001 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator1@nasdemsidoarjo.id')),
('Sari Indah', '081234567893', 'Jl. Merdeka No. 4', (SELECT id FROM tps WHERE name = 'TPS 001 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator1@nasdemsidoarjo.id')),
('Dedi Kurniawan', '081234567894', 'Jl. Merdeka No. 5', (SELECT id FROM tps WHERE name = 'TPS 001 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator1@nasdemsidoarjo.id')),
('Maya Sari', '081234567895', 'Jl. Merdeka No. 6', (SELECT id FROM tps WHERE name = 'TPS 001 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator1@nasdemsidoarjo.id')),
('Rudi Hartono', '081234567896', 'Jl. Merdeka No. 7', (SELECT id FROM tps WHERE name = 'TPS 001 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator1@nasdemsidoarjo.id')),
('Lina Marlina', '081234567897', 'Jl. Merdeka No. 8', (SELECT id FROM tps WHERE name = 'TPS 001 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator1@nasdemsidoarjo.id')),
('Eko Prasetyo', '081234567898', 'Jl. Merdeka No. 9', (SELECT id FROM tps WHERE name = 'TPS 001 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator1@nasdemsidoarjo.id')),
('Fitri Handayani', '081234567899', 'Jl. Merdeka No. 10', (SELECT id FROM tps WHERE name = 'TPS 001 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator1@nasdemsidoarjo.id')),

-- Kaders for TPS 002 Sidokare
('Joko Widodo', '082234567890', 'Jl. Pahlawan No. 1', (SELECT id FROM tps WHERE name = 'TPS 002 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator2@nasdemsidoarjo.id')),
('Sri Mulyani', '082234567891', 'Jl. Pahlawan No. 2', (SELECT id FROM tps WHERE name = 'TPS 002 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator2@nasdemsidoarjo.id')),
('Andi Wijaya', '082234567892', 'Jl. Pahlawan No. 3', (SELECT id FROM tps WHERE name = 'TPS 002 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator2@nasdemsidoarjo.id')),
('Ratna Sari', '082234567893', 'Jl. Pahlawan No. 4', (SELECT id FROM tps WHERE name = 'TPS 002 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator2@nasdemsidoarjo.id')),
('Hadi Susanto', '082234567894', 'Jl. Pahlawan No. 5', (SELECT id FROM tps WHERE name = 'TPS 002 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator2@nasdemsidoarjo.id')),
('Indira Putri', '082234567895', 'Jl. Pahlawan No. 6', (SELECT id FROM tps WHERE name = 'TPS 002 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator2@nasdemsidoarjo.id')),
('Wahyu Nugroho', '082234567896', 'Jl. Pahlawan No. 7', (SELECT id FROM tps WHERE name = 'TPS 002 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator2@nasdemsidoarjo.id')),
('Dian Sastro', '082234567897', 'Jl. Pahlawan No. 8', (SELECT id FROM tps WHERE name = 'TPS 002 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator2@nasdemsidoarjo.id')),
('Bayu Skak', '082234567898', 'Jl. Pahlawan No. 9', (SELECT id FROM tps WHERE name = 'TPS 002 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator2@nasdemsidoarjo.id')),
('Cinta Laura', '082234567899', 'Jl. Pahlawan No. 10', (SELECT id FROM tps WHERE name = 'TPS 002 Sidokare'), (SELECT id FROM users WHERE email = 'koordinator2@nasdemsidoarjo.id'))
ON CONFLICT DO NOTHING;
