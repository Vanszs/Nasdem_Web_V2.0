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

  await db.region.createMany({
    data: [
      { name: "Kabupaten Sidoarjo", type: RegionType.kabupaten },
      { name: "Kecamatan A", type: RegionType.kecamatan },
      { name: "Kecamatan B", type: RegionType.kecamatan },
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

  const dpdKetua = await db.strukturOrganisasi.create({
    data: {
      level: OrgLevel.dpd,
      position: PositionEnum.ketua,
      regionId: kabupaten.id,
    },
  });
  strukturIds["dpd:ketua"] = dpdKetua.id;
  const dpdSek = await db.strukturOrganisasi.create({
    data: {
      level: OrgLevel.dpd,
      position: PositionEnum.sekretaris,
      regionId: kabupaten.id,
    },
  });
  strukturIds["dpd:sekretaris"] = dpdSek.id;
  const dpdBend = await db.strukturOrganisasi.create({
    data: {
      level: OrgLevel.dpd,
      position: PositionEnum.bendahara,
      regionId: kabupaten.id,
    },
  });
  strukturIds["dpd:bendahara"] = dpdBend.id;

  for (const kec of kecamatanList) {
    const k = await db.strukturOrganisasi.create({
      data: {
        level: OrgLevel.dpc,
        position: PositionEnum.ketua,
        regionId: kec.id,
      },
    });
    strukturIds[`dpc:${kec.name}:ketua`] = k.id;
    const s = await db.strukturOrganisasi.create({
      data: {
        level: OrgLevel.dpc,
        position: PositionEnum.sekretaris,
        regionId: kec.id,
      },
    });
    strukturIds[`dpc:${kec.name}:sekretaris`] = s.id;
    const b = await db.strukturOrganisasi.create({
      data: {
        level: OrgLevel.dpc,
        position: PositionEnum.bendahara,
        regionId: kec.id,
      },
    });
    strukturIds[`dpc:${kec.name}:bendahara`] = b.id;
    const a = await db.strukturOrganisasi.create({
      data: {
        level: OrgLevel.dpc,
        position: PositionEnum.anggota,
        regionId: kec.id,
      },
    });
    strukturIds[`dpc:${kec.name}:anggota`] = a.id;
  }

  for (const desa of desaList) {
    const d = await db.strukturOrganisasi.create({
      data: {
        level: OrgLevel.dprt,
        position: PositionEnum.ketua,
        regionId: desa.id,
      },
    });
    strukturIds[`dprt:${desa.name}:ketua`] = d.id;
    const b = await db.strukturOrganisasi.create({
      data: {
        level: OrgLevel.dprt,
        position: PositionEnum.bendahara,
        regionId: desa.id,
      },
    });
    strukturIds[`dprt:${desa.name}:bendahara`] = b.id;
    const a = await db.strukturOrganisasi.create({
      data: {
        level: OrgLevel.dprt,
        position: PositionEnum.anggota,
        regionId: desa.id,
      },
    });
    strukturIds[`dprt:${desa.name}:anggota`] = a.id;
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
