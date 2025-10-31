import { z } from "zod";

export const membershipSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(8, "Nomor telepon tidak valid"),
  dateOfBirth: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["male", "female"], { required_error: "Pilih jenis kelamin" }),
  address: z.string().min(1, "Alamat wajib diisi"),
  occupation: z.string().min(1, "Pekerjaan wajib diisi"),
  isBeneficiary: z.boolean().default(false),
  beneficiaryProgramId: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export type MembershipFormValues = z.infer<typeof membershipSchema>;
