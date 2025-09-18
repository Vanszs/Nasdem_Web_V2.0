"use client";
import { useState } from "react";
import { AdminLayout } from "../../../components/layout/AdminLayout";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Users,
  Plus,
  Search,
  Camera,
  MapPin,
  Phone,
  Mail,
  Building,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Target,
  Map,
  Calendar,
  X,
  Trophy,
  Clock,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { useToast } from "../../../hooks/use-toast";

interface Member {
  id: string;
  name: string;
  position: string;
  department: "dpd" | "dpc" | "dprt" | "sayap" | "kader";
  subDepartment?: string; // For DPRT/DPC areas
  region?: string; // Kecamatan for DPC, Desa for DPRT
  photo: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: "active" | "inactive";
  description: string;
  achievements?: string[];
  lastActivity?: string;
}

interface RegionStats {
  region: string;
  type: "kecamatan" | "desa";
  hasDPC: boolean;
  hasDPRT: boolean;
  kaderCount: number;
  totalMembers: number;
  isEmpty: boolean;
}

// Enhanced mock data with complete regional structure and more kaders
const mockMembers: Member[] = [
  // DPD Members
  {
    id: "1",
    name: "Dr. H. Bambang Haryo Soekartono, S.Sos., M.Si",
    position: "Ketua DPD",
    department: "dpd",
    photo: "/api/placeholder/200/200",
    email: "bambang.haryo@nasdem-sidoarjo.org",
    phone: "0812-3456-7890",
    address: "Jl. Veteran No. 10, Sidoarjo",
    joinDate: "2020-01-15",
    status: "active",
    description:
      "Ketua Dewan Pimpinan Daerah Partai NasDem Kabupaten Sidoarjo periode 2020-2025",
    achievements: [
      "Ketua DPD Terpilih 2020",
      "Memimpin 18 Kecamatan",
      "Membina 350+ Kader",
    ],
    lastActivity: "Rapat Koordinasi DPC - 2 hari lalu",
  },
  {
    id: "2",
    name: "Hj. Dr. Siti Nur Azizah, S.E., M.M",
    position: "Wakil Ketua I",
    department: "dpd",
    photo: "/api/placeholder/200/200",
    email: "siti.azizah@nasdem-sidoarjo.org",
    phone: "0813-4567-8901",
    address: "Jl. Gajah Mada No. 25, Sidoarjo",
    joinDate: "2020-02-20",
    status: "active",
    description: "Wakil Ketua I DPD Partai NasDem Kabupaten Sidoarjo",
    achievements: ["Koordinator Sayap Perempuan", "Program CSR Terbaik 2023"],
    lastActivity: "Workshop Pemberdayaan Perempuan - 1 hari lalu",
  },

  // Sayap NasDem Members
  {
    id: "5",
    name: "Dewi Lestari, S.H., M.H",
    position: "Ketua Perempuan NasDem",
    department: "sayap",
    subDepartment: "Perempuan",
    photo: "/api/placeholder/200/200",
    email: "dewi.lestari@nasdem-sidoarjo.org",
    phone: "0816-7890-1234",
    address: "Jl. Kartini No. 45, Sidoarjo",
    joinDate: "2021-01-15",
    status: "active",
    description: "Ketua Perempuan NasDem Kabupaten Sidoarjo",
    achievements: ["Pembina 50+ Kader Perempuan", "Program UMKM Perempuan"],
    lastActivity: "Pelatihan Kewirausahaan - 3 hari lalu",
  },
  {
    id: "6",
    name: "Ahmad Fauzan, S.Kom",
    position: "Ketua Pemuda NasDem",
    department: "sayap",
    subDepartment: "Pemuda",
    photo: "/api/placeholder/200/200",
    email: "ahmad.fauzan@nasdem-sidoarjo.org",
    phone: "0817-8901-2345",
    address: "Jl. Sudirman No. 88, Sidoarjo",
    joinDate: "2021-02-20",
    status: "active",
    description: "Ketua Pemuda NasDem Kabupaten Sidoarjo",
    achievements: ["Koordinator 75+ Pemuda", "Program Digital Literacy"],
    lastActivity: "Seminar Teknologi - 1 hari lalu",
  },
  {
    id: "60",
    name: "Dr. H. Zakaria Al-Anshari, M.A",
    position: "Ketua Ulama NasDem",
    department: "sayap",
    subDepartment: "Ulama",
    photo: "/api/placeholder/200/200",
    email: "zakaria.alanshari@nasdem-sidoarjo.org",
    phone: "0818-1111-2222",
    address: "Jl. Masjid Agung No. 15, Sidoarjo",
    joinDate: "2021-03-10",
    status: "active",
    description: "Ketua Ulama NasDem Kabupaten Sidoarjo",
    achievements: ["Pembina 25+ Ulama", "Program Dakwah Digital"],
    lastActivity: "Kajian Keagamaan - 2 hari lalu",
  },
  {
    id: "61",
    name: "Ir. Bambang Santoso, M.T",
    position: "Ketua Profesional NasDem",
    department: "sayap",
    subDepartment: "Profesional",
    photo: "/api/placeholder/200/200",
    email: "bambang.santoso@nasdem-sidoarjo.org",
    phone: "0819-3333-4444",
    address: "Jl. Profesional No. 22, Sidoarjo",
    joinDate: "2021-04-05",
    status: "active",
    description: "Ketua Profesional NasDem Kabupaten Sidoarjo",
    achievements: ["Network 100+ Profesional", "Program Mentoring Karir"],
    lastActivity: "Workshop Profesional - 1 hari lalu",
  },
  {
    id: "62",
    name: "Hj. Siti Nurhaliza, S.E",
    position: "Ketua Pengusaha NasDem",
    department: "sayap",
    subDepartment: "Pengusaha",
    photo: "/api/placeholder/200/200",
    email: "siti.nurhaliza@nasdem-sidoarjo.org",
    phone: "0820-5555-6666",
    address: "Jl. Bisnis Center No. 88, Sidoarjo",
    joinDate: "2021-05-15",
    status: "active",
    description: "Ketua Pengusaha NasDem Kabupaten Sidoarjo",
    achievements: ["Jaringan 80+ UKM", "Program Akses Modal UMKM"],
    lastActivity: "Forum Bisnis - 2 hari lalu",
  },
  {
    id: "63",
    name: "Prof. Dr. Ahmad Solichin, M.Pd",
    position: "Ketua Guru NasDem",
    department: "sayap",
    subDepartment: "Guru",
    photo: "/api/placeholder/200/200",
    email: "ahmad.solichin@nasdem-sidoarjo.org",
    phone: "0821-7777-8888",
    address: "Jl. Pendidikan No. 45, Sidoarjo",
    joinDate: "2021-06-10",
    status: "active",
    description: "Ketua Guru NasDem Kabupaten Sidoarjo",
    achievements: ["Network 200+ Guru", "Program Pelatihan Digital"],
    lastActivity: "Seminar Pendidikan - 3 hari lalu",
  },
  {
    id: "64",
    name: "dr. Faridah Hanum, Sp.A",
    position: "Ketua Tenaga Kesehatan NasDem",
    department: "sayap",
    subDepartment: "Tenaga Kesehatan",
    photo: "/api/placeholder/200/200",
    email: "faridah.hanum@nasdem-sidoarjo.org",
    phone: "0822-9999-0000",
    address: "Jl. Kesehatan No. 12, Sidoarjo",
    joinDate: "2021-07-20",
    status: "active",
    description: "Ketua Tenaga Kesehatan NasDem Kabupaten Sidoarjo",
    achievements: ["Koordinasi 150+ Nakes", "Program Kesehatan Gratis"],
    lastActivity: "Bakti Sosial Kesehatan - 1 hari lalu",
  },

  // DPC Members - Multiple Kecamatan
  {
    id: "7",
    name: "H. Achmad Suryadi, S.E",
    position: "Ketua DPC",
    department: "dpc",
    region: "Sidoarjo",
    photo: "/api/placeholder/200/200",
    email: "achmad.suryadi@nasdem-sidoarjo.org",
    phone: "0818-9012-3456",
    address: "Jl. Raya Sidoarjo No. 123, Sidoarjo",
    joinDate: "2021-03-10",
    status: "active",
    description: "Ketua DPC Kecamatan Sidoarjo",
    achievements: ["Membina 15 DPRT", "150+ Kader Aktif"],
    lastActivity: "Monitoring DPRT Desa - 1 hari lalu",
  },
  {
    id: "8",
    name: "Hj. Fatimah Zahra, S.Pd",
    position: "Sekretaris DPC",
    department: "dpc",
    region: "Sidoarjo",
    photo: "/api/placeholder/200/200",
    email: "fatimah.zahra@nasdem-sidoarjo.org",
    phone: "0819-0123-4567",
    address: "Jl. Ahmad Yani No. 67, Sidoarjo",
    joinDate: "2021-04-15",
    status: "active",
    description: "Sekretaris DPC Kecamatan Sidoarjo",
    achievements: ["Administrasi Terbaik 2023", "Database Kader Terlengkap"],
    lastActivity: "Update Data Kader - 2 jam lalu",
  },
  {
    id: "50",
    name: "Dr. H. Sutrisno, M.Si",
    position: "Ketua DPC",
    department: "dpc",
    region: "Gedangan",
    photo: "/api/placeholder/200/200",
    email: "sutrisno@nasdem-sidoarjo.org",
    phone: "0821-5555-1111",
    address: "Jl. Raya Gedangan No. 45, Gedangan",
    joinDate: "2021-05-10",
    status: "active",
    description: "Ketua DPC Kecamatan Gedangan",
    achievements: ["Membina 12 DPRT", "120+ Kader Aktif"],
    lastActivity: "Rapat Koordinasi - 1 hari lalu",
  },
  {
    id: "51",
    name: "Hj. Aminah Sari, S.E",
    position: "Ketua DPC",
    department: "dpc",
    region: "Taman",
    photo: "/api/placeholder/200/200",
    email: "aminah.sari@nasdem-sidoarjo.org",
    phone: "0822-6666-2222",
    address: "Jl. Raya Taman No. 88, Taman",
    joinDate: "2021-06-15",
    status: "active",
    description: "Ketua DPC Kecamatan Taman",
    achievements: ["Membina 10 DPRT", "100+ Kader Aktif"],
    lastActivity: "Sosialisasi Program - 2 hari lalu",
  },

  // DPRT Members with Kaders - Cemengkalang Village
  {
    id: "9",
    name: "H. Imam Syafi'i, S.Ag",
    position: "Ketua DPRT",
    department: "dprt",
    region: "Sidoarjo",
    subDepartment: "Cemengkalang",
    photo: "/api/placeholder/200/200",
    email: "imam.syafii@nasdem-sidoarjo.org",
    phone: "0820-1234-5678",
    address: "Desa Cemengkalang, Sidoarjo",
    joinDate: "2022-01-10",
    status: "active",
    description: "Ketua DPRT Desa Cemengkalang",
    achievements: ["Membina 10 Kader Desa", "Program Gotong Royong Terbaik"],
    lastActivity: "Rapat Kader Desa - 1 hari lalu",
  },

  // 10 Kaders for Cemengkalang
  {
    id: "10",
    name: "Muhammad Ali Rahman",
    position: "Kader Desa",
    department: "kader",
    region: "Sidoarjo",
    subDepartment: "Cemengkalang",
    photo: "/api/placeholder/200/200",
    email: "ali.rahman@nasdem-sidoarjo.org",
    phone: "0821-2345-6789",
    address: "RT 01/RW 02, Desa Cemengkalang",
    joinDate: "2022-02-15",
    status: "active",
    description: "Kader Aktif Desa Cemengkalang",
    achievements: ["Koordinator RT 01", "Program Bersih Desa"],
    lastActivity: "Sosialisasi Program Partai - 2 hari lalu",
  },
  {
    id: "11",
    name: "Siti Khadijah",
    position: "Kader Desa",
    department: "kader",
    region: "Sidoarjo",
    subDepartment: "Cemengkalang",
    photo: "/api/placeholder/200/200",
    email: "siti.khadijah@nasdem-sidoarjo.org",
    phone: "0822-3456-7890",
    address: "RT 02/RW 01, Desa Cemengkalang",
    joinDate: "2022-03-10",
    status: "active",
    description: "Kader PKK Desa Cemengkalang",
    achievements: ["Ketua PKK RT", "Program Posyandu"],
    lastActivity: "Kegiatan PKK - 1 hari lalu",
  },
  {
    id: "12",
    name: "Ahmad Fauzi",
    position: "Kader Desa",
    department: "kader",
    region: "Sidoarjo",
    subDepartment: "Cemengkalang",
    photo: "/api/placeholder/200/200",
    email: "ahmad.fauzi@nasdem-sidoarjo.org",
    phone: "0823-4567-8901",
    address: "RT 01/RW 03, Desa Cemengkalang",
    joinDate: "2022-04-05",
    status: "active",
    description: "Kader Pemuda Desa Cemengkalang",
    achievements: ["Koordinator Karang Taruna"],
    lastActivity: "Rapat Pemuda - 3 hari lalu",
  },
  {
    id: "13",
    name: "Fatimah Az-Zahra",
    position: "Kader Desa",
    department: "kader",
    region: "Sidoarjo",
    subDepartment: "Cemengkalang",
    photo: "/api/placeholder/200/200",
    email: "fatimah.azzahra@nasdem-sidoarjo.org",
    phone: "0824-5678-9012",
    address: "RT 03/RW 02, Desa Cemengkalang",
    joinDate: "2022-05-12",
    status: "active",
    description: "Kader Perempuan Desa Cemengkalang",
    achievements: ["Koordinator Perempuan RT"],
    lastActivity: "Program Posyandu - 4 hari lalu",
  },
  {
    id: "14",
    name: "Budi Santoso",
    position: "Kader Desa",
    department: "kader",
    region: "Sidoarjo",
    subDepartment: "Cemengkalang",
    photo: "/api/placeholder/200/200",
    email: "budi.santoso.kader@nasdem-sidoarjo.org",
    phone: "0825-6789-0123",
    address: "RT 02/RW 03, Desa Cemengkalang",
    joinDate: "2022-06-18",
    status: "active",
    description: "Kader Pertanian Desa Cemengkalang",
    achievements: ["Program Tani Milenial"],
    lastActivity: "Penyuluhan Pertanian - 3 hari lalu",
  },
  {
    id: "15",
    name: "Sri Wahyuni",
    position: "Kader Desa",
    department: "kader",
    region: "Sidoarjo",
    subDepartment: "Cemengkalang",
    photo: "/api/placeholder/200/200",
    email: "sri.wahyuni@nasdem-sidoarjo.org",
    phone: "0826-7890-1234",
    address: "RT 01/RW 01, Desa Cemengkalang",
    joinDate: "2022-07-22",
    status: "active",
    description: "Kader UMKM Desa Cemengkalang",
    achievements: ["Koordinator UMKM Desa"],
    lastActivity: "Workshop UMKM - 2 hari lalu",
  },
  {
    id: "16",
    name: "Agus Purnomo",
    position: "Kader Desa",
    department: "kader",
    region: "Sidoarjo",
    subDepartment: "Cemengkalang",
    photo: "/api/placeholder/200/200",
    email: "agus.purnomo@nasdem-sidoarjo.org",
    phone: "0827-8901-2345",
    address: "RT 03/RW 01, Desa Cemengkalang",
    joinDate: "2022-08-14",
    status: "active",
    description: "Kader Keamanan Desa Cemengkalang",
    achievements: ["Koordinator Siskamling"],
    lastActivity: "Rapat Keamanan - 1 hari lalu",
  },
  {
    id: "17",
    name: "Dewi Sartika",
    position: "Kader Desa",
    department: "kader",
    region: "Sidoarjo",
    subDepartment: "Cemengkalang",
    photo: "/api/placeholder/200/200",
    email: "dewi.sartika@nasdem-sidoarjo.org",
    phone: "0828-9012-3456",
    address: "RT 02/RW 02, Desa Cemengkalang",
    joinDate: "2022-09-08",
    status: "active",
    description: "Kader Kesehatan Desa Cemengkalang",
    achievements: ["Program Kesehatan Ibu & Anak"],
    lastActivity: "Posyandu Balita - 2 hari lalu",
  },
  {
    id: "18",
    name: "Hendra Wijaya",
    position: "Kader Desa",
    department: "kader",
    region: "Sidoarjo",
    subDepartment: "Cemengkalang",
    photo: "/api/placeholder/200/200",
    email: "hendra.wijaya@nasdem-sidoarjo.org",
    phone: "0829-0123-4567",
    address: "RT 01/RW 04, Desa Cemengkalang",
    joinDate: "2022-10-15",
    status: "active",
    description: "Kader Lingkungan Desa Cemengkalang",
    achievements: ["Program Desa Hijau"],
    lastActivity: "Kerja Bakti - 1 hari lalu",
  },
  {
    id: "19",
    name: "Nurul Hidayah",
    position: "Kader Desa",
    department: "kader",
    region: "Sidoarjo",
    subDepartment: "Cemengkalang",
    photo: "/api/placeholder/200/200",
    email: "nurul.hidayah@nasdem-sidoarjo.org",
    phone: "0830-1234-5678",
    address: "RT 03/RW 03, Desa Cemengkalang",
    joinDate: "2022-11-20",
    status: "active",
    description: "Kader Pendidikan Desa Cemengkalang",
    achievements: ["Program Bimbel Gratis"],
    lastActivity: "Mengajar Bimbel - 1 hari lalu",
  },

  // Another DPRT - Kalanganyar with 10 kaders
  {
    id: "20",
    name: "H. Abdul Rahman, S.Pd",
    position: "Ketua DPRT",
    department: "dprt",
    region: "Sedati",
    subDepartment: "Kalanganyar",
    photo: "/api/placeholder/200/200",
    email: "abdul.rahman@nasdem-sidoarjo.org",
    phone: "0831-2345-6789",
    address: "Desa Kalanganyar, Sedati",
    joinDate: "2022-03-15",
    status: "active",
    description: "Ketua DPRT Desa Kalanganyar",
    achievements: ["Membina 10 Kader Desa", "Program Pendidikan Terbaik"],
    lastActivity: "Rapat Evaluasi - 1 hari lalu",
  },
  // 10 Kaders for Kalanganyar
  {
    id: "21",
    name: "Sumarno",
    position: "Kader Desa",
    department: "kader",
    region: "Sedati",
    subDepartment: "Kalanganyar",
    photo: "/api/placeholder/200/200",
    email: "sumarno@nasdem-sidoarjo.org",
    phone: "0832-3456-7890",
    address: "RT 01/RW 01, Kalanganyar",
    joinDate: "2022-04-10",
    status: "active",
    description: "Kader Nelayan Kalanganyar",
    achievements: ["Ketua Kelompok Nelayan"],
    lastActivity: "Koordinasi Nelayan - 2 hari lalu",
  },
  {
    id: "22",
    name: "Siti Aminah",
    position: "Kader Desa",
    department: "kader",
    region: "Sedati",
    subDepartment: "Kalanganyar",
    photo: "/api/placeholder/200/200",
    email: "siti.aminah@nasdem-sidoarjo.org",
    phone: "0833-4567-8901",
    address: "RT 02/RW 01, Kalanganyar",
    joinDate: "2022-04-20",
    status: "active",
    description: "Kader Pengolahan Ikan",
    achievements: ["UMKM Olahan Ikan Terbaik"],
    lastActivity: "Pelatihan UMKM - 1 hari lalu",
  },
  // ... (tambahan 8 kader lagi untuk Kalanganyar)
];

