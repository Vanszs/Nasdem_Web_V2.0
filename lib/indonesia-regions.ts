// Data wilayah Indonesia untuk form pendaftaran
// Focus: Jawa Timur - Sidoarjo (bisa diperluas ke wilayah lain)

export interface Village {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
  villages: Village[];
}

export interface City {
  id: string;
  name: string;
  districts: District[];
}

export interface Province {
  id: string;
  name: string;
  cities: City[];
}

// Data Sidoarjo - Jawa Timur
export const INDONESIA_REGIONS: Province[] = [
  {
    id: "35",
    name: "Jawa Timur",
    cities: [
      {
        id: "3515",
        name: "Kabupaten Sidoarjo",
        districts: [
          {
            id: "351501",
            name: "Sidoarjo",
            villages: [
              { id: "3515011001", name: "Sidokare" },
              { id: "3515011002", name: "Sidoklumpuk" },
              { id: "3515011003", name: "Cemengkalang" },
              { id: "3515011004", name: "Lemahputro" },
              { id: "3515011005", name: "Gebang" },
              { id: "3515011006", name: "Urangagung" },
              { id: "3515011007", name: "Sekardangan" },
              { id: "3515011008", name: "Sidokepung" },
            ],
          },
          {
            id: "351502",
            name: "Buduran",
            villages: [
              { id: "3515021001", name: "Buduran" },
              { id: "3515021002", name: "Sawohan" },
              { id: "3515021003", name: "Banjarkemantren" },
              { id: "3515021004", name: "Prasung" },
              { id: "3515021005", name: "Siwalan Panji" },
              { id: "3515021006", name: "Gebang Putih" },
            ],
          },
          {
            id: "351503",
            name: "Candi",
            villages: [
              { id: "3515031001", name: "Candi" },
              { id: "3515031002", name: "Larangan" },
              { id: "3515031003", name: "Sumokali" },
              { id: "3515031004", name: "Bluru Kidul" },
              { id: "3515031005", name: "Gelam" },
              { id: "3515031006", name: "Sepande" },
              { id: "3515031007", name: "Kedensari" },
            ],
          },
          {
            id: "351504",
            name: "Porong",
            villages: [
              { id: "3515041001", name: "Porong" },
              { id: "3515041002", name: "Pesawahan" },
              { id: "3515041003", name: "Lajuk" },
              { id: "3515041004", name: "Plumbon" },
              { id: "3515041005", name: "Kebonagung" },
              { id: "3515041006", name: "Pamotan" },
              { id: "3515041007", name: "Kesambi" },
              { id: "3515041008", name: "Mindi" },
              { id: "3515041009", name: "Gedang" },
              { id: "3515041010", name: "Gampingrowo" },
              { id: "3515041011", name: "Wunut" },
              { id: "3515041012", name: "Juwet Kenongo" },
              { id: "3515041013", name: "Candipari" },
              { id: "3515041014", name: "Renokenongo" },
            ],
          },
          {
            id: "351505",
            name: "Krembung",
            villages: [
              { id: "3515051001", name: "Krembung" },
              { id: "3515051002", name: "Keboansikep" },
              { id: "3515051003", name: "Balonggarut" },
              { id: "3515051004", name: "Kedungrawan" },
              { id: "3515051005", name: "Winong" },
              { id: "3515051006", name: "Wonomlati" },
              { id: "3515051007", name: "Kemasan" },
              { id: "3515051008", name: "Terik" },
              { id: "3515051009", name: "Kejapanan" },
            ],
          },
          {
            id: "351506",
            name: "Tulangan",
            villages: [
              { id: "3515061001", name: "Tulangan" },
              { id: "3515061002", name: "Kepuh Kemiri" },
              { id: "3515061003", name: "Modong" },
              { id: "3515061004", name: "Singopadu" },
              { id: "3515061005", name: "Kepatihan" },
              { id: "3515061006", name: "Kendal Pecabean" },
              { id: "3515061007", name: "Grogol" },
            ],
          },
          {
            id: "351507",
            name: "Tanggulangin",
            villages: [
              { id: "3515071001", name: "Tanggulangin" },
              { id: "3515071002", name: "Ketegan" },
              { id: "3515071003", name: "Banjarsari" },
              { id: "3515071004", name: "Kalisampurno" },
              { id: "3515071005", name: "Putat" },
              { id: "3515071006", name: "Kedinding" },
              { id: "3515071007", name: "Kalitengah" },
              { id: "3515071008", name: "Kebon Candi" },
              { id: "3515071009", name: "Penatarsewu" },
              { id: "3515071010", name: "Banjar Kemuning" },
            ],
          },
          {
            id: "351508",
            name: "Jabon",
            villages: [
              { id: "3515081001", name: "Jabon" },
              { id: "3515081002", name: "Semambung" },
              { id: "3515081003", name: "Kedung Banteng" },
              { id: "3515081004", name: "Lebo" },
              { id: "3515081005", name: "Kupang" },
              { id: "3515081006", name: "Pabean" },
              { id: "3515081007", name: "Permisan" },
              { id: "3515081008", name: "Kedung Pandan" },
              { id: "3515081009", name: "Tambak Oso Wilangun" },
              { id: "3515081010", name: "Krian Sidorukun" },
              { id: "3515081011", name: "Balongsari" },
            ],
          },
          {
            id: "351509",
            name: "Krian",
            villages: [
              { id: "3515091001", name: "Krian" },
              { id: "3515091002", name: "Barengkrajan" },
              { id: "3515091003", name: "Siwalanpanji" },
              { id: "3515091004", name: "Gampengrejo" },
              { id: "3515091005", name: "Keboharan" },
              { id: "3515091006", name: "Tanjungan" },
              { id: "3515091007", name: "Tebel" },
              { id: "3515091008", name: "Tanjungsari" },
              { id: "3515091009", name: "Jeruk Gamping" },
            ],
          },
          {
            id: "351510",
            name: "Balongbendo",
            villages: [
              { id: "3515101001", name: "Balongbendo" },
              { id: "3515101002", name: "Kludan" },
              { id: "3515101003", name: "Kupang" },
              { id: "3515101004", name: "Kalisongo" },
              { id: "3515101005", name: "Bakung" },
              { id: "3515101006", name: "Popoh" },
              { id: "3515101007", name: "Karang Tanjung" },
              { id: "3515101008", name: "Juwet Kalong" },
              { id: "3515101009", name: "Kepuh Kiriman" },
              { id: "3515101010", name: "Sembung" },
            ],
          },
          {
            id: "351511",
            name: "Wonoayu",
            villages: [
              { id: "3515111001", name: "Wonoayu" },
              { id: "3515111002", name: "Pagerngumbuk" },
              { id: "3515111003", name: "Pilang" },
              { id: "3515111004", name: "Semambung" },
              { id: "3515111005", name: "Plaosan" },
              { id: "3515111006", name: "Candiwatuagung" },
              { id: "3515111007", name: "Betet" },
              { id: "3515111008", name: "Cangkringmalang" },
              { id: "3515111009", name: "Panjunan" },
            ],
          },
          {
            id: "351512",
            name: "Tarik",
            villages: [
              { id: "3515121001", name: "Tarik" },
              { id: "3515121002", name: "Klantingsari" },
              { id: "3515121003", name: "Mergobener" },
              { id: "3515121004", name: "Kramat Tumenggung" },
              { id: "3515121005", name: "Janti" },
              { id: "3515121006", name: "Kalitengah" },
              { id: "3515121007", name: "Kedung Peluk" },
              { id: "3515121008", name: "Mergosari" },
              { id: "3515121009", name: "Gampingan" },
              { id: "3515121010", name: "Jeruk Purut" },
              { id: "3515121011", name: "Kebon Sari" },
              { id: "3515121012", name: "Sumber Pandan" },
            ],
          },
          {
            id: "351513",
            name: "Prambon",
            villages: [
              { id: "3515131001", name: "Prambon" },
              { id: "3515131002", name: "Karang Poh" },
              { id: "3515131003", name: "Sukorejo" },
              { id: "3515131004", name: "Kedung Kendo" },
              { id: "3515131005", name: "Gelang" },
              { id: "3515131006", name: "Ketimang" },
              { id: "3515131007", name: "Karang Pandan" },
              { id: "3515131008", name: "Prambon Lor" },
              { id: "3515131009", name: "Gedangan" },
              { id: "3515131010", name: "Jambangan" },
              { id: "3515131011", name: "Kedung Rejo" },
            ],
          },
          {
            id: "351514",
            name: "Taman",
            villages: [
              { id: "3515141001", name: "Taman" },
              { id: "3515141002", name: "Jemundo" },
              { id: "3515141003", name: "Ngelom" },
              { id: "3515141004", name: "Wonocolo" },
              { id: "3515141005", name: "Ketegan" },
              { id: "3515141006", name: "Kletek" },
              { id: "3515141007", name: "Gilang" },
              { id: "3515141008", name: "Geluran" },
              { id: "3515141009", name: "Manukan Kulon" },
              { id: "3515141010", name: "Kalijaten" },
              { id: "3515141011", name: "Jemirahan" },
            ],
          },
          {
            id: "351515",
            name: "Waru",
            villages: [
              { id: "3515151001", name: "Waru" },
              { id: "3515151002", name: "Wadungasri" },
              { id: "3515151003", name: "Bungurasih" },
              { id: "3515151004", name: "Janti" },
              { id: "3515151005", name: "Medaeng" },
              { id: "3515151006", name: "Tambak Sumur" },
              { id: "3515151007", name: "Wedoro" },
              { id: "3515151008", name: "Kepuh Kiriman" },
              { id: "3515151009", name: "Kureksari" },
              { id: "3515151010", name: "Ngingas" },
              { id: "3515151011", name: "Berbek Industri" },
            ],
          },
          {
            id: "351516",
            name: "Gedangan",
            villages: [
              { id: "3515161001", name: "Gedangan" },
              { id: "3515161002", name: "Ketajen" },
              { id: "3515161003", name: "Sawotratap" },
              { id: "3515161004", name: "Kepuh Telu" },
              { id: "3515161005", name: "Kragan" },
              { id: "3515161006", name: "Tebel" },
              { id: "3515161007", name: "Keboguyang" },
              { id: "3515161008", name: "Banjar Bendo" },
            ],
          },
          {
            id: "351517",
            name: "Sedati",
            villages: [
              { id: "3515171001", name: "Sedati Gede" },
              { id: "3515171002", name: "Sedati Agung" },
              { id: "3515171003", name: "Pabean" },
              { id: "3515171004", name: "Pulungan" },
              { id: "3515171005", name: "Pranti" },
              { id: "3515171006", name: "Semampir" },
              { id: "3515171007", name: "Kalanganyar" },
              { id: "3515171008", name: "Buncitan" },
              { id: "3515171009", name: "Betro" },
              { id: "3515171010", name: "Tambak Cemandi" },
              { id: "3515171011", name: "Banjar Kemantren" },
            ],
          },
          {
            id: "351518",
            name: "Sukodono",
            villages: [
              { id: "3515181001", name: "Sukodono" },
              { id: "3515181002", name: "Gebang" },
              { id: "3515181003", name: "Ngaresrejo" },
              { id: "3515181004", name: "Sruni" },
              { id: "3515181005", name: "Pekarungan" },
              { id: "3515181006", name: "Panjunan" },
              { id: "3515181007", name: "Masangan Wetan" },
              { id: "3515181008", name: "Masangan Kulon" },
              { id: "3515181009", name: "Cemandi" },
              { id: "3515181010", name: "Suruh" },
              { id: "3515181011", name: "Anggaswangi" },
            ],
          },
        ],
      },
    ],
  },
];

// Helper functions
export function getProvinces(): Province[] {
  return INDONESIA_REGIONS;
}

export function getCitiesByProvince(provinceId: string): City[] {
  const province = INDONESIA_REGIONS.find((p) => p.id === provinceId);
  return province?.cities || [];
}

export function getDistrictsByCity(cityId: string): District[] {
  for (const province of INDONESIA_REGIONS) {
    const city = province.cities.find((c) => c.id === cityId);
    if (city) return city.districts;
  }
  return [];
}

export function getVillagesByDistrict(districtId: string): Village[] {
  for (const province of INDONESIA_REGIONS) {
    for (const city of province.cities) {
      const district = city.districts.find((d) => d.id === districtId);
      if (district) return district.villages;
    }
  }
  return [];
}
