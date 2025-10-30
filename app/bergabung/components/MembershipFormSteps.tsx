"use client";

import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UploadKTP } from "./UploadKTP";
import { BeneficiaryProgramSelect } from "./BeneficiaryProgramSelect";
import { MembershipFormValues } from "./schema";
import { RefObject } from "react";

export function Step1({ control }: { control: Control<MembershipFormValues> }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        <FormField
          control={control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
                <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                  <span className="w-3.5 h-3.5 bg-[#001B55] rounded-full" />
                </div>
                Nama Lengkap <span className="text-[#C81E1E]">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan nama lengkap sesuai KTP"
                  className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="nik"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
                <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                  <span className="w-3.5 h-3.5 bg-[#001B55] rounded-full" />
                </div>
                NIK <span className="text-[#C81E1E]">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  maxLength={16}
                  placeholder="16 digit NIK"
                  className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
                <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                  <span className="w-3.5 h-3.5 bg-[#001B55] rounded-full" />
                </div>
                Email <span className="text-[#C81E1E]">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
                <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                  <span className="w-3.5 h-3.5 bg-[#001B55] rounded-full" />
                </div>
                Nomor Telepon <span className="text-[#C81E1E]">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        <FormField
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#001B55] font-bold text-sm">
                Tanggal Lahir <span className="text-[#C81E1E]">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#001B55] font-bold text-sm">
                Jenis Kelamin <span className="text-[#C81E1E]">*</span>
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300">
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
      </div>
    </div>
  );
}

export function Step2({ control }: { control: Control<MembershipFormValues> }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
              <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                <span className="w-3.5 h-3.5 bg-[#001B55] rounded-full" />
              </div>
              Alamat Lengkap <span className="text-[#C81E1E]">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                rows={5}
                placeholder="Masukkan alamat lengkap sesuai KTP\nContoh: Jl. Pahlawan No. 123, RT 02/RW 03, Kelurahan Sidoarjo, Kecamatan Sidoarjo"
                className="rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300 resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="occupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
              <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                <span className="w-3.5 h-3.5 bg-[#001B55] rounded-full" />
              </div>
              Pekerjaan <span className="text-[#C81E1E]">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Contoh: Pegawai Swasta, Wiraswasta, Guru, dll"
                className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export function Step3({
  control,
  isBeneficiary,
  onBeneficiaryChange,
  programId,
  onProgramChange,
  ktpPreview,
  onPick,
  onFileChange,
  onRemove,
  inputRef,
}: {
  control: Control<MembershipFormValues>;
  isBeneficiary: boolean;
  onBeneficiaryChange: (checked: boolean) => void;
  programId: string;
  onProgramChange: (v: string) => void;
  ktpPreview: string;
  onPick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (e?: React.MouseEvent) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      <UploadKTP
        ktpPreview={ktpPreview}
        onPick={onPick}
        onFileChange={onFileChange}
        onRemove={onRemove}
        inputRef={inputRef}
      />

      <div className="space-y-6 pt-6 border-t-2 border-gray-100">
        <div className="bg-[#F0F0F0] rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300">
          <div className="flex items-start space-x-4">
            <FormField
              control={control}
              name="isBeneficiary"
              render={({ field }) => (
                <>
                  <Checkbox
                    id="isBeneficiary"
                    checked={field.value}
                    onCheckedChange={(v) => {
                      const checked = Boolean(v);
                      field.onChange(checked);
                      onBeneficiaryChange(checked);
                    }}
                    className="mt-1.5 w-5 h-5 rounded border-2 data-[state=checked]:bg-[#FF9C04] data-[state=checked]:border-[#FF9C04]"
                  />
                  <div className="space-y-2 flex-1">
                    <Label
                      htmlFor="isBeneficiary"
                      className="text-base font-bold text-[#001B55] cursor-pointer leading-tight"
                    >
                      Saya adalah penerima manfaat program kerja
                    </Label>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Centang jika Anda pernah atau sedang menerima bantuan dari
                      program kerja NasDem Sidoarjo
                    </p>
                  </div>
                </>
              )}
            />
          </div>
          {isBeneficiary && (
            <BeneficiaryProgramSelect
              enabled={isBeneficiary}
              value={programId}
              onChange={onProgramChange}
            />
          )}
        </div>
      </div>

      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
              <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                <span className="w-3.5 h-3.5 bg-[#001B55] rounded-full" />
              </div>
              Catatan Tambahan (Opsional)
            </FormLabel>
            <FormControl>
              <Textarea
                rows={4}
                placeholder="Sampaikan pesan, pertanyaan, atau catatan tambahan Anda di sini"
                className="rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300 resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
