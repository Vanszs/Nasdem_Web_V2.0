import { UseFormReturn } from "react-hook-form";
import { User, Phone } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KipFormData } from "../schema";

interface Step1DataMahasiswaProps {
  form: UseFormReturn<KipFormData>;
}

export function Step1DataMahasiswa({ form }: Step1DataMahasiswaProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Nama Mahasiswa */}
      <FormField
        control={form.control}
        name="studentName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
              <User className="w-4 h-4" />
              Nama Lengkap Mahasiswa <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Nama lengkap sesuai identitas"
                className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* NIK */}
      <FormField
        control={form.control}
        name="nik"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#001B55] font-semibold">
              NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="16 digit NIK"
                maxLength={16}
                className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tempat & Tanggal Lahir */}
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="birthPlace"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#001B55] font-semibold">
                Tempat Lahir <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Contoh: Sidoarjo"
                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#001B55] font-semibold">
                Tanggal Lahir <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Jenis Kelamin */}
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#001B55] font-semibold">
              Jenis Kelamin <span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="male">Laki-laki</SelectItem>
                <SelectItem value="female">Perempuan</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* NISN & NIM */}
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="nisn"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#001B55] font-semibold">
                NISN (Nomor Induk Siswa Nasional)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="NISN jika ada"
                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                />
              </FormControl>
              <FormDescription className="text-xs">
                Opsional - Isi jika memiliki NISN
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nim"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#001B55] font-semibold">
                NIM (Nomor Induk Mahasiswa) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nomor Induk Mahasiswa"
                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Nomor HP/WA */}
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
              <Phone className="w-4 h-4" />
              Nomor HP/WA Mahasiswa <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="tel"
                placeholder="08xxxxxxxxxx"
                className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Alamat Rumah */}
      <FormField
        control={form.control}
        name="homeAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#001B55] font-semibold">
              Alamat Rumah Lengkap <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Alamat tempat tinggal saat ini"
                className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
