import { UseFormReturn } from "react-hook-form";
import { User, Phone, Home } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KipFormData } from "../schema";
import { PROPOSER_STATUS_OPTIONS, PROPOSER_RELATION_OPTIONS } from "../constants";

interface Step4DataPengusulProps {
  form: UseFormReturn<KipFormData>;
}

export function Step4DataPengusul({ form }: Step4DataPengusulProps) {
  const watchProposerStatus = form.watch("proposerStatus");
  const watchProposerRelation = form.watch("proposerRelation");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Nama Pengusul */}
      <FormField
        control={form.control}
        name="proposerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
              <User className="w-4 h-4" />
              Nama Pengusul <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Nama lengkap pengusul"
                className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Status Pengusul */}
      <FormField
        control={form.control}
        name="proposerStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#001B55] font-semibold">
              Status Pengusul <span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all">
                  <SelectValue placeholder="Pilih status pengusul" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROPOSER_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Status Lainnya - Conditional */}
      {watchProposerStatus === "lainnya" && (
        <FormField
          control={form.control}
          name="proposerStatusOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#001B55] font-semibold">
                Sebutkan Status Lainnya
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Sebutkan status pengusul"
                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Nomor HP/WA Pengusul */}
      <FormField
        control={form.control}
        name="proposerPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
              <Phone className="w-4 h-4" />
              Nomor HP/WA Pengusul <span className="text-red-500">*</span>
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

      {/* Alamat Pengusul */}
      <FormField
        control={form.control}
        name="proposerAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
              <Home className="w-4 h-4" />
              Alamat Pengusul <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                rows={4}
                placeholder="Alamat lengkap pengusul"
                className="rounded-xl resize-none border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Hubungan dengan Mahasiswa */}
      <FormField
        control={form.control}
        name="proposerRelation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#001B55] font-semibold">
              Hubungan dengan Mahasiswa <span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all">
                  <SelectValue placeholder="Pilih hubungan" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROPOSER_RELATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Hubungan Lainnya - Conditional */}
      {watchProposerRelation === "lainnya" && (
        <FormField
          control={form.control}
          name="proposerRelationOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#001B55] font-semibold">
                Sebutkan Hubungan Lainnya
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Sebutkan hubungan dengan mahasiswa"
                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
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
