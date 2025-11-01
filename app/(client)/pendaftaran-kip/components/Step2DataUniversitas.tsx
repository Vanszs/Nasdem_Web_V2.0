import { UseFormReturn } from "react-hook-form";
import { School } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { KipFormData } from "../schema";
import { UNIVERSITY_STATUS_OPTIONS } from "../constants";

interface Step2DataUniversitasProps {
  form: UseFormReturn<KipFormData>;
}

export function Step2DataUniversitas({ form }: Step2DataUniversitasProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Nama Universitas */}
      <FormField
        control={form.control}
        name="universityName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
              <School className="w-4 h-4" />
              Nama Perguruan Tinggi <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Nama universitas/institut/politeknik lengkap"
                className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* NPSN */}
      <FormField
        control={form.control}
        name="npsn"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#001B55] font-semibold">
              NPSN (Nomor Pokok Sekolah Nasional)
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Masukkan NPSN jika ada"
                className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
              />
            </FormControl>
            <FormDescription className="text-xs">
              Opsional - Isi jika perguruan tinggi memiliki NPSN
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Status Universitas - Radio */}
      <FormField
        control={form.control}
        name="universityStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#001B55] font-semibold text-base mb-3 block">
              Status Perguruan Tinggi <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex gap-6"
              >
                {UNIVERSITY_STATUS_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Program Studi & Tahun Angkatan */}
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="studyProgram"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#001B55] font-semibold">
                Program Studi <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Contoh: Teknik Informatika"
                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yearLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#001B55] font-semibold">
                Tahun Angkatan <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Contoh: 2024"
                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Lokasi Universitas (Optional) */}
      <div className="space-y-4 border-2 border-[#001B55]/20 rounded-xl p-6 bg-gradient-to-br from-white to-blue-50/20">
        <h3 className="text-base font-bold text-[#001B55] mb-4">
          Lokasi Perguruan Tinggi (Opsional)
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="universityProvince"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001B55] font-semibold">
                  Provinsi
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Contoh: Jawa Timur"
                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="universityCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001B55] font-semibold">
                  Kota/Kabupaten
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Contoh: Surabaya"
                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="universityDistrict"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001B55] font-semibold">
                  Kecamatan
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nama kecamatan"
                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="universityVillage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001B55] font-semibold">
                  Kelurahan/Desa
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nama kelurahan/desa"
                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
