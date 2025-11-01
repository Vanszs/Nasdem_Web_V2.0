import { z } from "zod";

export const kipFormSchema = z.object({
  // Data Mahasiswa
  studentName: z.string().min(3, "Nama mahasiswa minimal 3 karakter"),
  homeAddress: z.string().min(10, "Alamat rumah minimal 10 karakter"),
  phoneNumber: z.string().min(10, "Nomor HP minimal 10 digit"),
  nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit"),
  birthPlace: z.string().min(2, "Tempat lahir minimal 2 karakter"),
  dateOfBirth: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["male", "female"], {
    required_error: "Pilih jenis kelamin",
  }),
  nisn: z.string().optional(),
  nim: z.string().min(1, "NIM wajib diisi"),

  // Data Universitas
  universityName: z.string().min(3, "Nama universitas minimal 3 karakter"),
  npsn: z.string().optional(),
  universityStatus: z.enum(["negeri", "swasta"], {
    required_error: "Pilih status perguruan tinggi",
  }),
  studyProgram: z.string().min(2, "Program studi minimal 2 karakter"),
  yearLevel: z.string().min(1, "Tahun angkatan wajib diisi"),
  universityProvince: z.string().optional(),
  universityCity: z.string().optional(),
  universityDistrict: z.string().optional(),
  universityVillage: z.string().optional(),

  // Data Orang Tua
  fatherName: z.string().min(3, "Nama ayah/wali minimal 3 karakter"),
  motherName: z.string().min(3, "Nama ibu minimal 3 karakter"),
  parentPhone: z.string().min(10, "Nomor HP orang tua minimal 10 digit"),
  parentProvince: z.string().min(1, "Pilih provinsi"),
  parentCity: z.string().min(1, "Pilih kota/kabupaten"),
  parentDistrict: z.string().min(1, "Pilih kecamatan"),
  parentVillage: z.string().min(1, "Pilih desa/kelurahan"),
  parentRtRw: z.string().min(1, "RT/RW wajib diisi"),
  parentAddress: z.string().min(10, "Alamat detail minimal 10 karakter"),
  parentWillingJoinNasdem: z.boolean(),
  parentJoinReason: z.string().optional(),

  // Data Pengusul
  proposerName: z.string().min(3, "Nama pengusul minimal 3 karakter"),
  proposerStatus: z.enum(
    ["korcam", "korkel_kordes", "kortps", "partai", "relawan", "lainnya"],
    {
      required_error: "Pilih status pengusul",
    }
  ),
  proposerStatusOther: z.string().optional(),
  proposerPhone: z.string().min(10, "Nomor HP pengusul minimal 10 digit"),
  proposerAddress: z.string().min(10, "Alamat pengusul minimal 10 karakter"),
  proposerRelation: z.enum(
    ["anak", "saudara", "kerabat", "tetangga", "lainnya"],
    {
      required_error: "Pilih hubungan dengan mahasiswa",
    }
  ),
  proposerRelationOther: z.string().optional(),
});

export type KipFormData = z.infer<typeof kipFormSchema>;
