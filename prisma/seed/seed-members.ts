import { GenderEnum, MemberStatus, PrismaClient } from "@prisma/client";
import type { StrukturIds } from "./seed-taxonomy";

export async function seedMembers(db: PrismaClient, strukturIds: StrukturIds) {
  // DPD Leadership
  await db.member.create({
    data: {
      fullName: "H. Ahmad Riyadi",
      phone: "08111111111",
      gender: GenderEnum.male,
      status: MemberStatus.active,
      strukturId: strukturIds["dpd:ketua"],
      email: "dpd.ketua@nasdem.local",
      address: "Jl. Pahlawan No. 1, Sidoarjo",
      photoUrl: "/placeholder-user.jpg",
      nik: "3515xxxxxxxx1001",
      ktaNumber: "KTA-1001",
      occupation: "Wiraswasta",
      familyMemberCount: 4,
      maritalStatus: "Menikah",
      dateOfBirth: new Date("1978-01-15"),
      joinDate: new Date("2023-11-10"),
    },
  });

  await db.member.create({
    data: {
      fullName: "Siti Handayani",
      phone: "08222222222",
      gender: GenderEnum.female,
      status: MemberStatus.active,
      strukturId: strukturIds["dpd:sekretaris"],
      email: "dpd.sekretaris@nasdem.local",
      address: "Jl. Diponegoro No. 10, Sidoarjo",
      photoUrl: "/placeholder-user.jpg",
      nik: "3515xxxxxxxx1002",
      ktaNumber: "KTA-1002",
      occupation: "Ibu Rumah Tangga",
      familyMemberCount: 3,
      maritalStatus: "Menikah",
      dateOfBirth: new Date("1985-05-20"),
      joinDate: new Date("2024-01-12"),
    },
  });

  // DPD Bendahara (missing previously)
  await db.member.create({
    data: {
      fullName: "Drs. Sugeng Priyono",
      phone: "081345678901",
      gender: GenderEnum.male,
      status: MemberStatus.active,
      strukturId: strukturIds["dpd:bendahara"],
      email: "dpd.bendahara@nasdem.local",
      address: "Jl. Pahlawan No. 2, Sidoarjo",
      photoUrl: "/placeholder-user.jpg",
      nik: "3515xxxxxxxx1003",
      ktaNumber: "KTA-1003",
      occupation: "Akuntan",
      familyMemberCount: 4,
      maritalStatus: "Menikah",
      dateOfBirth: new Date("1979-04-12"),
      joinDate: new Date("2024-01-20"),
    },
  });

  // DPC Ketua for two kecamatan
  await db.member.create({
    data: {
      fullName: "H. Budi Santoso",
      phone: "08133445566",
      gender: GenderEnum.male,
      status: MemberStatus.active,
      strukturId: strukturIds["dpc:Kecamatan A:ketua"],
      email: "dpc.a.ketua@nasdem.local",
      address: "Kecamatan A, Sidoarjo",
      photoUrl: "/placeholder-user.jpg",
      nik: "3515xxxxxxxx2001",
      ktaNumber: "KTA-2001",
      occupation: "Pengusaha",
      familyMemberCount: 5,
      maritalStatus: "Menikah",
      dateOfBirth: new Date("1982-08-11"),
      joinDate: new Date("2024-02-10"),
    },
  });

  await db.member.create({
    data: {
      fullName: "Hj. Dewi Anggraini",
      phone: "08177889900",
      gender: GenderEnum.female,
      status: MemberStatus.active,
      strukturId: strukturIds["dpc:Kecamatan B:ketua"],
      email: "dpc.b.ketua@nasdem.local",
      address: "Kecamatan B, Sidoarjo",
      photoUrl: "/placeholder-user.jpg",
      nik: "3515xxxxxxxx2002",
      ktaNumber: "KTA-2002",
      occupation: "Guru",
      familyMemberCount: 2,
      maritalStatus: "Menikah",
      dateOfBirth: new Date("1987-03-22"),
      joinDate: new Date("2024-02-15"),
    },
  });

  // DPRT Ketua for two desa
  const dprtAlphaKetua = await db.member.create({
    data: {
      fullName: "Slamet Raharjo",
      phone: "08122334455",
      gender: GenderEnum.male,
      status: MemberStatus.active,
      strukturId: strukturIds["dprt:Desa Alpha:ketua"],
      email: "dprt.alpha.ketua@nasdem.local",
      address: "Desa Alpha, Sidoarjo",
      photoUrl: "/placeholder-user.jpg",
      nik: "3515xxxxxxxx3001",
      ktaNumber: "KTA-3001",
      occupation: "Petani",
      familyMemberCount: 4,
      maritalStatus: "Menikah",
      dateOfBirth: new Date("1984-09-01"),
      joinDate: new Date("2024-03-05"),
    },
  });

  const dprtBetaKetua = await db.member.create({
    data: {
      fullName: "Rudi Prasetyo",
      phone: "08199887766",
      gender: GenderEnum.male,
      status: MemberStatus.active,
      strukturId: strukturIds["dprt:Desa Beta:ketua"],
      email: "dprt.beta.ketua@nasdem.local",
      address: "Desa Beta, Sidoarjo",
      photoUrl: "/placeholder-user.jpg",
      nik: "3515xxxxxxxx3002",
      ktaNumber: "KTA-3002",
      occupation: "Pedagang",
      familyMemberCount: 3,
      maritalStatus: "Menikah",
      dateOfBirth: new Date("1983-12-12"),
      joinDate: new Date("2024-03-06"),
    },
  });

  // Kaders linked to DPRT leaders
  await db.member.createMany({
    data: [
      {
        fullName: "Agus Setiawan",
        phone: "08124567890",
        gender: GenderEnum.male,
        status: MemberStatus.active,
        parentDprtMemberId: dprtAlphaKetua.id,
        email: "kader.agus@nasdem.local",
        address: "Desa Alpha, Sidoarjo",
        photoUrl: "/placeholder-user.jpg",
        nik: "3515xxxxxxxx3101",
        ktaNumber: "KTA-3101",
        occupation: "Buruh",
        familyMemberCount: 2,
        maritalStatus: "Menikah",
        dateOfBirth: new Date("1991-07-15"),
        joinDate: new Date("2024-04-01"),
      },
      {
        fullName: "Dina Puspitasari",
        phone: "08123456788",
        gender: GenderEnum.female,
        status: MemberStatus.active,
        parentDprtMemberId: dprtAlphaKetua.id,
        email: "kader.dina@nasdem.local",
        address: "Desa Alpha, Sidoarjo",
        photoUrl: "/placeholder-user.jpg",
        nik: "3515xxxxxxxx3102",
        ktaNumber: "KTA-3102",
        occupation: "Ibu Rumah Tangga",
        familyMemberCount: 3,
        maritalStatus: "Menikah",
        dateOfBirth: new Date("1993-10-02"),
        joinDate: new Date("2024-04-03"),
      },
      {
        fullName: "Andi Nugroho",
        phone: "08133777123",
        gender: GenderEnum.male,
        status: MemberStatus.active,
        parentDprtMemberId: dprtBetaKetua.id,
        email: "kader.andi@nasdem.local",
        address: "Desa Beta, Sidoarjo",
        photoUrl: "/placeholder-user.jpg",
        nik: "3515xxxxxxxx3201",
        ktaNumber: "KTA-3201",
        occupation: "Karyawan Swasta",
        familyMemberCount: 1,
        maritalStatus: "Lajang",
        dateOfBirth: new Date("1995-04-20"),
        joinDate: new Date("2024-04-05"),
      },
    ],
  });

  // Mass members - some assigned to DPC/DPRT, some unassigned
  const assignableStrukturIds = Object.keys(strukturIds)
    .filter((k) => k.startsWith("dpc:") || k.startsWith("dprt:"))
    .map((k) => strukturIds[k]) as number[];

  const moreMembers = Array.from({ length: 40 }).map((_, i) => {
    const isFemale = i % 2 === 1;
    const idSuffix = (i + 3).toString().padStart(4, "0");
    const assign = i % 3 !== 0; // ~2/3 assigned
    const strukturPick = assign
      ? assignableStrukturIds[(i + 7) % assignableStrukturIds.length]
      : null;
    return {
      fullName: isFemale
        ? `Hj. Dewi Anggraini ${i + 1}`
        : `H. Budi Santosa ${i + 1}`,
      email: `member${idSuffix}@nasdem.local`,
      phone: `08${Math.floor(100000000 + Math.random() * 899999999)}`,
      gender: isFemale ? GenderEnum.female : GenderEnum.male,
      status: MemberStatus.active,
      strukturId: strukturPick,
      address: `Perum Sutorejo Blok ${String.fromCharCode(65 + (i % 26))} No.${
        (i % 50) + 1
      }, Sidoarjo`,
      bio: "Kader aktif Partai NasDem Sidoarjo",
      photoUrl: "/placeholder-user.jpg",
      ktpPhotoUrl: "/placeholder-user.jpg",
      nik: `3515xxxxxxxx${idSuffix}`,
      ktaNumber: `KTA-${idSuffix}`,
      occupation: isFemale ? "Guru" : "Karyawan Swasta",
      familyMemberCount: (i % 5) + 2,
      maritalStatus: i % 3 === 0 ? "Lajang" : "Menikah",
      dateOfBirth: new Date(1975 + (i % 25), i % 12, (i % 27) + 1),
      joinDate: new Date(2024, i % 12, (i % 27) + 1),
      endDate: null as any,
    };
  });

  if (moreMembers.length) {
    await db.member.createMany({ data: moreMembers as any });
  }

  // SAYAP leaders (ensure sayap not empty in UI)
  const sayapStructures = await db.strukturOrganisasi.findMany({
    where: { level: "sayap" },
    include: { sayapType: true },
  });

  for (const s of sayapStructures) {
    // Only create a member if no one is assigned yet
    const count = await db.member.count({ where: { strukturId: s.id } });
    if (count > 0) continue;
    const unit = s.sayapType?.name || "Sayap";
    await db.member.create({
      data: {
        fullName: `Ketua ${unit} Sidoarjo`,
        phone: `08${Math.floor(100000000 + Math.random() * 899999999)}`,
        gender: GenderEnum.male,
        status: MemberStatus.active,
        strukturId: s.id,
        email: `${unit.toLowerCase()}@nasdem.local`.replace(/\s+/g, ""),
        address: "Kantor DPD NasDem Sidoarjo",
        photoUrl: "/placeholder-user.jpg",
        nik: `3515xxxxxxxx${Math.floor(4000 + Math.random() * 5000)}`,
        ktaNumber: `KTA-${Math.floor(4000 + Math.random() * 5000)}`,
        occupation: "Aktivis",
        familyMemberCount: 3,
        maritalStatus: "Menikah",
        dateOfBirth: new Date("1988-06-01"),
        joinDate: new Date("2024-05-10"),
      },
    });
  }
}