// Data kecamatan dan desa yang tersedia
const availableRegions = [
  { value: "all", label: "Semua Kecamatan" },
  { value: "Sidoarjo", label: "Kec. Sidoarjo" },
  { value: "Gedangan", label: "Kec. Gedangan" },
  { value: "Taman", label: "Kec. Taman" },
  { value: "Sedati", label: "Kec. Sedati" },
  { value: "Sukodono", label: "Kec. Sukodono" },
  { value: "Jabon", label: "Kec. Jabon (Kosong)" },
  { value: "Krembung", label: "Kec. Krembung (Kosong)" },
  { value: "Porong", label: "Kec. Porong (Kosong)" },
  { value: "Tanggulangin", label: "Kec. Tanggulangin (Kosong)" },
];

const availableSubRegions = {
  Sidoarjo: [
    { value: "all", label: "Semua Desa" },
    { value: "Cemengkalang", label: "Desa Cemengkalang" },
    { value: "Sidokumpul", label: "Desa Sidokumpul (Kosong)" },
    { value: "Gebang", label: "Desa Gebang (Kosong)" },
  ],
  Sedati: [
    { value: "all", label: "Semua Desa" },
    { value: "Kalanganyar", label: "Desa Kalanganyar" },
    { value: "Sedatiagung", label: "Desa Sedatiagung (Kosong)" },
  ],
  Gedangan: [
    { value: "all", label: "Semua Desa" },
    { value: "Kedungrejo", label: "Desa Kedungrejo (Kosong)" },
    { value: "Tropodo", label: "Desa Tropodo (Kosong)" },
  ],
  Taman: [
    { value: "all", label: "Semua Desa" },
    { value: "Jemundo", label: "Desa Jemundo (Kosong)" },
    { value: "Trosobo", label: "Desa Trosobo (Kosong)" },
  ],
};

