"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Edit3, Users } from "lucide-react";

interface LookupRegion {
  id: number;
  name: string;
  type: string;
}

interface LookupSayap {
  id: number;
  name: string;
}

export interface OrganizationItem {
  id: number;
  level: string;
  position: string;
  region?: { id: number; name: string; type: string } | null;
  sayapType?: { id: number; name: string } | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface EditOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: OrganizationItem | null;
  regions: LookupRegion[];
  sayapTypes: LookupSayap[];
  onUpdate: (
    id: number,
    payload: {
      level?: string;
      position?: string;
      regionId?: number | null;
      sayapTypeId?: number | null;
      startDate?: string;
      endDate?: string;
    }
  ) => void;
  updating: boolean;
}

export function EditOrganizationDialog({
  open,
  onOpenChange,
  item,
  regions,
  sayapTypes,
  onUpdate,
  updating,
}: EditOrganizationDialogProps) {
  const [form, setForm] = React.useState({
    level: "",
    position: "",
    regionId: null as number | null,
    sayapTypeId: null as number | null,
    startDate: "",
    endDate: "",
  });

  React.useEffect(() => {
    if (open && item) {
      setForm({
        level: item.level,
        position: item.position,
        regionId: item.region?.id ?? null,
        sayapTypeId: item.sayapType?.id ?? null,
        startDate: item.startDate ? item.startDate.substring(0, 10) : "",
        endDate: item.endDate ? item.endDate.substring(0, 10) : "",
      });
    }
  }, [open, item]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    onUpdate(item.id, {
      level: form.level,
      position: form.position,
      regionId: form.regionId ?? null,
      sayapTypeId: form.sayapTypeId ?? null,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    });
  };

  const showRegion = ["dpd", "dpc", "dprt", "kader"].includes(form.level);
  const showSayap = form.level === "sayap";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#FF9C04]/5 via-transparent to-[#001B55]/5 rounded-2xl" />

        <div className="relative">
          <DialogHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Edit3 className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-light text-[#001B55] tracking-wide">
              Edit Struktur
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 font-light mt-2">
              Perbarui informasi struktur organisasi yang sudah ada
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-8">
            {/* Primary Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#FF9C04] to-[#001B55] rounded-full" />
                <h3 className="text-sm font-medium text-[#001B55] tracking-wide uppercase">
                  Informasi Utama
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-medium text-[#001B55]/80 uppercase tracking-wider">
                    Level Organisasi
                  </label>
                  <Select
                    value={form.level || undefined}
                    onValueChange={(v) =>
                      setForm((s) => ({
                        ...s,
                        level: v,
                        regionId: null,
                        sayapTypeId: null,
                      }))
                    }
                  >
                    <SelectTrigger className="h-12 bg-white/80 border-[#001B55]/10 rounded-xl hover:border-[#001B55]/20 focus:border-[#001B55] transition-all duration-200 shadow-sm">
                      <SelectValue placeholder="Pilih level organisasi" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-[#001B55]/10 shadow-2xl">
                      <SelectItem value="dpd" className="hover:bg-[#001B55]/5">
                        DPD
                      </SelectItem>
                      <SelectItem value="dpc" className="hover:bg-[#001B55]/5">
                        DPC
                      </SelectItem>
                      <SelectItem value="dprt" className="hover:bg-[#001B55]/5">
                        DPRT
                      </SelectItem>
                      <SelectItem
                        value="sayap"
                        className="hover:bg-[#001B55]/5"
                      >
                        Sayap
                      </SelectItem>
                      <SelectItem
                        value="kader"
                        className="hover:bg-[#001B55]/5"
                      >
                        Kader
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-medium text-[#001B55]/80 uppercase tracking-wider">
                    Posisi
                  </label>
                  <Select
                    value={form.position || undefined}
                    onValueChange={(v) =>
                      setForm((s) => ({ ...s, position: v }))
                    }
                  >
                    <SelectTrigger className="h-12 bg-white/80 border-[#001B55]/10 rounded-xl hover:border-[#001B55]/20 focus:border-[#001B55] transition-all duration-200 shadow-sm">
                      <SelectValue placeholder="Pilih posisi" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-[#001B55]/10 shadow-2xl">
                      <SelectItem
                        value="ketua"
                        className="hover:bg-[#001B55]/5"
                      >
                        Ketua
                      </SelectItem>
                      <SelectItem
                        value="sekretaris"
                        className="hover:bg-[#001B55]/5"
                      >
                        Sekretaris
                      </SelectItem>
                      <SelectItem
                        value="bendahara"
                        className="hover:bg-[#001B55]/5"
                      >
                        Bendahara
                      </SelectItem>
                      <SelectItem
                        value="wakil"
                        className="hover:bg-[#001B55]/5"
                      >
                        Wakil
                      </SelectItem>
                      <SelectItem
                        value="anggota"
                        className="hover:bg-[#001B55]/5"
                      >
                        Anggota
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Regional & Wing Info Section */}
            {(showRegion || showSayap) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#001B55] to-[#FF9C04] rounded-full" />
                  <h3 className="text-sm font-medium text-[#001B55] tracking-wide uppercase">
                    Wilayah & Sayap
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {showRegion && (
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-[#001B55]/80 uppercase tracking-wider">
                        Region
                      </label>
                      <Select
                        value={
                          form.regionId != null ? String(form.regionId) : "none"
                        }
                        onValueChange={(v) =>
                          setForm((s) => ({
                            ...s,
                            regionId: v === "none" ? null : Number(v),
                          }))
                        }
                      >
                        <SelectTrigger className="h-12 bg-white/80 border-[#001B55]/10 rounded-xl hover:border-[#001B55]/20 focus:border-[#001B55] transition-all duration-200 shadow-sm">
                          <SelectValue placeholder="Pilih region" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-xl border-[#001B55]/10 shadow-2xl">
                          <SelectItem
                            value="none"
                            className="hover:bg-[#001B55]/5"
                          >
                            Tidak ada
                          </SelectItem>
                          {regions
                            .slice()
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((r) => (
                              <SelectItem
                                key={r.id}
                                value={String(r.id)}
                                className="hover:bg-[#001B55]/5"
                              >
                                {r.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {showSayap && (
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-[#001B55]/80 uppercase tracking-wider">
                        Sayap
                      </label>
                      <Select
                        value={
                          form.sayapTypeId != null
                            ? String(form.sayapTypeId)
                            : "none"
                        }
                        onValueChange={(v) =>
                          setForm((s) => ({
                            ...s,
                            sayapTypeId: v === "none" ? null : Number(v),
                          }))
                        }
                      >
                        <SelectTrigger className="h-12 bg-white/80 border-[#001B55]/10 rounded-xl hover:border-[#001B55]/20 focus:border-[#001B55] transition-all duration-200 shadow-sm">
                          <SelectValue placeholder="Pilih sayap" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-xl border-[#001B55]/10 shadow-2xl">
                          <SelectItem
                            value="none"
                            className="hover:bg-[#001B55]/5"
                          >
                            Tidak ada
                          </SelectItem>
                          {sayapTypes.map((s) => (
                            <SelectItem
                              key={s.id}
                              value={String(s.id)}
                              className="hover:bg-[#001B55]/5"
                            >
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Date Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#FF9C04] to-[#001B55] rounded-full" />
                <h3 className="text-sm font-medium text-[#001B55] tracking-wide uppercase">
                  Periode Jabatan
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-medium text-[#001B55]/80 uppercase tracking-wider">
                    Tanggal Mulai
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={form.startDate || ""}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          startDate: e.target.value || "",
                        }))
                      }
                      className="h-12 bg-white/80 border-[#001B55]/10 rounded-xl hover:border-[#001B55]/20 focus:border-[#001B55] transition-all duration-200 shadow-sm pl-4"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#001B55]/50" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-medium text-[#001B55]/80 uppercase tracking-wider">
                    Tanggal Berakhir
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={form.endDate || ""}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          endDate: e.target.value || "",
                        }))
                      }
                      className="h-12 bg-white/80 border-[#001B55]/10 rounded-xl hover:border-[#001B55]/20 focus:border-[#001B55] transition-all duration-200 shadow-sm pl-4"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#001B55]/50" />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-8 border-t border-[#001B55]/10">
              <div className="flex gap-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 border-[#001B55]/20 text-[#001B55] hover:bg-[#001B55]/5 rounded-xl font-medium transition-all duration-200"
                  onClick={() => onOpenChange(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={updating}
                  className="flex-1 h-12 bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#FF9C04]/90 hover:to-[#FF9C04] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {updating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Menyimpan...
                    </div>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
