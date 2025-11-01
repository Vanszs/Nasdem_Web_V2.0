import {
  OrgLevel,
  PositionEnum,
  PrismaClient,
  RegionType,
} from "@prisma/client";
import type { SeededTaxonomy } from "./helpers";

export async function seedSayapAndRegions(
  db: PrismaClient
): Promise<SeededTaxonomy> {
  await db.sayapType.createMany({
    data: [
      { name: "Garnita", description: "Sayap perempuan" },
      { name: "Garda", description: "Sayap pemuda" },
    ],
  });

  // 18 Kecamatan di Kabupaten Sidoarjo
  const kecamatanSidoarjo = [
    "Sidoarjo",
    "Buduran",
    "Gedangan",
    "Sedati",
    "Waru",
    "Taman",
    "Krian",
    "Balongbendo",
    "Prambon",
    "Tulangan",
    "Tarik",
    "Krembung",
    "Jabon",
    "Porong",
    "Tanggulangin",
    "Sukodono",
    "Wonoayu",
    "Candi",
  ];

  await db.region.createMany({
    data: [
      { name: "Kabupaten Sidoarjo", type: RegionType.kabupaten },
      ...kecamatanSidoarjo.map((name) => ({
        name,
        type: RegionType.kecamatan,
      })),
      { name: "Desa Alpha", type: RegionType.desa },
      { name: "Desa Beta", type: RegionType.desa },
    ],
  });

  const [kabupaten, kecamatanList, desaList, sayapTypes] = await Promise.all([
    db.region.findFirst({ where: { type: RegionType.kabupaten } }),
    db.region.findMany({
      where: { type: RegionType.kecamatan },
      orderBy: { name: "asc" },
    }),
    db.region.findMany({
      where: { type: RegionType.desa },
      orderBy: { name: "asc" },
    }),
    db.sayapType.findMany(),
  ]);

  return { kabupaten, kecamatanList, desaList, sayapTypes };
}

export type StrukturIds = Record<string, number>;

