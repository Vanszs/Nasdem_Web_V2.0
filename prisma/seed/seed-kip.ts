import { PrismaClient, Prisma, ProgramStatus } from "@prisma/client";

export async function seedBothPrograms(db: PrismaClient) {
  console.log("🎓 Seeding PIP & KIP Programs...");

  // Try to get coordinator, if not found use ID 1 (default)
  let coordinatorId = 1;
  const coordinator = await db.member.findFirst({ orderBy: { id: "asc" } });
  if (coordinator) {
    coordinatorId = coordinator.id;
    console.log(`✅ Using coordinator: ${coordinator.fullName} (ID: ${coordinatorId})`);
  } else {
    console.log("⚠️ No member found, using default coordinatorId: 1");
  }

  // Check and create PIP program
  let pipProgram = await db.program.findFirst({
    where: { category: "PIP" },
  });

  if (!pipProgram) {
    pipProgram = await db.program.create({
      data: {
        category: "PIP",
        name: "Program Indonesia Pintar (PIP) SD/SMP/SMA",
        description:
          "Program bantuan pendidikan untuk siswa SD, SMP, dan SMA dari keluarga kurang mampu. Bantuan berupa dana pendidikan untuk mendukung kelancaran proses belajar mengajar.",
        status: ProgramStatus.ongoing,
        target: 500,
        currentTarget: 0,
        budget: new Prisma.Decimal("3000000000"), // 3 Miliar
        photoUrl: "/uploads/programs/pip-sekolah.jpg",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2028-12-31"),
        coordinatorId: coordinatorId,
      },
    });
    console.log("✅ Created PIP Program:", pipProgram.name);
  } else {
    console.log("⚠️ PIP Program already exists");
  }

  // Check and create KIP program
  let kipProgram = await db.program.findFirst({
    where: { category: "KIP" },
  });

  if (!kipProgram) {
    kipProgram = await db.program.create({
      data: {
        category: "KIP",
        name: "Kartu Indonesia Pintar Kuliah (KIP Kuliah)",
        description:
          "Program bantuan pendidikan untuk mahasiswa dari keluarga kurang mampu yang ingin melanjutkan pendidikan ke perguruan tinggi. Bantuan mencakup biaya kuliah dan biaya hidup selama masa studi.",
        status: ProgramStatus.ongoing,
        target: 300,
        currentTarget: 0,
        budget: new Prisma.Decimal("5000000000"), // 5 Miliar
        photoUrl: "/uploads/programs/kip-kuliah.jpg",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2028-12-31"),
        coordinatorId: coordinatorId,
      },
    });
    console.log("✅ Created KIP Program:", kipProgram.name);
  } else {
    console.log("⚠️ KIP Program already exists");
  }

  return { pipProgram, kipProgram };
}

