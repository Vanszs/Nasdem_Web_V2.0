import { UseFormReturn } from "react-hook-form";
import { User, Phone, Home, MapPin } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { KipFormData } from "../schema";
import { ParentAddressFields } from "./ParentAddressFields";

interface Step3DataOrangTuaProps {
  form: UseFormReturn<KipFormData>;
}

export function Step3DataOrangTua({ form }: Step3DataOrangTuaProps) {
  const watchParentWilling = form.watch("parentWillingJoinNasdem");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Nama Ayah & Ibu */}
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="fatherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
                <User className="w-4 h-4" />
                Nama Ayah/Wali <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nama lengkap ayah/wali"
                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="motherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
                <User className="w-4 h-4" />
                Nama Ibu <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nama lengkap ibu"
                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Nomor HP Orang Tua */}
      <FormField
        control={form.control}
        name="parentPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
              <Phone className="w-4 h-4" />
              Nomor HP/WA Orang Tua <span className="text-red-500">*</span>
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

      {/* Alamat Orang Tua - Cascading Component */}
      <ParentAddressFields form={form} />

      {/* Bersedia Bergabung */}
      <FormField
        control={form.control}
        name="parentWillingJoinNasdem"
        render={({ field }) => (
          <FormItem className="border-2 border-[#001B55]/20 rounded-xl p-6 bg-blue-50/30 hover:border-[#001B55]/40 transition-all">
            <div className="flex items-start space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="willing-join"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel
                  htmlFor="willing-join"
                  className="text-[#001B55] font-semibold cursor-pointer"
                >
                  Bersedia Bergabung di Partai NasDem
                </FormLabel>
                <FormDescription className="text-sm">
                  Centang jika orang tua bersedia bergabung di Partai NasDem Sidoarjo
                </FormDescription>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Alasan - Conditional */}
      {watchParentWilling !== undefined && (
        <FormField
          control={form.control}
          name="parentJoinReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#001B55] font-semibold">
                Alasan {watchParentWilling ? "Bergabung" : "Tidak Bergabung"}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  placeholder={`Jelaskan alasan ${watchParentWilling ? "bersedia" : "tidak bersedia"} bergabung (opsional)`}
                  className="rounded-xl resize-none border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
