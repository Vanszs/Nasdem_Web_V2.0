-- Create users table with roles
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'kecamatan_admin', 'user')),
  kecamatan TEXT, -- For kecamatan_admin role
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organization structure tables
CREATE TABLE IF NOT EXISTS kecamatan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS desa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  kecamatan_id UUID REFERENCES kecamatan(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  number INTEGER NOT NULL,
  desa_id UUID REFERENCES desa(id) ON DELETE CASCADE,
  coordinator_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kaders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  tps_id UUID REFERENCES tps(id) ON DELETE CASCADE,
  coordinator_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news and gallery tables
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author_id UUID REFERENCES users(id),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO kecamatan (name, code) VALUES 
('Sidoarjo', 'SDJ'),
('Buduran', 'BDR'),
('Candi', 'CDI'),
('Porong', 'PRG'),
('Krembung', 'KRB')
ON CONFLICT (code) DO NOTHING;

INSERT INTO desa (name, code, kecamatan_id) VALUES 
('Sidokare', 'SDK', (SELECT id FROM kecamatan WHERE code = 'SDJ')),
('Lemahputro', 'LMP', (SELECT id FROM kecamatan WHERE code = 'SDJ')),
('Buduran', 'BDR1', (SELECT id FROM kecamatan WHERE code = 'BDR')),
('Siwalanpanji', 'SWP', (SELECT id FROM kecamatan WHERE code = 'BDR'))
ON CONFLICT (code) DO NOTHING;
