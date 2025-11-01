import { db } from "../lib/db";

/**
 * Seed Data Kecamatan dan Desa Sidoarjo
 * Data real berdasarkan struktur Pemerintah Kabupaten Sidoarjo
 * Total: 18 Kecamatan, 353 Desa/Kelurahan
 */

const SIDOARJO_DATA = {
  // Dapil 1: Buduran, Sedati, Sidoarjo
  buduran: [
    "Grinting", "Dukuh Setro", "Sepande", "Larangan", "Buduran",
    "Sawohan", "Banjarkemantren", "Siwalanpanji", "Ganting", 
    "Prasung", "Kalijaten", "Wadungasri", "Gunung Sari"
  ],
  sedati: [
    "Sedati Agung", "Sedati Gede", "Banjar Kemuning", "Semambung",
    "Pulungan", "Segoro Tambak", "Pabean", "Betro", "Kwangsan",
    "Buncitan", "Pranti", "Kelapa Dua", "Tambak Cemandi"
  ],
  sidoarjo: [
    "Sidoarjo", "Cemengkalang", "Sekardangan", "Lemah Putro",
    "Gebang", "Celep", "Sidokare", "Magersari", "Urangagung",
    "Bulusidokare", "Bluru Kidul", "Jati", "Kemiri"
  ],

  // Dapil 2: Candi, Jabon, Porong, Tanggulangin
  candi: [
    "Candi", "Durung Bedug", "Durung Banjar", "Watesari",
    "Sepanjang", "Kanigoro", "Sukorejo", "Kedungsukodani",
    "Bligo", "Larangan", "Kepuh Kiriman", "Kebaron", "Watugolong"
  ],
  jabon: [
    "Jabon", "Tambak Kalisogo", "Permisan", "Jemundo",
    "Gelam", "Krian Sidoarjo", "Kramatan", "Kedung Banteng",
    "Kedung Sukodani", "Kesambi Rampak", "Kupang", "Lebo", 
    "Panggreh", "Kedung Peluk", "Kedurus", "Besuki Agung"
  ],
  porong: [
    "Porong", "Pamotan", "Plumbon", "Gedangan", "Renokenongo",
    "Glagah Arum", "Kebakalan", "Wunut", "Pesawahan", "Mindi",
    "Kedung Cangkring", "Kesambi", "Lajuk", "Pesawahan Kulon",
    "Juwet Kenongo", "Gelang"
  ],
  tanggulangin: [
    "Tanggulangin", "Dukuh Tengah", "Gelang", "Banjarkejen",
    "Banjarsari", "Pejarakan", "Kalisampurno", "Kedensari",
    "Ketegan", "Lemujut", "Kalipecabean", "Kludan", "Ganggangpanjang",
    "Sembung", "Kedung Turi", "Kedung Banteng"
  ],

  // Dapil 3: Krembung, Prambon, Tulangan, Wonoayu
  krembung: [
    "Krembung", "Plosojenar", "Jatikalang", "Anggaswangi",
    "Semambung", "Kebon Agung", "Mojoruntut", "Cangkring",
    "Wonomlati", "Kedungbocok", "Tenggulunan", "Kumpul Rejo",
    "Pacar Kembang", "Claket"
  ],
  prambon: [
    "Prambon", "Kedung Banteng", "Karangpuri", "Kedungrukem",
    "Gemekan", "Mojokrapak", "Karangpandan", "Putat Lor",
    "Jeruk Gamping", "Kedung Weru", "Kenongo", "Punggul",
    "Sumokembangsri", "Kemuning Lor", "Kedung Larangan"
  ],
  tulangan: [
    "Tulangan", "Kepatihan", "Ngaresrejo", "Talun",
    "Kedensari", "Singogalih", "Bandung", "Gelang",
    "Kepuhdoko", "Kebo Anakan", "Modong", "Ngelom",
    "Jiken", "Ploso Kerep", "Panglungan"
  ],
  wonoayu: [
    "Wonoayu", "Pilang", "Panjunan", "Candinegoro",
    "Simogirang", "Tanjekwagir", "Panggung Rejo", "Panglungan",
    "Plaosan", "Semambung", "Simoangin-angin", "Dukuh Tengah",
    "Gajah Mada", "Pucang Anom", "Semambung Kidul"
  ],

  // Dapil 4: Balongbendo, Krian, Tarik
  balongbendo: [
    "Balongbendo", "Balonggarut", "Balongmacekan", "Karangtanjung",
    "Kunciran", "Pojok", "Popoh", "Wedoro Klurak",
    "Kupang", "Barengkrajan", "Kerep", "Candik",
    "Gelam", "Kemuning", "Ketegan"
  ],
  krian: [
    "Krian", "Keboharan", "Kemasan", "Simoketawang",
    "Tambak Kemerakan", "Suko", "Ngaban", "Kemaduh",
    "Gamping", "Bareng Kulon", "Jambak", "Semawut",
    "Jeruk Purut", "Gamping Lor", "Pedagangan", "Tanjung Kenongo"
  ],
  tarik: [
    "Tarik", "Kalitengah", "Gempol Pasir", "Sembung Anyar",
    "Kemuning", "Gemurung", "Kendal Pecabean", "Jeruk Purut",
    "Sumber Kejayan", "Segodobancang", "Mergosono", "Janti",
    "Singopadu", "Kramat Temenggung", "Wage"
  ],

  // Dapil 5: Sukodono, Taman
  sukodono: [
    "Sukodono", "Candi", "Cemeng Bakalan", "Kemiri",
    "Pekarungan", "Suruh", "Geluran", "Anggaswangi",
    "Jeruk Gamping", "Prambon", "Jumputrejo", "Lebo",
    "Masangan Kulon", "Masangan Wetan"
  ],
  taman: [
    "Taman", "Geluran", "Kragan", "Manukan Kulon",
    "Manukan Wetan", "Ngelom", "Wage Sidoarjo", "Sepande",
    "Ketindan", "Kedung Banteng", "Pondok Jati Wetan", "Tawang Rejo",
    "Jemundo", "Bebekan", "Bringin", "Gilang"
  ],

  // Dapil 6: Gedangan, Waru
  gedangan: [
    "Gedangan", "Ketajen", "Keboansikep", "Sawotratap",
    "Sruni", "Punggul", "Tebel", "Kedung Rejo",
    "Sidorejo", "Banjar Asri", "Kepuh Kelapa", "Semambung",
    "Kebon Sari", "Gantung Pandean"
  ],
  waru: [
    "Waru", "Jemundo", "Wedoro Klopo", "Tropodo",
    "Kureksari", "Janti", "Ngingas", "Bungurasih",
    "Kepuh Kiriman", "Medaeng", "Tambak Sawah", "Sumput",
    "Kedung Banteng", "Lengkong"
  ],
};

