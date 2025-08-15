<div align="center">
  <img src="/placeholder.svg?height=120&width=120" alt="NasDem Logo" width="120" height="120">
  
  # 🏛️ DPD Partai NasDem Sidoarjo
  
  **Website Resmi Dewan Pimpinan Daerah Partai NasDem Sidoarjo**
  
  *Membangun Indonesia yang Lebih Baik Bersama Rakyat*
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  
</div>

---

## 📋 Deskripsi Proyek

Website resmi DPD Partai NasDem Sidoarjo adalah platform digital yang dirancang untuk memberikan informasi terkini tentang kegiatan, program kerja, dan struktur organisasi partai. Website ini dilengkapi dengan sistem manajemen konten yang memungkinkan admin untuk mengelola berita, galeri, dan data organisasi secara efisien.

## ✨ Fitur Utama

### 🏠 **Website Publik**
- **Beranda Interaktif** - Hero section dengan informasi ketua DPD dan visi misi partai
- **Profil Partai** - Sejarah, pencapaian, dan informasi lengkap DPD NasDem Sidoarjo
- **Program Kerja** - Daftar lengkap program unggulan dengan progress tracking
- **Berita & Artikel** - Sistem berita dengan pagination dan kategori
- **Galeri Multimedia** - Koleksi foto dan video kegiatan partai
- **Struktur Organisasi** - Hierarki lengkap dari Kecamatan → Desa → TPS → Kader

### 🔐 **Sistem Admin Multi-Level**

#### **Super Admin** (`admin1`)
- 📊 Dashboard analitik dengan statistik lengkap
- 🗳️ Analisa data hasil pemilu per partai, caleg, dapil, kecamatan, dan TPS
- 👥 Manajemen pengguna dan hak akses
- 🏢 Pengelolaan struktur organisasi dan biodata anggota
- 📰 Manajemen berita dan artikel
- 🖼️ Pengelolaan galeri multimedia
- 🔒 Pengaturan keamanan sistem

#### **Admin Kecamatan** (`admin2`)
- 👨‍💼 Menambah anggota per kecamatan
- 🏘️ Manajemen koordinator TPS
- 👥 Pengelolaan 10 kader per TPS

#### **Admin Berita** (`admin3`)
- 📝 Upload dan edit berita & artikel
- 📸 Manajemen galeri foto dan video

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework dengan App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI components
- **Lucide React** - Beautiful icons

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Supabase Auth** - Authentication system
- **Row Level Security** - Database security

### **Deployment**
- **Vercel** - Hosting platform
- **Git** - Version control

## 🚀 Instalasi & Setup

### **Prerequisites**
- Node.js 18+ 
- npm atau yarn
- Git

### **1. Clone Repository**
\`\`\`bash
git clone https://github.com/your-username/nasdem-sidoarjo.git
cd nasdem-sidoarjo
\`\`\`

### **2. Install Dependencies**
\`\`\`bash
npm install
# atau
yarn install
\`\`\`

### **3. Environment Variables**
Buat file `.env.local` dan tambahkan:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### **4. Database Setup**
Jalankan script SQL di Supabase:
\`\`\`bash
# Buat tabel dan struktur database
scripts/01-create-auth-tables.sql
scripts/02-seed-organization-data.sql
scripts/03-seed-news-data.sql
scripts/04-fix-database-schema.sql
\`\`\`

### **5. Jalankan Development Server**
\`\`\`bash
npm run dev
# atau
yarn dev
\`\`\`

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Proyek

\`\`\`
nasdem-sidoarjo/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboards
│   │   ├── super/         # Super admin
│   │   ├── kecamatan/     # Kecamatan admin
│   │   └── page.tsx       # Regular admin
│   ├── berita/            # News pages
│   ├── galeri/            # Gallery pages
│   ├── kontak/            # Contact page
│   ├── login/             # Authentication
│   ├── program/           # Programs page
│   ├── struktur/          # Organization structure
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── ui/               # Shadcn UI components
│   ├── admin/            # Admin-specific components
│   └── ...               # Feature components
├── lib/                  # Utilities
│   └── supabase/         # Database client
├── scripts/              # SQL scripts
└── public/               # Static assets
\`\`\`

## 👥 Akun Admin Default

| Role | Username | Password | Akses |
|------|----------|----------|-------|
| **Super Admin** | `admin1` | `admin1` | Full access ke semua fitur |
| **Admin Kecamatan** | `admin2` | `admin2` | Manajemen anggota & kader |
| **Admin Berita** | `admin3` | `admin3` | Upload berita & galeri |

## 🎨 Design System

### **Color Palette**
- **Primary Blue**: `#001B55` - Header, footer, background utama
- **Accent Orange**: `#FF9C04` - Button, highlight, aksen
- **White**: `#FFFFFF` - Teks utama
- **Light Gray**: `#F0F0F0` - Background konten
- **Dark Red**: `#C81E1E` - CTA dan penekanan

### **Typography**
- **Heading**: Font weight 600-700
- **Body**: Font weight 400-500
- **Responsive**: Mobile-first approach

## 🔒 Keamanan

- **Row Level Security** pada semua tabel database
- **Role-based Access Control** untuk admin
- **Input validation** dan sanitization
- **HTTPS** enforcement
- **Environment variables** untuk sensitive data

## 📱 Responsive Design

Website fully responsive dengan breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Kontak

**DPD Partai NasDem Sidoarjo**
- **Ketua DPD**: Muh. Zakaria Dimas Pratama, S.Kom
- **Periode**: 2024-2029
- **Email**: dpd.nasdem.sidoarjo@gmail.com
- **Website**: [https://nasdem-sidoarjo.vercel.app](https://nasdem-sidoarjo.vercel.app)

---

<div align="center">
  <p><strong>Membangun Indonesia yang Lebih Baik Bersama Rakyat</strong></p>
  <p><em>© 2024 DPD Partai NasDem Sidoarjo. All rights reserved.</em></p>
</div>