export async function seedStructures(
  db: PrismaClient,
  taxonomy: SeededTaxonomy
) {
  const strukturIds: StrukturIds = {};
  const { kabupaten, kecamatanList, desaList, sayapTypes } = taxonomy;
  if (!kabupaten) throw new Error("Kabupaten region missing");

  // DEWAN PIMPINAN DAERAH (34 Posisi)
  // Kolom Kiri (1-26): Ketua dan Wakil Ketua Bidang
  const dpdPositions = [
    { order: 1, position: PositionEnum.ketua, title: "Ketua" },
    { order: 2, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Pemenangan Pemilu" },
    { order: 3, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Organisasi dan Keanggotaan" },
    { order: 4, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Kaderisasi dan Pendidikan Politik" },
    { order: 5, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Hubungan Legislatif" },
    { order: 6, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Hubungan Eksekutif" },
    { order: 7, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Hubungan Sayap dan Badan" },
    { order: 8, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Penggalangan dan Penggerak Komunitas" },
    { order: 9, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Pemilih Pemula dan Milenial" },
    { order: 10, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Digital dan Siber" },
    { order: 11, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Media dan Komunikasi Publik" },
    { order: 12, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Ekonomi" },
    { order: 13, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Usaha Mikro Kecil dan Menengah" },
    { order: 14, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Agama dan Masyarakat Adat" },
    { order: 15, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Tenaga Kerja" },
    { order: 16, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Kesehatan" },
    { order: 17, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Perempuan dan Anak" },
    { order: 18, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Pendidikan dan Kebudayaan" },
    { order: 19, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Hukum dan Hak Asasi Manusia" },
    { order: 20, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Pariwisata dan Industri Kreatif" },
    { order: 21, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Pertanian, Peternakan dan Kemandirian Desa" },
    { order: 22, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Maritim" },
    { order: 23, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Pemuda dan Olahraga" },
    { order: 24, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Lingkungan Hidup" },
    { order: 25, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Kehutanan, Agraria dan Tata Ruang" },
    { order: 26, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Migran" },
    { order: 27, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Pembangunan dan Infrastruktur" },
    
    // Kolom Kanan (28-34): Sekretaris dan Bendahara dengan sub-posisi
    { order: 28, position: PositionEnum.sekretaris, title: "Sekretaris" },
    { order: 29, position: PositionEnum.sekretaris, title: "Wakil Sekretaris Bidang Kebijakan Publik dan Isu Strategis" },
    { order: 30, position: PositionEnum.sekretaris, title: "Wakil Sekretaris Bidang Ideologi, Organisasi dan Kaderisasi" },
    { order: 31, position: PositionEnum.sekretaris, title: "Wakil Sekretaris Bidang Pemenangan Pemilu" },
    { order: 32, position: PositionEnum.sekretaris, title: "Wakil Sekretaris Bidang Umum dan Administrasi" },
    { order: 33, position: PositionEnum.bendahara, title: "Bendahara" },
    { order: 34, position: PositionEnum.bendahara, title: "Wakil Bendahara Pengelolaan Dana dan Aset" },
    { order: 35, position: PositionEnum.bendahara, title: "Wakil Bendahara Penggalangan Dana" },
  ];

  for (const dpdPos of dpdPositions) {
    const created = await db.strukturOrganisasi.create({
      data: {
        level: OrgLevel.dpd,
        position: dpdPos.position,
        positionTitle: dpdPos.title,
        positionOrder: dpdPos.order,
        regionId: kabupaten.id,
      },
    });
    strukturIds[`dpd:${dpdPos.title}`] = created.id;
  }

  // DEWAN PIMPINAN CABANG (DPC) - 16 Posisi per Kecamatan
  const dpcPositions = [
    { order: 1, position: PositionEnum.ketua, title: "Ketua" },
    { order: 2, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Pemenangan Pemilu" },
    { order: 3, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Organisasi" },
    { order: 4, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Usaha Mikro Kecil dan Menengah" },
    { order: 5, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Agama dan Masyarakat Adat" },
    { order: 6, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Kesehatan" },
    { order: 7, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Perempuan dan Anak" },
    { order: 8, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Pariwisata dan Ekonomi Kreatif" },
    { order: 9, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Pertanian, Peternakan dan Kemandirian Desa/Kelurahan" },
    { order: 10, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Pemudaan dan Olahraga" },
    { order: 11, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Penggalangan dan Penggerak Komunitas" },
    { order: 12, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Lingkungan Hidup" },
    { order: 13, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Pemilih Pemula dan Milenial" },
    { order: 14, position: PositionEnum.sekretaris, title: "Sekretaris" },
    { order: 15, position: PositionEnum.sekretaris, title: "Wakil Sekretaris" },
    { order: 16, position: PositionEnum.bendahara, title: "Bendahara" },
    { order: 17, position: PositionEnum.bendahara, title: "Wakil Bendahara" },
  ];

  for (const kec of kecamatanList) {
    for (const dpcPos of dpcPositions) {
      const created = await db.strukturOrganisasi.create({
        data: {
          level: OrgLevel.dpc,
          position: dpcPos.position,
          positionTitle: dpcPos.title,
          positionOrder: dpcPos.order,
          regionId: kec.id,
        },
      });
      strukturIds[`dpc:${kec.name}:${dpcPos.title}`] = created.id;
    }
  }

  // DEWAN PIMPINAN RANTING (DPRT) - 6 Posisi per Desa
  const dprtPositions = [
    { order: 1, position: PositionEnum.ketua, title: "Ketua" },
    { order: 2, position: PositionEnum.sekretaris, title: "Sekretaris" },
    { order: 3, position: PositionEnum.bendahara, title: "Bendahara" },
    { order: 4, position: PositionEnum.wakil, title: "Wakil Ketua Bidang Pemenangan Pemilu" },
    { order: 5, position: PositionEnum.wakil, title: "Wakil Ketua Bidang OKK" },
    { order: 6, position: PositionEnum.anggota, title: "Kader" },
  ];

  for (const desa of desaList) {
    for (const dprtPos of dprtPositions) {
      const created = await db.strukturOrganisasi.create({
        data: {
          level: OrgLevel.dprt,
          position: dprtPos.position,
          positionTitle: dprtPos.title,
          positionOrder: dprtPos.order,
          regionId: desa.id,
        },
      });
      strukturIds[`dprt:${desa.name}:${dprtPos.title}`] = created.id;
    }
  }

  for (const sayap of sayapTypes) {
    const sy = await db.strukturOrganisasi.create({
      data: {
        level: OrgLevel.sayap,
        position: PositionEnum.ketua,
        sayapTypeId: sayap.id,
      },
    });
    strukturIds[`sayap:${sayap.name}:ketua`] = sy.id;
  }

  return strukturIds;
}
