/**
 * Data struktur posisi DPD (Dewan Pimpinan Daerah)
 * Total 35 posisi yang dibagi menjadi 2 kolom pada landing page
 */

import { PositionEnum } from "@prisma/client";

export interface DpdPosition {
  order: number;
  position: PositionEnum;
  title: string;
  group: "ketua-wakil" | "sekretaris-bendahara";
}

/**
 * KOLOM KIRI: Ketua dan 26 Wakil Ketua Bidang (Order 1-27)
 */
export const DPD_KETUA_WAKIL: DpdPosition[] = [
  {
    order: 1,
    position: PositionEnum.ketua,
    title: "Ketua",
    group: "ketua-wakil",
  },
  {
    order: 2,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Pemenangan Pemilu",
    group: "ketua-wakil",
  },
  {
    order: 3,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Organisasi dan Keanggotaan",
    group: "ketua-wakil",
  },
  {
    order: 4,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Kaderisasi dan Pendidikan Politik",
    group: "ketua-wakil",
  },
  {
    order: 5,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Hubungan Legislatif",
    group: "ketua-wakil",
  },
  {
    order: 6,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Hubungan Eksekutif",
    group: "ketua-wakil",
  },
  {
    order: 7,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Hubungan Sayap dan Badan",
    group: "ketua-wakil",
  },
  {
    order: 8,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Penggalangan dan Penggerak Komunitas",
    group: "ketua-wakil",
  },
  {
    order: 9,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Pemilih Pemula dan Milenial",
    group: "ketua-wakil",
  },
  {
    order: 10,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Digital dan Siber",
    group: "ketua-wakil",
  },
  {
    order: 11,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Media dan Komunikasi Publik",
    group: "ketua-wakil",
  },
  {
    order: 12,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Ekonomi",
    group: "ketua-wakil",
  },
  {
    order: 13,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Usaha Mikro Kecil dan Menengah",
    group: "ketua-wakil",
  },
  {
    order: 14,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Agama dan Masyarakat Adat",
    group: "ketua-wakil",
  },
  {
    order: 15,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Tenaga Kerja",
    group: "ketua-wakil",
  },
  {
    order: 16,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Kesehatan",
    group: "ketua-wakil",
  },
  {
    order: 17,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Perempuan dan Anak",
    group: "ketua-wakil",
  },
  {
    order: 18,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Pendidikan dan Kebudayaan",
    group: "ketua-wakil",
  },
  {
    order: 19,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Hukum dan Hak Asasi Manusia",
    group: "ketua-wakil",
  },
  {
    order: 20,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Pariwisata dan Industri Kreatif",
    group: "ketua-wakil",
  },
  {
    order: 21,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Pertanian, Peternakan dan Kemandirian Desa",
    group: "ketua-wakil",
  },
  {
    order: 22,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Maritim",
    group: "ketua-wakil",
  },
  {
    order: 23,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Pemuda dan Olahraga",
    group: "ketua-wakil",
  },
  {
    order: 24,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Lingkungan Hidup",
    group: "ketua-wakil",
  },
  {
    order: 25,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Kehutanan, Agraria dan Tata Ruang",
    group: "ketua-wakil",
  },
  {
    order: 26,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Migran",
    group: "ketua-wakil",
  },
  {
    order: 27,
    position: PositionEnum.wakil,
    title: "Wakil Ketua Bidang Pembangunan dan Infrastruktur",
    group: "ketua-wakil",
  },
];

/**
 * KOLOM KANAN: Sekretaris dan Bendahara dengan sub-posisi (Order 28-35)
 */
export const DPD_SEKRETARIS_BENDAHARA: DpdPosition[] = [
  {
    order: 28,
    position: PositionEnum.sekretaris,
    title: "Sekretaris",
    group: "sekretaris-bendahara",
  },
  {
    order: 29,
    position: PositionEnum.sekretaris,
    title: "Wakil Sekretaris Bidang Kebijakan Publik dan Isu Strategis",
    group: "sekretaris-bendahara",
  },
  {
    order: 30,
    position: PositionEnum.sekretaris,
    title: "Wakil Sekretaris Bidang Ideologi, Organisasi dan Kaderisasi",
    group: "sekretaris-bendahara",
  },
  {
    order: 31,
    position: PositionEnum.sekretaris,
    title: "Wakil Sekretaris Bidang Pemenangan Pemilu",
    group: "sekretaris-bendahara",
  },
  {
    order: 32,
    position: PositionEnum.sekretaris,
    title: "Wakil Sekretaris Bidang Umum dan Administrasi",
    group: "sekretaris-bendahara",
  },
  {
    order: 33,
    position: PositionEnum.bendahara,
    title: "Bendahara",
    group: "sekretaris-bendahara",
  },
  {
    order: 34,
    position: PositionEnum.bendahara,
    title: "Wakil Bendahara Pengelolaan Dana dan Aset",
    group: "sekretaris-bendahara",
  },
  {
    order: 35,
    position: PositionEnum.bendahara,
    title: "Wakil Bendahara Penggalangan Dana",
    group: "sekretaris-bendahara",
  },
];

/**
 * Semua posisi DPD (35 posisi total)
 */
export const ALL_DPD_POSITIONS: DpdPosition[] = [
  ...DPD_KETUA_WAKIL,
  ...DPD_SEKRETARIS_BENDAHARA,
];

/**
 * Get position title by order number
 */
export function getDpdPositionByOrder(order: number): DpdPosition | undefined {
  return ALL_DPD_POSITIONS.find((p) => p.order === order);
}

/**
 * Get DPD positions grouped for form dropdown
 */
export function getDpdPositionsGrouped() {
  return [
    {
      label: "Ketua & Wakil Ketua Bidang",
      options: DPD_KETUA_WAKIL.map((p) => ({
        value: p.title,
        label: p.title,
        order: p.order,
      })),
    },
    {
      label: "Sekretaris & Bendahara",
      options: DPD_SEKRETARIS_BENDAHARA.map((p) => ({
        value: p.title,
        label: p.title,
        order: p.order,
      })),
    },
  ];
}