export async function seedKipRegistrations(db: PrismaClient, kipProgramId: number) {
  console.log("📝 Seeding KIP Registrations...");

  const registrations = await db.kipRegistration.createMany({
    data: [
      // Registration 1 - Pending
      {
        programId: kipProgramId,
        studentName: "Ahmad Fauzi",
        homeAddress: "Jl. Raya Sidoarjo No. 123, Sidoarjo",
        phoneNumber: "081234567890",
        nik: "3515011234567890",
        birthPlace: "Sidoarjo",
        dateOfBirth: new Date("2003-05-15"),
        gender: "male",
        nisn: "0034567890",
        nim: "2141720001",
        universityName: "Politeknik Elektronika Negeri Surabaya",
        npsn: "20533620",
        universityStatus: "negeri",
        studyProgram: "Teknik Informatika",
        yearLevel: "2",
        fatherName: "Bapak Ahmad",
        motherName: "Ibu Siti",
        parentPhone: "081234567891",
        parentAddress: "Jl. Raya Sidoarjo No. 123, RT/RW 003/002, Lemahputro, Sidoarjo",
        proposerName: "Andi Prasetyo",
        proposerStatus: "dpd",
        proposerStatusOther: null,
        proposerPhone: "081234567892",
        proposerAddress: "Jl. Pahlawan No. 45, Sidoarjo",
        proposerRelation: "tetangga",
        proposerRelationOther: null,
        status: "pending",
        submittedAt: new Date("2024-10-15T10:30:00"),
      },

      // Registration 2 - Pending
      {
        programId: kipProgramId,
        studentName: "Siti Nurhaliza",
        homeAddress: "Jl. Ahmad Yani No. 67, Sidoarjo",
        phoneNumber: "082345678901",
        nik: "3515012345678901",
        birthPlace: "Sidoarjo",
        dateOfBirth: new Date("2004-08-22"),
        gender: "female",
        nisn: "0045678901",
        nim: "2141720002",
        universityName: "Universitas Negeri Surabaya",
        npsn: "20533510",
        universityStatus: "negeri",
        studyProgram: "Pendidikan Guru Sekolah Dasar",
        yearLevel: "1",
        fatherName: "Bapak Hadi",
        motherName: "Ibu Ani",
        parentPhone: "082345678902",
        parentAddress: "Jl. Ahmad Yani No. 67, RT/RW 002/001, Candi, Sidoarjo",
        proposerName: "Budi Santoso",
        proposerStatus: "kordes",
        proposerStatusOther: null,
        proposerPhone: "082345678903",
        proposerAddress: "Jl. Diponegoro No. 12, Sidoarjo",
        proposerRelation: "saudara",
        proposerRelationOther: null,
        status: "pending",
        submittedAt: new Date("2024-10-18T14:20:00"),
      },

      // Registration 3 - Accepted
      {
        programId: kipProgramId,
        studentName: "Muhammad Rizki",
        homeAddress: "Jl. Veteran No. 89, Sidoarjo",
        phoneNumber: "083456789012",
        nik: "3515013456789012",
        birthPlace: "Sidoarjo",
        dateOfBirth: new Date("2002-12-10"),
        gender: "male",
        nisn: "0056789012",
        nim: "2041720001",
        universityName: "Institut Teknologi Sepuluh Nopember",
        npsn: "20533030",
        universityStatus: "negeri",
        studyProgram: "Teknik Elektro",
        yearLevel: "3",
        fatherName: "Bapak Rizki",
        motherName: "Ibu Dewi",
        parentPhone: "083456789013",
        parentAddress: "Jl. Veteran No. 89, RT/RW 004/003, Waru, Sidoarjo",
        proposerName: "Candra Wijaya",
        proposerStatus: "dpc",
        proposerStatusOther: null,
        proposerPhone: "083456789014",
        proposerAddress: "Jl. Gajah Mada No. 23, Sidoarjo",
        proposerRelation: "saudara",
        proposerRelationOther: null,
        status: "accepted",
        submittedAt: new Date("2024-09-20T09:15:00"),
        reviewedAt: new Date("2024-09-25T16:45:00"),
        reviewerNotes: "Mahasiswa berprestasi dengan IPK 3.8. Layak menerima bantuan KIP.",
      },

      // Registration 4 - Rejected
      {
        programId: kipProgramId,
        studentName: "Dewi Kartika",
        homeAddress: "Jl. Sudirman No. 34, Sidoarjo",
        phoneNumber: "084567890123",
        nik: "3515014567890123",
        birthPlace: "Sidoarjo",
        dateOfBirth: new Date("2003-03-18"),
        gender: "female",
        nisn: "0067890123",
        nim: "2141720003",
        universityName: "Universitas Airlangga",
        npsn: "20533120",
        universityStatus: "negeri",
        studyProgram: "Farmasi",
        yearLevel: "2",
        fatherName: "Bapak Kartika",
        motherName: "Ibu Rina",
        parentPhone: "084567890124",
        parentAddress: "Jl. Sudirman No. 34, RT/RW 001/004, Taman, Sidoarjo",
        proposerName: "Eko Prasetyo",
        proposerStatus: "dprt",
        proposerStatusOther: null,
        proposerPhone: "084567890125",
        proposerAddress: "Jl. Pemuda No. 56, Sidoarjo",
        proposerRelation: "tetangga",
        proposerRelationOther: null,
        status: "rejected",
        submittedAt: new Date("2024-10-05T11:00:00"),
        reviewedAt: new Date("2024-10-08T13:30:00"),
        reviewerNotes: "Data tidak lengkap dan tidak dapat diverifikasi.",
      },

      // Registration 5 - Pending (with "lainnya" status)
      {
        programId: kipProgramId,
        studentName: "Andi Firmansyah",
        homeAddress: "Jl. Gatot Subroto No. 78, Sidoarjo",
        phoneNumber: "085678901234",
        nik: "3515015678901234",
        birthPlace: "Sidoarjo",
        dateOfBirth: new Date("2004-11-05"),
        gender: "male",
        nisn: "0078901234",
        nim: "2141720004",
        universityName: "Universitas Muhammadiyah Sidoarjo",
        npsn: null,
        universityStatus: "swasta",
        studyProgram: "Teknik Mesin",
        yearLevel: "1",
        fatherName: "Bapak Firman",
        motherName: "Ibu Endang",
        parentPhone: "085678901235",
        parentAddress: "Jl. Gatot Subroto No. 78, RT/RW 005/002, Gedangan, Sidoarjo",
        proposerName: "Dian Purnama",
        proposerStatus: "lainnya",
        proposerStatusOther: "Kepala RT",
        proposerPhone: "085678901236",
        proposerAddress: "Jl. Kartini No. 90, Sidoarjo",
        proposerRelation: "lainnya",
        proposerRelationOther: "Ketua RT setempat",
        status: "pending",
        submittedAt: new Date("2024-10-22T15:45:00"),
      },
    ],
  });

  console.log(`✅ Created ${registrations.count} KIP Registrations`);

  return registrations;
}

