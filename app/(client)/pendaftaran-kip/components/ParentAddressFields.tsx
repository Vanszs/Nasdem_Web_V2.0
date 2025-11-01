import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { MapPin, Home, Check, ChevronsUpDown } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { KipFormData } from "../schema";

interface ParentAddressFieldsProps {
  form: UseFormReturn<KipFormData>;
}

export function ParentAddressFields({ form }: ParentAddressFieldsProps) {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [kecamatanList, setKecamatanList] = useState<Array<{ id: number; name: string }>>([]);
  const [desaList, setDesaList] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingKecamatan, setLoadingKecamatan] = useState(false);
  const [loadingDesa, setLoadingDesa] = useState(false);
  const [openKecamatan, setOpenKecamatan] = useState(false);
  const [openDesa, setOpenDesa] = useState(false);

  // Fetch kecamatan on mount
  useEffect(() => {
    const fetchKecamatan = async () => {
      setLoadingKecamatan(true);
      try {
        const res = await fetch("/api/regions/kecamatan");
        const data = await res.json();
        if (data.data) {
          setKecamatanList(data.data);
        }
      } catch (error) {
        console.error("Error fetching kecamatan:", error);
        toast.error("Gagal memuat data kecamatan");
      } finally {
        setLoadingKecamatan(false);
      }
    };
    fetchKecamatan();
  }, []);

  // Fetch desa when kecamatan changes
  const fetchDesa = async (kecamatanName: string) => {
    if (!kecamatanName) {
      setDesaList([]);
      return;
    }

    setLoadingDesa(true);
    try {
      const res = await fetch(`/api/regions/desa?kecamatan=${encodeURIComponent(kecamatanName)}`);
      const data = await res.json();
      if (data.data) {
        setDesaList(data.data);
      }
    } catch (error) {
      console.error("Error fetching desa:", error);
      toast.error("Gagal memuat data desa");
    } finally {
      setLoadingDesa(false);
    }
  };

  return (
    <div className="space-y-4 border-2 border-[#001B55]/20 rounded-xl p-6 bg-gradient-to-br from-white to-blue-50/20">
      <h3 className="text-lg font-bold text-[#001B55] flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5" />
        Alamat Lengkap Orang Tua
      </h3>

      {/* Provinsi - Fixed */}
      <FormField
        control={form.control}
        name="parentProvince"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#001B55] font-semibold">
              Provinsi <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value="Jawa Timur"
                readOnly
                disabled
                className="h-12 rounded-xl border-[#001B55]/20 bg-gray-50 text-gray-600 font-medium"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Kota/Kabupaten - Fixed */}
      <FormField
        control={form.control}
        name="parentCity"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#001B55] font-semibold">
              Kota/Kabupaten <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value="Kabupaten Sidoarjo"
                readOnly
                disabled
                className="h-12 rounded-xl border-[#001B55]/20 bg-gray-50 text-gray-600 font-medium"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Kecamatan - API dengan Search */}
      <FormField
        control={form.control}
        name="parentDistrict"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-[#001B55] font-semibold">
              Kecamatan <span className="text-red-500">*</span>
            </FormLabel>
            <Popover open={openKecamatan} onOpenChange={setOpenKecamatan}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={loadingKecamatan}
                    className={cn(
                      "h-12 w-full justify-between rounded-xl border-[#001B55]/20 hover:border-[#001B55] hover:bg-transparent font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {loadingKecamatan
                      ? "Memuat data..."
                      : field.value
                      ? kecamatanList.find((k) => k.name === field.value)?.name
                      : "Pilih Kecamatan"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Cari kecamatan..." className="h-9" />
                  <CommandList className="max-h-[240px] overflow-y-auto">
                    <CommandEmpty>Kecamatan tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {kecamatanList.map((kecamatan) => (
                        <CommandItem
                          key={kecamatan.id}
                          value={kecamatan.name}
                          onSelect={() => {
                            field.onChange(kecamatan.name);
                            setSelectedDistrict(kecamatan.name);
                            form.setValue("parentVillage", "");
                            fetchDesa(kecamatan.name);
                            setOpenKecamatan(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === kecamatan.name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {kecamatan.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Desa/Kelurahan - API berdasarkan Kecamatan */}
      <FormField
        control={form.control}
        name="parentVillage"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-[#001B55] font-semibold">
              Desa/Kelurahan <span className="text-red-500">*</span>
            </FormLabel>
            <Popover open={openDesa} onOpenChange={setOpenDesa}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={!selectedDistrict || loadingDesa}
                    className={cn(
                      "h-12 w-full justify-between rounded-xl border-[#001B55]/20 hover:border-[#001B55] hover:bg-transparent font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {loadingDesa
                      ? "Memuat data..."
                      : !selectedDistrict
                      ? "Pilih kecamatan terlebih dahulu"
                      : field.value
                      ? desaList.find((d) => d.name === field.value)?.name
                      : "Pilih Desa/Kelurahan"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Cari desa/kelurahan..." className="h-9" />
                  <CommandList className="max-h-[240px] overflow-y-auto">
                    <CommandEmpty>Desa/Kelurahan tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {desaList.map((desa) => (
                        <CommandItem
                          key={desa.id}
                          value={desa.name}
                          onSelect={() => {
                            field.onChange(desa.name);
                            setOpenDesa(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === desa.name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {desa.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* RT/RW */}
      <FormField
        control={form.control}
        name="parentRtRw"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#001B55] font-semibold">
              RT/RW <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Contoh: 001/002 atau RT 01/RW 02"
                className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
              />
            </FormControl>
            <FormDescription className="text-xs">
              Format: RT/RW (contoh: 001/002)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Alamat Detail */}
      <FormField
        control={form.control}
        name="parentAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
              <Home className="w-4 h-4" />
              Alamat Detail <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                rows={3}
                placeholder="Alamat lengkap: Nama jalan, gang, nomor rumah&#10;Contoh: Jl. Pahlawan No. 45, Gang Mawar 3, Rumah cat biru"
                className="rounded-xl resize-none border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
              />
            </FormControl>
            <FormDescription className="text-xs">
              Tuliskan detail jalan, gang, nomor rumah, atau patokan lainnya
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