export function MemberListPage() {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"dpd" | "sayap" | "dpc" | "dprt">(
    "dpd"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Separate filters for each tab
  const [dpdFilters, setDpdFilters] = useState({
    searchTerm: "",
    departmentFilter: "all",
  });
  const [sayapFilters, setSayapFilters] = useState({
    searchTerm: "",
    departmentFilter: "all",
  });
  const [dpcFilters, setDpcFilters] = useState({
    searchTerm: "",
    regionFilter: "all",
  });
  const [dprtFilters, setDprtFilters] = useState({
    searchTerm: "",
    regionFilter: "all",
    subRegionFilter: "all",
    departmentFilter: "all",
  });

  const itemsPerPage = 8;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "dpd" as "dpd" | "dpc" | "dprt" | "sayap",
    subDepartment: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    photoFile: null as File | null,
  });

  // Helper function to get current filters based on active tab
  const getCurrentFilters = () => {
    if (activeTab === "dpd") {
      return dpdFilters;
    } else if (activeTab === "sayap") {
      return sayapFilters;
    } else if (activeTab === "dpc") {
      return dpcFilters;
    } else {
      return dprtFilters;
    }
  };

  // Helper functions for type-safe filter access
  const getDpcFilters = () =>
    activeTab === "dpc" ? dpcFilters : { searchTerm: "", regionFilter: "all" };
  const getDprtFilters = () =>
    activeTab === "dprt"
      ? dprtFilters
      : {
          searchTerm: "",
          regionFilter: "all",
          subRegionFilter: "all",
          departmentFilter: "all",
        };

  const filteredMembers = members.filter((member) => {
    // Get current filters based on active tab
    let currentFilters = getCurrentFilters();

    const matchesSearch =
      member.name
        .toLowerCase()
        .includes(currentFilters.searchTerm.toLowerCase()) ||
      member.position
        .toLowerCase()
        .includes(currentFilters.searchTerm.toLowerCase());

    // Filter by active tab first
    let matchesTab = false;
    if (activeTab === "dpd") {
      matchesTab = member.department === "dpd";
    } else if (activeTab === "sayap") {
      matchesTab = member.department === "sayap";
    } else if (activeTab === "dpc") {
      matchesTab = member.department === "dpc";
    } else if (activeTab === "dprt") {
      matchesTab = member.department === "dprt"; // Only DPRT, not kader
    }

    // Department filter for DPD and Sayap tabs
    const matchesDepartment =
      !("departmentFilter" in currentFilters) ||
      currentFilters.departmentFilter === "all" ||
      member.department === currentFilters.departmentFilter;

    // Region filter for DPC and DPRT tabs
    const matchesRegion =
      !("regionFilter" in currentFilters) ||
      currentFilters.regionFilter === "all" ||
      member.region === currentFilters.regionFilter ||
      (!member.region && currentFilters.regionFilter === "all");

    // Sub-region filter for DPRT tab
    const matchesSubRegion =
      !("subRegionFilter" in currentFilters) ||
      currentFilters.subRegionFilter === "all" ||
      member.subDepartment === currentFilters.subRegionFilter ||
      (!member.subDepartment && currentFilters.subRegionFilter === "all");

    return (
      matchesSearch &&
      matchesTab &&
      matchesDepartment &&
      matchesRegion &&
      matchesSubRegion
    );
  });

  // Get available sub-regions based on selected region for DPRT
  const getAvailableSubRegions = () => {
    if (dprtFilters.regionFilter === "all")
      return [{ value: "all", label: "Semua Desa" }];
    return (
      availableSubRegions[
        dprtFilters.regionFilter as keyof typeof availableSubRegions
      ] || [{ value: "all", label: "Semua Desa" }]
    );
  };

  // Reset sub-region filter when region changes for DPRT
  const handleDprtRegionChange = (value: string) => {
    setDprtFilters((prev) => ({
      ...prev,
      regionFilter: value,
      subRegionFilter: "all",
    }));
  };

  // Reset sub-region filter when region changes for DPC
  const handleDpcRegionChange = (value: string) => {
    setDpcFilters((prev) => ({
      ...prev,
      regionFilter: value,
    }));
  };

  // Get DPRT leader for a specific village
  const getDPRTLeader = (region: string, subDepartment: string) => {
    return members.find(
      (member) =>
        member.department === "dprt" &&
        member.region === region &&
        member.subDepartment === subDepartment &&
        member.position.toLowerCase().includes("ketua")
    );
  };

  // Get kader count for DPRT
  const getKaderCount = (region: string, subDepartment: string) => {
    return members.filter(
      (member) =>
        member.department === "kader" &&
        member.region === region &&
        member.subDepartment === subDepartment
    ).length;
  };

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photoFile: file }));
    }
  };

  const handleAddMember = () => {
    if (!formData.name || !formData.position) {
      toast({
        title: "Error",
        description: "Nama dan posisi wajib diisi",
        variant: "destructive",
      });
      return;
    }

    // Simulate adding member
    const newMember: Member = {
      id: `${Date.now()}`,
      name: formData.name,
      position: formData.position,
      department: formData.department,
      subDepartment: formData.subDepartment || undefined,
      photo: formData.photoFile
        ? URL.createObjectURL(formData.photoFile)
        : "/api/placeholder/200/200",
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
      description: formData.description,
    };

    setMembers((prev) => [newMember, ...prev]);

    toast({
      title: "Berhasil",
      description: `Anggota "${formData.name}" berhasil ditambahkan`,
    });

    // Reset form
    setFormData({
      name: "",
      position: "",
      department: "dpd",
      subDepartment: "",
      email: "",
      phone: "",
      address: "",
      description: "",
      photoFile: null,
    });
    setIsAddDialogOpen(false);
  };

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsDetailModalOpen(true);
  };

  const statusConfig = {
    active: {
      label: "Aktif",
      className:
        "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25",
    },
    inactive: {
      label: "Tidak Aktif",
      className:
        "bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg shadow-slate-400/25",
    },
  };

  const departmentConfig = {
    dpd: {
      label: "DPD",
      className:
        "bg-gradient-to-r from-[#001B55] to-[#003875] text-white shadow-lg shadow-[#001B55]/30",
    },
    sayap: {
      label: "Sayap NasDem",
      className:
        "bg-gradient-to-r from-[#FF9C04] to-[#FFB84D] text-white shadow-lg shadow-[#FF9C04]/30",
    },
    dpc: {
      label: "DPC",
      className:
        "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/30",
    },
    dprt: {
      label: "DPRT",
      className:
        "bg-gradient-to-r from-amber-700 to-amber-800 text-white shadow-lg shadow-amber-700/30",
    },
    kader: {
      label: "Kader",
      className:
        "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-600/30",
    },
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Struktur", href: "/structure/dpd" },
    { label: "Daftar Anggota" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-orange-50/30 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-blue-900/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001B55]/5 via-transparent to-[#FF9C04]/5"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#001B55] via-[#003875] to-[#FF9C04] bg-clip-text text-transparent">
                Struktur Organisasi
              </h1>
              <p className="text-slate-600 text-lg font-medium">
                Kelola data struktur organisasi Partai NasDem Sidoarjo
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="relative overflow-hidden bg-gradient-to-r from-[#FF9C04] via-[#FFB84D] to-[#FF9C04] hover:from-[#001B55] hover:via-[#003875] hover:to-[#001B55] text-white font-semibold px-8 py-3 rounded-2xl shadow-xl shadow-[#FF9C04]/25 hover:shadow-[#001B55]/25 transition-all duration-500 transform hover:scale-105 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Plus className="mr-2 h-5 w-5 relative z-10" />
                  <span className="relative z-10">Tambah Anggota</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-blue-900/20">
                <DialogHeader className="pb-6">
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#001B55] to-[#FF9C04] bg-clip-text text-transparent">
                    Tambah Anggota Baru
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Photo Upload */}
                  <div className="flex justify-center mb-8">
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#001B55] to-[#FF9C04] rounded-full blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <Avatar className="relative w-32 h-32 border-4 border-white shadow-2xl shadow-blue-900/20">
                        <AvatarImage
                          src={
                            formData.photoFile
                              ? URL.createObjectURL(formData.photoFile)
                              : ""
                          }
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                          <Camera className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="photo-upload"
                        className="absolute bottom-2 right-2 bg-gradient-to-r from-[#FF9C04] to-[#FFB84D] hover:from-[#001B55] hover:to-[#003875] text-white rounded-full p-3 cursor-pointer shadow-xl shadow-[#FF9C04]/25 hover:shadow-[#001B55]/25 transition-all duration-300 transform hover:scale-110"
                      >
                        <Camera className="h-5 w-5" />
                      </label>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Nama Lengkap *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Masukkan nama lengkap"
                        className="bg-white/50 backdrop-blur-sm border-2 border-slate-200/60 hover:border-[#001B55]/30 focus:border-[#001B55] rounded-xl px-4 py-3 transition-all duration-300 focus:shadow-lg focus:shadow-[#001B55]/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="position"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Posisi/Jabatan *
                      </Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            position: e.target.value,
                          }))
                        }
                        placeholder="Masukkan posisi/jabatan"
                        className="bg-white/50 backdrop-blur-sm border-2 border-slate-200/60 hover:border-[#001B55]/30 focus:border-[#001B55] rounded-xl px-4 py-3 transition-all duration-300 focus:shadow-lg focus:shadow-[#001B55]/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="department"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Departemen
                      </Label>
                      <Select
                        value={formData.department}
                        onValueChange={(
                          value: "dpd" | "dpc" | "dprt" | "sayap"
                        ) =>
                          setFormData((prev) => ({
                            ...prev,
                            department: value,
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white/50 backdrop-blur-sm border-2 border-slate-200/60 hover:border-[#001B55]/30 focus:border-[#001B55] rounded-xl px-4 py-3 transition-all duration-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl">
                          <SelectItem value="dpd" className="rounded-lg">
                            DPD
                          </SelectItem>
                          <SelectItem value="sayap" className="rounded-lg">
                            Sayap NasDem
                          </SelectItem>
                          <SelectItem value="dpc" className="rounded-lg">
                            DPC
                          </SelectItem>
                          <SelectItem value="dprt" className="rounded-lg">
                            DPRT
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.department === "dprt" && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="subDepartment"
                          className="text-sm font-semibold text-slate-700"
                        >
                          Nama Desa/Kelurahan
                        </Label>
                        <Input
                          id="subDepartment"
                          value={formData.subDepartment}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              subDepartment: e.target.value,
                            }))
                          }
                          placeholder="Masukkan nama desa/kelurahan"
                          className="bg-white/50 backdrop-blur-sm border-2 border-slate-200/60 hover:border-[#001B55]/30 focus:border-[#001B55] rounded-xl px-4 py-3 transition-all duration-300 focus:shadow-lg focus:shadow-[#001B55]/10"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="email@example.com"
                        className="bg-white/50 backdrop-blur-sm border-2 border-slate-200/60 hover:border-[#001B55]/30 focus:border-[#001B55] rounded-xl px-4 py-3 transition-all duration-300 focus:shadow-lg focus:shadow-[#001B55]/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Telepon
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="0812-3456-7890"
                        className="bg-white/50 backdrop-blur-sm border-2 border-slate-200/60 hover:border-[#001B55]/30 focus:border-[#001B55] rounded-xl px-4 py-3 transition-all duration-300 focus:shadow-lg focus:shadow-[#001B55]/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Alamat
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Masukkan alamat"
                        className="bg-white/50 backdrop-blur-sm border-2 border-slate-200/60 hover:border-[#001B55]/30 focus:border-[#001B55] rounded-xl px-4 py-3 transition-all duration-300 focus:shadow-lg focus:shadow-[#001B55]/10"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Deskripsi
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Deskripsi tugas dan peran"
                        className="bg-white/50 backdrop-blur-sm border-2 border-slate-200/60 hover:border-[#001B55]/30 focus:border-[#001B55] rounded-xl px-4 py-3 min-h-[120px] transition-all duration-300 focus:shadow-lg focus:shadow-[#001B55]/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-slate-200/50">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="px-8 py-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-700 font-medium transition-all duration-300 hover:shadow-lg"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleAddMember}
                    className="px-8 py-3 bg-gradient-to-r from-[#FF9C04] via-[#FFB84D] to-[#FF9C04] hover:from-[#001B55] hover:via-[#003875] hover:to-[#001B55] text-white font-semibold rounded-xl shadow-xl shadow-[#FF9C04]/25 hover:shadow-[#001B55]/25 transition-all duration-500 transform hover:scale-105"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Tambah Anggota
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/10 border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-orange-50/30"></div>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "dpd" | "sayap" | "dpc" | "dprt");
              setCurrentPage(1);
            }}
          >
            <TabsList className="relative grid w-full grid-cols-4 bg-transparent border-0 p-2">
              <TabsTrigger
                value="dpd"
                className="relative px-6 py-4 rounded-2xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#001B55] data-[state=active]:to-[#003875] data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-[#001B55]/25 text-slate-600 hover:text-slate-800 hover:bg-slate-50/50"
              >
                DPD
              </TabsTrigger>
              <TabsTrigger
                value="sayap"
                className="relative px-6 py-4 rounded-2xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-fuchsia-600 data-[state=active]:to-fuchsia-700 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-fuchsia-600/25 text-slate-600 hover:text-slate-800 hover:bg-slate-50/50"
              >
                Sayap
              </TabsTrigger>
              <TabsTrigger
                value="dpc"
                className="relative px-6 py-4 rounded-2xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-emerald-600/25 text-slate-600 hover:text-slate-800 hover:bg-slate-50/50"
              >
                DPC
              </TabsTrigger>
              <TabsTrigger
                value="dprt"
                className="relative px-6 py-4 rounded-2xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-700 data-[state=active]:to-amber-800 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-amber-700/25 text-slate-600 hover:text-slate-800 hover:bg-slate-50/50"
              >
                DPRT
              </TabsTrigger>
            </TabsList>

            {/* Regional Analysis Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-6">
              <Card className="lg:col-span-2 relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-orange-50/30"></div>
                <CardHeader className="relative pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                    <Map className="h-6 w-6 text-[#001B55]" />
                    Analisis Cakupan Regional
                  </CardTitle>
                  <p className="text-slate-600 mt-2">
                    Status organisasi per wilayah dan identifikasi area kosong
                  </p>
                </CardHeader>
                <CardContent className="relative space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/50 p-4 rounded-2xl border border-blue-200/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-700">18</p>
                          <p className="text-sm text-blue-600">Kecamatan</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-blue-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full w-4/5"></div>
                        </div>
                        <span className="text-xs text-blue-600">80% DPC</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50/50 to-green-100/50 p-4 rounded-2xl border border-green-200/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-700">
                            320
                          </p>
                          <p className="text-sm text-green-600">Desa</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-green-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full w-3/5"></div>
                        </div>
                        <span className="text-xs text-green-600">60% DPRT</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50/50 to-purple-100/50 p-4 rounded-2xl border border-purple-200/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-700">
                            1,250
                          </p>
                          <p className="text-sm text-purple-600">Kader</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-purple-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full w-2/3"></div>
                        </div>
                        <span className="text-xs text-purple-600">
                          Target 2000
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50/50 to-orange-100/50 p-4 rounded-2xl border border-orange-200/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-orange-700">
                            42
                          </p>
                          <p className="text-sm text-orange-600">Area Kosong</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-orange-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full w-1/4"></div>
                        </div>
                        <span className="text-xs text-orange-600">
                          Perlu Penugasan
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50/50 to-red-50/50 p-5 rounded-2xl border border-orange-200/30">
                    <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Prioritas Penugasan Area Kosong
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-slate-700 mb-2">
                          DPC Belum Ada (4 Kecamatan):
                        </p>
                        <ul className="space-y-1 text-slate-600">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Kec. Jabon - Perlu Ketua & Pengurus</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Kec. Krembung - Perlu Ketua & Pengurus</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Kec. Porong - Perlu Ketua & Pengurus</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>
                              Kec. Tanggulangin - Perlu Ketua & Pengurus
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 mb-2">
                          DPRT Prioritas (38 Desa):
                        </p>
                        <ul className="space-y-1 text-slate-600">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>15 Desa di Kec. Sidoarjo - Perlu DPRT</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>12 Desa di Kec. Gedangan - Perlu DPRT</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>8 Desa di Kec. Taman - Perlu DPRT</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>3 Desa di Kec. Sukodono - Perlu DPRT</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">
                        💡 <strong>Tip:</strong> Gunakan filter kecamatan dan
                        desa untuk melihat area mana yang sudah memiliki
                        DPC/DPRT dan mana yang masih kosong.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#001B55]/5 to-[#FF9C04]/5"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                    <Target className="h-6 w-6 text-[#FF9C04]" />
                    Aksi Strategis
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl transition-all duration-300">
                    <Plus className="h-4 w-4 mr-2" />
                    Rekrut DPC Baru
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl transition-all duration-300">
                    <Users className="h-4 w-4 mr-2" />
                    Bentuk DPRT Desa
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl transition-all duration-300">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Kaderisasi Massal
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-3 rounded-xl transition-all duration-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    Jadwalkan Rapat
                  </Button>

                  <div className="mt-6 p-4 bg-gradient-to-r from-slate-50/50 to-slate-100/50 rounded-xl border border-slate-200/50">
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Target Bulanan
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">DPC Baru</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full w-1/2"></div>
                          </div>
                          <span className="text-xs font-semibold text-blue-600">
                            2/4
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">
                          DPRT Baru
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full w-3/5"></div>
                          </div>
                          <span className="text-xs font-semibold text-green-600">
                            8/15
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">
                          Kader Baru
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full w-2/5"></div>
                          </div>
                          <span className="text-xs font-semibold text-purple-600">
                            45/100
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <TabsContent value="dpd" className="mt-8">
              <Card className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl shadow-blue-900/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent"></div>
                <CardContent className="relative p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black h-5 w-5" />
                      <Input
                        placeholder="Cari anggota DPD..."
                        value={dpdFilters.searchTerm}
                        onChange={(e) => {
                          if (activeTab === "dpd") {
                            setDpdFilters({
                              ...dpdFilters,
                              searchTerm: e.target.value,
                            });
                          }
                        }}
                        className="pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-slate-200/50 hover:border-[#001B55]/30 focus:border-[#001B55] rounded-xl transition-all duration-300 focus:shadow-lg focus:shadow-[#001B55]/10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sayap" className="mt-8">
              <Card className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl shadow-fuchsia-600/10">
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-50/30 to-transparent"></div>
                <CardContent className="relative p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black h-5 w-5" />
                      <Input
                        placeholder="Cari nama atau posisi sayap..."
                        value={sayapFilters.searchTerm}
                        onChange={(e) =>
                          setSayapFilters({
                            ...sayapFilters,
                            searchTerm: e.target.value,
                          })
                        }
                        className="pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-slate-200/50 hover:border-fuchsia-600/30 focus:border-fuchsia-600 rounded-xl transition-all duration-300"
                      />
                    </div>
                    <Select
                      value={sayapFilters.departmentFilter}
                      onValueChange={(value) =>
                        setSayapFilters({
                          ...sayapFilters,
                          departmentFilter: value,
                        })
                      }
                    >
                      <SelectTrigger className="w-full text-black md:w-[240px] bg-white/70 backdrop-blur-sm border-2 border-slate-200/50 hover:border-fuchsia-600/30 focus:border-fuchsia-600 rounded-xl px-4 py-3 transition-all duration-300">
                        <SelectValue
                          placeholder="Filter Sayap"
                          className="text-black"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl text-black">
                        <SelectItem
                          value="all"
                          className="rounded-lg text-black"
                        >
                          Semua Sayap
                        </SelectItem>
                        <SelectItem
                          value="Perempuan"
                          className="rounded-lg text-black"
                        >
                          Perempuan NasDem
                        </SelectItem>
                        <SelectItem
                          value="Pemuda"
                          className="rounded-lg text-black"
                        >
                          Pemuda NasDem
                        </SelectItem>
                        <SelectItem
                          value="Ulama"
                          className="rounded-lg text-black"
                        >
                          Ulama NasDem
                        </SelectItem>
                        <SelectItem
                          value="Profesional"
                          className="rounded-lg text-black"
                        >
                          Profesional NasDem
                        </SelectItem>
                        <SelectItem
                          value="Pengusaha"
                          className="rounded-lg text-black"
                        >
                          Pengusaha NasDem
                        </SelectItem>
                        <SelectItem
                          value="Guru"
                          className="rounded-lg text-black"
                        >
                          Guru NasDem
                        </SelectItem>
                        <SelectItem
                          value="Tenaga Kesehatan"
                          className="rounded-lg text-black"
                        >
                          Tenaga Kesehatan NasDem
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {(() => {
                const sayapMembers = filteredMembers.filter(
                  (member) =>
                    member.department === "sayap" &&
                    (sayapFilters.departmentFilter === "all" ||
                      member.subDepartment === sayapFilters.departmentFilter)
                );

                if (sayapMembers.length === 0) {
                  return (
                    <Card className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-fuchsia-900/10 mt-8">
                      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-50/20 via-transparent to-fuchsia-50/20"></div>
                      <CardContent className="relative p-16 text-center">
                        <div className="max-w-md mx-auto space-y-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-200 to-fuchsia-300 rounded-full blur-2xl opacity-30"></div>
                            <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 rounded-full flex items-center justify-center">
                              <Users className="h-12 w-12 text-fuchsia-400" />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-2xl font-bold text-slate-800">
                              Belum ada anggota sayap
                            </h3>
                            <p className="text-slate-600 text-lg">
                              {sayapFilters.departmentFilter !== "all"
                                ? `Belum ada anggota di sayap ${sayapFilters.departmentFilter}`
                                : "Tambahkan anggota sayap untuk mengelola struktur organisasi sayap"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }

                return (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {sayapMembers.map((member) => (
                      <Card
                        key={member.id}
                        onClick={() => handleMemberClick(member)}
                        className="group relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 transform hover:scale-105 cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-50/20 via-transparent to-fuchsia-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <CardHeader className="relative p-6 pb-4">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                              <div className="absolute -inset-3 bg-gradient-to-r from-fuchsia-600 via-fuchsia-400 to-fuchsia-600 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                              <Avatar className="relative w-24 h-24 border-4 border-white/50 shadow-2xl shadow-fuchsia-900/20">
                                <AvatarImage
                                  src={member.photo}
                                  className="object-cover"
                                />
                                <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 text-lg font-bold">
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            <div className="text-center space-y-2">
                              <CardTitle className="text-lg font-bold text-slate-800 leading-tight">
                                {member.name}
                              </CardTitle>
                              <p className="text-sm font-medium text-slate-600">
                                {member.position}
                              </p>
                              {member.subDepartment && (
                                <div className="space-y-1">
                                  <p className="text-xs text-fuchsia-800 bg-fuchsia-50 px-3 py-1 rounded-full">
                                    {member.subDepartment} NasDem
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="relative p-6 pt-0 space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm group/item">
                              <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:item:bg-fuchsia-100 transition-colors duration-300">
                                <Mail className="h-4 w-4 text-slate-500 group-hover:item:text-fuchsia-600" />
                              </div>
                              <span className="truncate text-slate-700 font-medium">
                                {member.email}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-sm group/item">
                              <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:item:bg-fuchsia-100 transition-colors duration-300">
                                <Phone className="h-4 w-4 text-slate-500 group-hover:item:text-fuchsia-600" />
                              </div>
                              <span className="text-slate-700 font-medium">
                                {member.phone}
                              </span>
                            </div>

                            <div className="flex items-start gap-3 text-sm group/item">
                              <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mt-0.5 group-hover:item:bg-fuchsia-100 transition-colors duration-300">
                                <MapPin className="h-4 w-4 text-slate-500 group-hover:item:text-fuchsia-600" />
                              </div>
                              <span className="line-clamp-2 text-slate-700 font-medium leading-relaxed">
                                {member.address}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                            <Badge
                              className={`${
                                statusConfig[member.status].className
                              } px-3 py-1 rounded-full text-xs font-medium`}
                            >
                              {statusConfig[member.status].label}
                            </Badge>
                            <span className="text-xs text-slate-500 font-medium">
                              {new Date(member.joinDate).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                );
              })()}
            </TabsContent>

            <TabsContent value="dpc" className="mt-8">
              <Card className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl shadow-emerald-600/10">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 to-transparent"></div>
                <CardContent className="relative p-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black h-5 w-5" />
                      <Input
                        placeholder="Cari nama atau posisi DPC..."
                        value={getCurrentFilters().searchTerm}
                        onChange={(e) => {
                          if (activeTab === "dpc") {
                            setDpcFilters({
                              ...dpcFilters,
                              searchTerm: e.target.value,
                            });
                          }
                        }}
                        className="pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-slate-200/50 hover:border-emerald-600/30 focus:border-emerald-600 rounded-xl transition-all duration-300"
                      />
                    </div>
                    <Select
                      value={getDpcFilters().regionFilter}
                      onValueChange={(value) => {
                        if (activeTab === "dpc") {
                          setDpcFilters({ ...dpcFilters, regionFilter: value });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full md:w-[220px] text-black bg-white/70 backdrop-blur-sm border-2 border-slate-200/50 hover:border-emerald-600/30 focus:border-emerald-600 rounded-xl px-4 py-3 transition-all duration-300">
                        <SelectValue placeholder="Filter Kecamatan" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl text-black">
                        {availableRegions.map((region) => (
                          <SelectItem
                            key={region.value}
                            value={region.value}
                            className="rounded-lg"
                          >
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dprt" className="mt-8">
              <Card className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl shadow-amber-700/10">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 to-transparent"></div>
                <CardContent className="relative p-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black h-5 w-5" />
                      <Input
                        placeholder="Cari DPRT atau Kader..."
                        value={getDprtFilters().searchTerm}
                        onChange={(e) => {
                          if (activeTab === "dprt") {
                            setDprtFilters({
                              ...dprtFilters,
                              searchTerm: e.target.value,
                            });
                          }
                        }}
                        className="pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-slate-200/50 hover:border-amber-700/30 focus:border-amber-700 rounded-xl transition-all duration-300"
                      />
                    </div>
                    <Select
                      value={getDprtFilters().regionFilter}
                      onValueChange={(value) => {
                        if (activeTab === "dprt") {
                          setDprtFilters({
                            ...dprtFilters,
                            regionFilter: value,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full md:w-[200px] text-black bg-white/70 backdrop-blur-sm border-2 border-slate-200/50 hover:border-amber-700/30 focus:border-amber-700 rounded-xl px-4 py-3 transition-all duration-300">
                        <SelectValue placeholder="Filter Kecamatan" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl text-black">
                        {availableRegions.map((region) => (
                          <SelectItem
                            key={region.value}
                            value={region.value}
                            className="rounded-lg"
                          >
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getDprtFilters().regionFilter !== "all" && (
                      <Select
                        value={getDprtFilters().subRegionFilter || "all"}
                        onValueChange={(value) => {
                          if (activeTab === "dprt") {
                            setDprtFilters({
                              ...dprtFilters,
                              subRegionFilter: value,
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="w-full md:w-[180px] text-black bg-white/70 backdrop-blur-sm border-2 border-slate-200/50 hover:border-amber-700/30 focus:border-amber-700 rounded-xl px-4 py-3 transition-all duration-300">
                          <SelectValue placeholder="Filter Desa" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-xl text-black border border-white/20 rounded-xl shadow-2xl">
                          {getAvailableSubRegions().map((subRegion) => (
                            <SelectItem
                              key={subRegion.value}
                              value={subRegion.value}
                              className="rounded-lg"
                            >
                              {subRegion.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Select
                      value={getDprtFilters().departmentFilter || "all"}
                      onValueChange={(value) => {
                        if (activeTab === "dprt") {
                          setDprtFilters({
                            ...dprtFilters,
                            departmentFilter: value,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full md:w-[160px] text-black bg-white/70 backdrop-blur-sm border-2 border-slate-200/50 hover:border-amber-700/30 focus:border-amber-700 rounded-xl px-4 py-3 transition-all duration-300">
                        <SelectValue placeholder="Tipe" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 text-black backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl">
                        <SelectItem value="all" className="rounded-lg">
                          Semua
                        </SelectItem>
                        <SelectItem value="dprt" className="rounded-lg">
                          DPRT
                        </SelectItem>
                        <SelectItem value="kader" className="rounded-lg">
                          Kader
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Members Grid */}
        {paginatedMembers.length > 0 && activeTab !== "sayap" ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {paginatedMembers.map((member) => (
                <Card
                  key={member.id}
                  onClick={() => handleMemberClick(member)}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 transform hover:scale-105 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-orange-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <CardHeader className="relative p-6 pb-4">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <div className="absolute -inset-3 bg-gradient-to-r from-[#001B55] via-[#FF9C04] to-[#001B55] rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <Avatar className="relative w-24 h-24 border-4 border-white/50 shadow-2xl shadow-blue-900/20">
                          <AvatarImage
                            src={member.photo}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 text-lg font-bold">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="text-center space-y-2">
                        <CardTitle className="text-lg font-bold text-slate-800 leading-tight">
                          {member.name}
                        </CardTitle>
                        <p className="text-sm font-medium text-slate-600">
                          {member.position}
                        </p>
                        {member.subDepartment && (
                          <div className="space-y-1">
                            <p className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                              Desa {member.subDepartment}
                            </p>
                            {member.department === "kader" && (
                              <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                {(() => {
                                  const dprtLeader = getDPRTLeader(
                                    member.region || "",
                                    member.subDepartment
                                  );
                                  return dprtLeader
                                    ? `Bawahan DPRT: ${dprtLeader.name
                                        .split(" ")
                                        .slice(0, 2)
                                        .join(" ")}`
                                    : `DPRT: Belum ada ketua`;
                                })()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative p-6 pt-0 space-y-4">
                    <div className="flex justify-center">
                      <Badge
                        className={`${
                          departmentConfig[member.department]?.className
                        } px-4 py-2 rounded-full font-medium`}
                      >
                        {departmentConfig[member.department]?.label}
                      </Badge>
                    </div>

                    {/* Informasi khusus DPRT */}
                    {member.department === "dprt" &&
                      member.region &&
                      member.subDepartment && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-amber-600" />
                            <span className="text-sm font-semibold text-amber-800">
                              Kader Dibawahi
                            </span>
                          </div>
                          <div className="text-xs text-amber-700">
                            {(() => {
                              const kaderCount = getKaderCount(
                                member.region,
                                member.subDepartment
                              );
                              return kaderCount > 0
                                ? `${kaderCount} kader aktif di Desa ${member.subDepartment}`
                                : `Belum ada kader di Desa ${member.subDepartment}`;
                            })()}
                          </div>
                        </div>
                      )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm group/item">
                        <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:item:bg-blue-100 transition-colors duration-300">
                          <Mail className="h-4 w-4 text-slate-500 group-hover:item:text-blue-600" />
                        </div>
                        <span className="truncate text-slate-700 font-medium">
                          {member.email}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm group/item">
                        <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:item:bg-green-100 transition-colors duration-300">
                          <Phone className="h-4 w-4 text-slate-500 group-hover:item:text-green-600" />
                        </div>
                        <span className="text-slate-700 font-medium">
                          {member.phone}
                        </span>
                      </div>

                      <div className="flex items-start gap-3 text-sm group/item">
                        <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mt-0.5 group-hover:item:bg-red-100 transition-colors duration-300">
                          <MapPin className="h-4 w-4 text-slate-500 group-hover:item:text-red-600" />
                        </div>
                        <span className="line-clamp-2 text-slate-700 font-medium leading-relaxed">
                          {member.address}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                      <Badge
                        className={`${
                          statusConfig[member.status].className
                        } px-3 py-1 rounded-full text-xs font-medium`}
                      >
                        {statusConfig[member.status].label}
                      </Badge>
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date(member.joinDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Modern Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-6 bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl">
                <div className="text-sm font-medium text-slate-600">
                  Halaman{" "}
                  <span className="font-bold text-slate-800">
                    {currentPage}
                  </span>{" "}
                  dari{" "}
                  <span className="font-bold text-slate-800">{totalPages}</span>
                  <span className="ml-2 text-slate-500">
                    ({filteredMembers.length} total anggota)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 hover:text-slate-800 font-medium transition-all duration-300"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Sebelumnya
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page =
                        currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      return page <= totalPages ? (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[44px] h-10 rounded-xl font-semibold transition-all duration-300 ${
                            page === currentPage
                              ? "bg-gradient-to-r from-[#001B55] to-[#003875] text-white shadow-lg shadow-[#001B55]/25 scale-105"
                              : "border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                          }`}
                        >
                          {page}
                        </Button>
                      ) : null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 hover:text-slate-800 font-medium transition-all duration-300"
                  >
                    Selanjutnya
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-blue-900/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-orange-50/20"></div>
            <CardContent className="relative p-16 text-center">
              <div className="max-w-md mx-auto space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full blur-2xl opacity-30"></div>
                  <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <Users className="h-12 w-12 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Belum ada anggota
                  </h3>
                  <p className="text-slate-600 text-lg">
                    Tambahkan anggota pertama untuk memulai mengelola struktur
                    organisasi
                  </p>
                </div>

                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-gradient-to-r from-[#FF9C04] via-[#FFB84D] to-[#FF9C04] hover:from-[#001B55] hover:via-[#003875] hover:to-[#001B55] text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-[#FF9C04]/25 hover:shadow-[#001B55]/25 transition-all duration-500 transform hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Tambah Anggota Pertama
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Member Detail Modal */}
        {selectedMember && (
          <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/20">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-800 mb-4">
                  Biodata Anggota
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Photo and Basic Info */}
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="relative mx-auto w-48 h-48 mb-4">
                      <div className="absolute -inset-3 bg-gradient-to-r from-[#001B55] via-[#FF9C04] to-[#001B55] rounded-full blur-lg opacity-30"></div>
                      <Avatar className="relative w-full h-full border-4 border-white/50 shadow-2xl">
                        <AvatarImage
                          src={selectedMember.photo}
                          className="object-cover"
                          alt={selectedMember.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 text-4xl font-bold">
                          {selectedMember.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      {selectedMember.name}
                    </h2>
                    <p className="text-lg font-medium text-slate-600 mb-3">
                      {selectedMember.position}
                    </p>

                    <div className="flex justify-center">
                      <Badge
                        className={`${
                          departmentConfig[selectedMember.department]?.className
                        } px-6 py-2 text-base font-medium`}
                      >
                        {departmentConfig[selectedMember.department]?.label}
                      </Badge>
                    </div>

                    {selectedMember.region && (
                      <p className="text-sm text-slate-500 mt-2 bg-slate-100 px-4 py-1 rounded-full inline-block">
                        Region: {selectedMember.region}
                      </p>
                    )}
                    {selectedMember.subDepartment && (
                      <p className="text-sm text-slate-500 mt-1 bg-slate-100 px-4 py-1 rounded-full inline-block">
                        {selectedMember.department === "dprt" ||
                        selectedMember.department === "kader"
                          ? "Desa"
                          : "Sub"}
                        : {selectedMember.subDepartment}
                      </p>
                    )}
                  </div>

                  {/* Informasi Relasi DPRT-Kader */}
                  {selectedMember.department === "kader" &&
                    selectedMember.region &&
                    selectedMember.subDepartment && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                        <h3 className="font-semibold text-blue-800 text-lg mb-3 flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          Informasi DPRT
                        </h3>
                        {(() => {
                          const dprtLeader = getDPRTLeader(
                            selectedMember.region!,
                            selectedMember.subDepartment!
                          );
                          const totalKaders = getKaderCount(
                            selectedMember.region!,
                            selectedMember.subDepartment!
                          );
                          return (
                            <div className="space-y-3">
                              {dprtLeader ? (
                                <>
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                      <UserCheck className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-blue-800">
                                        Ketua DPRT
                                      </p>
                                      <p className="text-blue-600 font-semibold">
                                        {dprtLeader.name}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                      <Users className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-green-800">
                                        Total Kader
                                      </p>
                                      <p className="text-green-600 font-semibold">
                                        {totalKaders} orang di Desa{" "}
                                        {selectedMember.subDepartment}
                                      </p>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                  </div>
                                  <div>
                                    <p className="text-orange-800 font-medium">
                                      Belum ada Ketua DPRT
                                    </p>
                                    <p className="text-sm text-orange-600">
                                      Desa {selectedMember.subDepartment} perlu
                                      ditugaskan Ketua DPRT
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                  {/* Informasi Kader untuk DPRT */}
                  {selectedMember.department === "dprt" &&
                    selectedMember.region &&
                    selectedMember.subDepartment && (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
                        <h3 className="font-semibold text-amber-800 text-lg mb-3 flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Kader Dibawahi
                        </h3>
                        {(() => {
                          const kaderCount = members.filter(
                            (member) =>
                              member.department === "kader" &&
                              member.region === selectedMember.region &&
                              member.subDepartment ===
                                selectedMember.subDepartment
                          ).length;

                          return (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-amber-700 font-medium">
                                  {kaderCount > 0 ? (
                                    <>
                                      <strong>{kaderCount} kader</strong> aktif
                                      di bawah pengawasan
                                    </>
                                  ) : (
                                    <>Belum ada kader yang diawasi</>
                                  )}
                                </p>
                                <p className="text-sm text-amber-600">
                                  Desa {selectedMember.subDepartment}, Kec.{" "}
                                  {selectedMember.region}
                                </p>
                              </div>
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                Lihat detail di bawah
                              </Badge>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                  <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl">
                    <h3 className="font-semibold text-slate-800 text-lg mb-4">
                      Informasi Kontak
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Email
                          </p>
                          <p className="text-slate-800">
                            {selectedMember.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Telepon
                          </p>
                          <p className="text-slate-800">
                            {selectedMember.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                          <MapPin className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Alamat
                          </p>
                          <p className="text-slate-800 leading-relaxed">
                            {selectedMember.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Detailed Information */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 text-lg">
                      Detail Informasi
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-slate-50/50 p-4 rounded-xl">
                        <p className="text-sm font-medium text-slate-600 mb-1">
                          Tanggal Bergabung
                        </p>
                        <p className="text-slate-800 font-semibold">
                          {new Date(selectedMember.joinDate).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <div className="bg-slate-50/50 p-4 rounded-xl">
                        <p className="text-sm font-medium text-slate-600 mb-1">
                          Status
                        </p>
                        <Badge
                          variant={
                            selectedMember.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="mt-1"
                        >
                          {selectedMember.status === "active"
                            ? "Aktif"
                            : "Tidak Aktif"}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-4 rounded-xl">
                      <p className="text-sm font-medium text-slate-600 mb-2">
                        Deskripsi
                      </p>
                      <p className="text-slate-800 leading-relaxed">
                        {selectedMember.description}
                      </p>
                    </div>

                    {selectedMember.achievements &&
                      selectedMember.achievements.length > 0 && (
                        <div className="bg-gradient-to-br from-blue-50/50 to-orange-50/50 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-3">
                            <Trophy className="h-5 w-5 text-yellow-600" />
                            <p className="text-sm font-medium text-slate-600">
                              Pencapaian
                            </p>
                          </div>
                          <ul className="space-y-2">
                            {selectedMember.achievements.map(
                              (achievement, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-2 text-slate-700"
                                >
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                  {achievement}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {selectedMember.lastActivity && (
                      <div className="bg-green-50/50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-green-600" />
                          <p className="text-sm font-medium text-slate-600">
                            Aktivitas Terakhir
                          </p>
                        </div>
                        <p className="text-slate-700">
                          {selectedMember.lastActivity}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabel Kader - hanya ditampilkan untuk DPRT */}
              {selectedMember.department === "dprt" &&
                selectedMember.region &&
                selectedMember.subDepartment && (
                  <div className="mt-8 pt-6 border-t border-slate-200/50">
                    <h3 className="font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
                      <UserCheck className="h-6 w-6 text-amber-600" />
                      Data Kader {selectedMember.subDepartment}
                    </h3>

                    {(() => {
                      const kaderList = members.filter(
                        (member) =>
                          member.department === "kader" &&
                          member.region === selectedMember.region &&
                          member.subDepartment === selectedMember.subDepartment
                      );

                      return kaderList.length > 0 ? (
                        <div className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                          <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
                                >
                                  No
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
                                >
                                  Nama
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
                                >
                                  Tanggal Lahir
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
                                >
                                  Desa Bertugas
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
                                >
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                              {kaderList.map((kader, index) => (
                                <tr
                                  key={kader.id}
                                  className={
                                    index % 2 === 0
                                      ? "bg-slate-50/30"
                                      : "bg-white"
                                  }
                                >
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                    {index + 1}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
                                        <Users className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div className="text-sm font-medium text-slate-800">
                                        {kader.name}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                                    {/* Generate dummy birth date based on id */}
                                    {new Date(
                                      new Date("1970-01-01").getTime() +
                                        parseInt(kader.id) * 10000000000
                                    ).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                                    Desa {kader.subDepartment}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span
                                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        kader.status === "active"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-slate-100 text-slate-800"
                                      }`}
                                    >
                                      {kader.status === "active"
                                        ? "Aktif"
                                        : "Tidak Aktif"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-sm text-slate-600 font-medium">
                              Total {kaderList.length} kader
                            </span>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-[#001B55] to-[#003875] text-white hover:from-[#003875] hover:to-[#001B55] transition-all duration-300"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Tambah Kader Baru
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-6 rounded-lg border border-slate-200 text-center">
                          <div className="mx-auto w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-3">
                            <AlertTriangle className="h-8 w-8 text-orange-400" />
                          </div>
                          <p className="text-slate-700 font-medium mb-1">
                            Belum ada kader di Desa{" "}
                            {selectedMember.subDepartment}
                          </p>
                          <p className="text-sm text-slate-600 mb-4">
                            Segera lakukan rekrutmen kader untuk meningkatkan
                            kekuatan partai di desa ini
                          </p>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-[#001B55] to-[#003875] text-white hover:from-[#003875] hover:to-[#001B55] transition-all duration-300"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Tambah Kader Baru
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                )}

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200/50">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-6"
                >
                  Tutup
                </Button>
                <Button className="px-6 bg-gradient-to-r from-[#001B55] to-[#003875] hover:from-[#003875] hover:to-[#001B55] transition-all duration-300">
                  Edit Profile
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}