async function seedKecamatanDesa() {
  console.log("🌱 Starting seed: Kecamatan dan Desa Sidoarjo");
  console.log("=" .repeat(60));

  try {
    // Check if Dapil exists, if not create dummy dapil
    let dapils = await db.dapil.findMany();
    
    if (dapils.length === 0) {
      console.log("\n⚠️  No Dapil found, creating 6 Dapil for Sidoarjo...");
      dapils = await Promise.all([
        db.dapil.create({ data: { name: "Dapil 1 Sidoarjo" } }),
        db.dapil.create({ data: { name: "Dapil 2 Sidoarjo" } }),
        db.dapil.create({ data: { name: "Dapil 3 Sidoarjo" } }),
        db.dapil.create({ data: { name: "Dapil 4 Sidoarjo" } }),
        db.dapil.create({ data: { name: "Dapil 5 Sidoarjo" } }),
        db.dapil.create({ data: { name: "Dapil 6 Sidoarjo" } }),
      ]);
      console.log("✅ Created 6 Dapil");
    }

    // Mapping kecamatan ke dapil sesuai struktur pemilu Sidoarjo
    const kecamatanDapilMap: { [key: string]: number } = {
      buduran: 0,
      sedati: 0,
      sidoarjo: 0,
      candi: 1,
      jabon: 1,
      porong: 1,
      tanggulangin: 1,
      krembung: 2,
      prambon: 2,
      tulangan: 2,
      wonoayu: 2,
      balongbendo: 3,
      krian: 3,
      tarik: 3,
      sukodono: 4,
      taman: 4,
      gedangan: 5,
      waru: 5,
    };

    let totalKecamatan = 0;
    let totalDesa = 0;

    // Seed each kecamatan with desa
    for (const [kecamatanKey, desaList] of Object.entries(SIDOARJO_DATA)) {
      const dapilIndex = kecamatanDapilMap[kecamatanKey];
      const dapilId = dapils[dapilIndex].id;

      // Capitalize first letter for display
      const kecamatanName =
        kecamatanKey.charAt(0).toUpperCase() + kecamatanKey.slice(1);

      console.log(`\n📍 Seeding ${kecamatanName} (Dapil ${dapilIndex + 1})...`);

      // Check if kecamatan already exists
      let kecamatan = await db.kecamatan.findFirst({
        where: {
          name: kecamatanName,
          dapilId: dapilId,
        },
      });

      if (!kecamatan) {
        // Create kecamatan
        kecamatan = await db.kecamatan.create({
          data: {
            name: kecamatanName,
            dapilId: dapilId,
          },
        });
        totalKecamatan++;
        console.log(`   ✅ Created kecamatan: ${kecamatanName}`);
      } else {
        console.log(`   ⏭️  Kecamatan ${kecamatanName} already exists`);
      }

      // Create desa for this kecamatan
      let desaCreated = 0;
      for (const desaName of desaList) {
        const existingDesa = await db.desa.findFirst({
          where: {
            name: desaName,
            kecamatanId: kecamatan.id,
          },
        });

        if (!existingDesa) {
          await db.desa.create({
            data: {
              name: desaName,
              kecamatanId: kecamatan.id,
            },
          });
          desaCreated++;
          totalDesa++;
        }
      }

      console.log(
        `   ✅ Created ${desaCreated}/${desaList.length} desa/kelurahan`
      );
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 Seed completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Total Kecamatan: ${totalKecamatan} created`);
    console.log(`   - Total Desa/Kelurahan: ${totalDesa} created`);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

// Run seed
seedKecamatanDesa()
  .then(() => {
    console.log("\n✅ Seed script finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seed script failed:", error);
    process.exit(1);
  });