export async function seedPipRegistrations(db: PrismaClient, pipProgramId: number) {
  console.log("📝 Seeding PIP Registrations...");

  const registrations = await db.pipRegistration.createMany({
    data: [
      // PIP Registration 1 - Pending (SD)
      {
        programId: pipProgramId,
        educationLevel: "sd",
        studentName: "Rina Kusuma",
        birthPlace: "Sidoarjo",
        dateOfBirth: new Date("2013-05-10"),
        gender: "female",
        nisn: "0011223344",
        studentClass: "4A",
        studentPhone: "081234111222",
        schoolName: "SDN 1 Sidoarjo",
        npsn: "20533101",
        schoolStatus: "negeri",
        schoolVillage: "Lemahputro",
        schoolDistrict: "Sidoarjo",
        schoolCity: "Kabupaten Sidoarjo",
        schoolProvince: "Jawa Timur",
        fatherName: "Bapak Kusuma",
        fatherPhone: "081234111223",
        motherName: "Ibu Sri",
        motherPhone: "081234111224",
        parentProvince: "Jawa Timur",
        parentCity: "Kabupaten Sidoarjo",
        parentDistrict: "Sidoarjo",
        parentVillage: "Lemahputro",
        parentRtRw: "002/001",
        parentAddress: "Jl. Melati No. 12",
        parentWillingJoinNasdem: true,
        parentJoinReason: "Ingin mendukung program pendidikan NasDem",
        proposerName: "Bapak Agus",
        proposerStatus: "dpd",
        proposerPhone: "081234111225",
        proposerAddress: "Jl. Pahlawan No. 10, Sidoarjo",
        proposerRelation: "tetangga",
        status: "pending",
        submittedAt: new Date("2024-10-20T10:00:00"),
      },

      // PIP Registration 2 - Pending (SMP)
      {
        programId: pipProgramId,
        educationLevel: "smp",
        studentName: "Budi Hartono",
        birthPlace: "Sidoarjo",
        dateOfBirth: new Date("2010-08-15"),
        gender: "male",
        nisn: "0022334455",
        studentClass: "8B",
        studentPhone: "082345222333",
        schoolName: "SMPN 2 Sidoarjo",
        npsn: "20533202",
        schoolStatus: "negeri",
        schoolVillage: "Candi",
        schoolDistrict: "Candi",
        schoolCity: "Kabupaten Sidoarjo",
        schoolProvince: "Jawa Timur",
        fatherName: "Bapak Hartono",
        fatherPhone: "082345222334",
        motherName: "Ibu Hartini",
        motherPhone: "082345222335",
        parentProvince: "Jawa Timur",
        parentCity: "Kabupaten Sidoarjo",
        parentDistrict: "Candi",
        parentVillage: "Candi",
        parentRtRw: "003/002",
        parentAddress: "Jl. Mawar No. 45",
        parentWillingJoinNasdem: false,
        parentJoinReason: null,
        proposerName: "Ibu Siti",
        proposerStatus: "dpc",
        proposerPhone: "082345222336",
        proposerAddress: "Jl. Veteran No. 20, Sidoarjo",
        proposerRelation: "saudara",
        status: "pending",
        submittedAt: new Date("2024-10-21T14:30:00"),
      },

      // PIP Registration 3 - Accepted (SMA)
      {
        programId: pipProgramId,
        educationLevel: "sma",
        studentName: "Dewi Anggraini",
        birthPlace: "Sidoarjo",
        dateOfBirth: new Date("2007-12-20"),
        gender: "female",
        nisn: "0033445566",
        studentClass: "11 IPA 2",
        studentPhone: "083456333444",
        schoolName: "SMAN 1 Sidoarjo",
        npsn: "20533303",
        schoolStatus: "negeri",
        schoolVillage: "Bulusidokare",
        schoolDistrict: "Sidoarjo",
        schoolCity: "Kabupaten Sidoarjo",
        schoolProvince: "Jawa Timur",
        fatherName: "Bapak Anggara",
        fatherPhone: "083456333445",
        motherName: "Ibu Dewi Sr.",
        motherPhone: "083456333446",
        parentProvince: "Jawa Timur",
        parentCity: "Kabupaten Sidoarjo",
        parentDistrict: "Sidoarjo",
        parentVillage: "Bulusidokare",
        parentRtRw: "001/003",
        parentAddress: "Jl. Anggrek No. 78",
        parentWillingJoinNasdem: true,
        parentJoinReason: "Tertarik dengan program sosial NasDem",
        proposerName: "Pak Bambang",
        proposerStatus: "kordes",
        proposerPhone: "083456333447",
        proposerAddress: "Jl. Diponegoro No. 30, Sidoarjo",
        proposerRelation: "anak",
        status: "accepted",
        submittedAt: new Date("2024-09-15T09:00:00"),
        reviewedAt: new Date("2024-09-20T16:00:00"),
        reviewerNotes: "Siswa berprestasi dengan prestasi akademik baik. Layak menerima bantuan PIP.",
      },

      // PIP Registration 4 - Rejected
      {
        programId: pipProgramId,
        educationLevel: "smp",
        studentName: "Ahmad Riyadi",
        birthPlace: "Sidoarjo",
        dateOfBirth: new Date("2011-03-25"),
        gender: "male",
        nisn: "0044556677",
        studentClass: "7A",
        studentPhone: "084567444555",
        schoolName: "SMPN 3 Sidoarjo",
        npsn: "20533204",
        schoolStatus: "negeri",
        schoolVillage: "Waru",
        schoolDistrict: "Waru",
        schoolCity: "Kabupaten Sidoarjo",
        schoolProvince: "Jawa Timur",
        fatherName: "Bapak Riyadi",
        fatherPhone: "084567444556",
        motherName: "Ibu Rianti",
        motherPhone: "084567444557",
        parentProvince: "Jawa Timur",
        parentCity: "Kabupaten Sidoarjo",
        parentDistrict: "Waru",
        parentVillage: "Waru",
        parentRtRw: "004/002",
        parentAddress: "Jl. Kenanga No. 90",
        parentWillingJoinNasdem: false,
        parentJoinReason: null,
        proposerName: "Ibu Ani",
        proposerStatus: "dprt",
        proposerPhone: "084567444558",
        proposerAddress: "Jl. Sudirman No. 40, Sidoarjo",
        proposerRelation: "tetangga",
        status: "rejected",
        submittedAt: new Date("2024-10-10T11:00:00"),
        reviewedAt: new Date("2024-10-15T15:00:00"),
        reviewerNotes: "Data tidak sesuai kriteria penerima PIP. Keluarga tidak memenuhi syarat ekonomi.",
      },

      // PIP Registration 5 - Pending (with lainnya)
      {
        programId: pipProgramId,
        educationLevel: "sd",
        studentName: "Siti Aminah",
        birthPlace: "Sidoarjo",
        dateOfBirth: new Date("2012-07-18"),
        gender: "female",
        nisn: "0055667788",
        studentClass: "6B",
        studentPhone: "085678555666",
        schoolName: "SDN 5 Sidoarjo",
        npsn: "20533105",
        schoolStatus: "negeri",
        schoolVillage: "Gedangan",
        schoolDistrict: "Gedangan",
        schoolCity: "Kabupaten Sidoarjo",
        schoolProvince: "Jawa Timur",
        fatherName: "Bapak Amin",
        fatherPhone: "085678555667",
        motherName: "Ibu Aminah Sr.",
        motherPhone: "085678555668",
        parentProvince: "Jawa Timur",
        parentCity: "Kabupaten Sidoarjo",
        parentDistrict: "Gedangan",
        parentVillage: "Gedangan",
        parentRtRw: "005/001",
        parentAddress: "Jl. Dahlia No. 23",
        parentWillingJoinNasdem: true,
        parentJoinReason: "Ingin ikut serta dalam kegiatan partai",
        proposerName: "Pak Lurah",
        proposerStatus: "lainnya",
        proposerStatusOther: "Kepala Desa",
        proposerPhone: "085678555669",
        proposerAddress: "Kantor Desa Gedangan",
        proposerRelation: "lainnya",
        proposerRelationOther: "Kepala Desa setempat",
        status: "pending",
        submittedAt: new Date("2024-10-23T13:45:00"),
      },
    ],
  });

  console.log(`✅ Created ${registrations.count} PIP Registrations`);

  return registrations;
}
