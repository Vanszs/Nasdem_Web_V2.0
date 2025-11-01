import { Category, ProgramNameOption } from "./types";

export const categories: Category[] = [
  { id: "pendidikan", name: "Pendidikan" },
  { id: "ekonomi", name: "Ekonomi" },
  { id: "sosial", name: "Sosial" },
  { id: "kesehatan", name: "Kesehatan" },
  { id: "lainnya", name: "Lainnya" },
];

export const programNameOptions: ProgramNameOption[] = [
  // Pendidikan
  { id: "pip", title: "Beasiswa PIP", categoryId: "pendidikan" },
  { id: "kip-kuliah", title: "Beasiswa KIP Kuliah", categoryId: "pendidikan" },
  {
    id: "revitalisasi-satuan-pendidikan",
    title: "Revitalisasi Satuan Pendidikan",
    categoryId: "pendidikan",
  },
  {
    id: "hibah-bantuan-bendahara",
    title: "Hibah / Bantuan Bendahara",
    categoryId: "pendidikan",
  },
  { id: "lainnya-pendidikan", title: "Lainnya", categoryId: "pendidikan" },
  // Ekonomi
  {
    id: "rpr-budidaya-ikan",
    title: "RPR Budidaya Ikan Air Tawar",
    categoryId: "ekonomi",
  },
  {
    id: "rpr-kelompok-tani",
    title: "RPR Kelompok Tani",
    categoryId: "ekonomi",
  },
  { id: "rpr-ayam-petelor", title: "RPR Ayam Petelor", categoryId: "ekonomi" },
  { id: "umkm-binaan", title: "UMKM Binaan", categoryId: "ekonomi" },
  { id: "bsps", title: "BSPS (Rumah Tidak Layak Huni)", categoryId: "ekonomi" },
  // Sosial
  { id: "baksos", title: "Baksos", categoryId: "sosial" },
  // Kesehatan
  { id: "fogging", title: "Fogging", categoryId: "kesehatan" },
  {
    id: "cek-kesehatan-gratis",
    title: "Cek Kesehatan Gratis",
    categoryId: "kesehatan",
  },
  // Lainnya placeholder (if needed later)
];
