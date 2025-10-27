"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Target, Building, Map, Search } from "lucide-react";
import {
  ActiveTab,
  DpdFilters,
  SayapFilters,
  DpcFilters,
  DprtFilters,
} from "../utils/filterMembers";

interface RegionOption {
  value: string;
  label: string;
  type?: string;
}
interface Props {
  activeTab: ActiveTab;
  setActiveTab: (t: ActiveTab) => void;
  dpdFilters: DpdFilters;
  sayapFilters: SayapFilters;
  dpcFilters: DpcFilters;
  dprtFilters: DprtFilters;
  setDpdFilters: (v: DpdFilters) => void;
  setSayapFilters: (v: SayapFilters) => void;
  setDpcFilters: (v: DpcFilters) => void;
  setDprtFilters: (v: DprtFilters) => void;
  onTabChange: () => void;
  regions: RegionOption[]; // daftar kecamatan (untuk dpc & dprt)
  desaByKecamatan: Record<string, RegionOption[]>; // map kecamatanId -> desa[]
}

export function TabsFilters(props: Props) {
  const {
    activeTab,
    setActiveTab,
    dpdFilters,
    sayapFilters,
    dpcFilters,
    dprtFilters,
    setDpdFilters,
    setSayapFilters,
    setDpcFilters,
    setDprtFilters,
    onTabChange,
    regions,
    desaByKecamatan,
  } = props;

  const getAvailableSubRegions = () =>
    desaByKecamatan[dprtFilters.regionFilter] || [
      { value: "all", label: "Semua Desa" },
    ];

  return (
    <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-2xl p-4 shadow-sm">
      <Tabs
        value={activeTab}
        onValueChange={(value: any) => {
          setActiveTab(value as ActiveTab);
          onTabChange();
        }}
      >
        <TabsList className="grid w-full grid-cols-4 bg-transparent border-0 p-1 gap-3">
          <TabsTrigger
            value="dpd"
            className="px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 border-2 data-[state=active]:!bg-[#001B55] data-[state=active]:!text-white data-[state=active]:!border-[#001B55] data-[state=active]:shadow-lg data-[state=inactive]:border-gray-200/80 data-[state=inactive]:bg-white/50 text-[#6B7280] hover:text-[#001B55] hover:bg-white hover:border-[#001B55]/40"
          >
            <Users className="h-4 w-4 mr-1.5" />
            DPD
          </TabsTrigger>
          <TabsTrigger
            value="sayap"
            className="px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 border-2 data-[state=active]:!bg-[#9200a5] data-[state=active]:!text-white data-[state=active]:!border-[#9200a5] data-[state=active]:shadow-lg data-[state=inactive]:border-gray-200/80 data-[state=inactive]:bg-white/50 text-[#6B7280] hover:text-[#9200a5] hover:bg-white hover:border-[#9200a5]/40"
          >
            <Target className="h-4 w-4 mr-1.5" />
            Sayap
          </TabsTrigger>
          <TabsTrigger
            value="dpc"
            className="px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 border-2 data-[state=active]:!bg-[#16A34A] data-[state=active]:!text-white data-[state=active]:!border-[#16A34A] data-[state=active]:shadow-lg data-[state=inactive]:border-gray-200/80 data-[state=inactive]:bg-white/50 text-[#6B7280] hover:text-[#16A34A] hover:bg-white hover:border-[#16A34A]/40"
          >
            <Building className="h-4 w-4 mr-1.5" />
            DPC
          </TabsTrigger>
          <TabsTrigger
            value="dprt"
            className="px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 border-2 data-[state=active]:!bg-[#F59E0B] data-[state=active]:!text-white data-[state=active]:!border-[#F59E0B] data-[state=active]:shadow-lg data-[state=inactive]:border-gray-200/80 data-[state=inactive]:bg-white/50 text-[#6B7280] hover:text-[#F59E0B] hover:bg-white hover:border-[#F59E0B]/40"
          >
            <Map className="h-4 w-4 mr-1.5" />
            DPRT
          </TabsTrigger>
        </TabsList>

        {/* DPD */}
        <TabsContent value="dpd" className="mt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#001B55] h-5 w-5" />
              <Input
                placeholder="Cari anggota DPD..."
                value={dpdFilters.searchTerm}
                onChange={(e) =>
                  setDpdFilters({
                    ...dpdFilters,
                    searchTerm: e.target.value,
                  })
                }
                className="pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-gray-200/80 hover:border-[#001B55]/60 focus:border-[#001B55] rounded-full transition-all duration-300 text-sm shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>
          </div>
        </TabsContent>

        {/* SAYAP */}
        <TabsContent value="sayap" className="mt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#001B55] h-5 w-5" />
              <Input
                placeholder="Cari nama atau posisi sayap..."
                value={sayapFilters.searchTerm}
                onChange={(e) =>
                  setSayapFilters({
                    ...sayapFilters,
                    searchTerm: e.target.value,
                  })
                }
                className="pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-gray-200/80 hover:border-[#001B55]/60 focus:border-[#001B55] rounded-full transition-all duration-300 text-sm shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>
            <Select
              value={sayapFilters.departmentFilter}
              onValueChange={(v) =>
                setSayapFilters({ ...sayapFilters, departmentFilter: v })
              }
            >
              <SelectTrigger className="w-full md:w-[220px] rounded-lg border-2 border-gray-200/80 hover:border-[#001B55]/60 focus:border-[#001B55] transition-colors">
                <SelectValue placeholder="Filter Sayap" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Sayap</SelectItem>
                <SelectItem value="Perempuan">Perempuan NasDem</SelectItem>
                <SelectItem value="Pemuda">Pemuda NasDem</SelectItem>
                <SelectItem value="Ulama">Ulama NasDem</SelectItem>
                <SelectItem value="Profesional">Profesional NasDem</SelectItem>
                <SelectItem value="Pengusaha">Pengusaha NasDem</SelectItem>
                <SelectItem value="Guru">Guru NasDem</SelectItem>
                <SelectItem value="Tenaga Kesehatan">
                  Tenaga Kesehatan NasDem
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        {/* DPC */}
        <TabsContent value="dpc" className="mt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#16A34A] h-5 w-5" />
              <Input
                placeholder="Cari nama atau posisi DPC..."
                value={dpcFilters.searchTerm}
                onChange={(e) =>
                  setDpcFilters({
                    ...dpcFilters,
                    searchTerm: e.target.value,
                  })
                }
                className="pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-gray-200/80 hover:border-[#16A34A]/60 focus:border-[#16A34A] rounded-full transition-all duration-300 text-sm shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>
            <Select
              value={dpcFilters.regionFilter}
              onValueChange={(v) =>
                setDpcFilters({ ...dpcFilters, regionFilter: v })
              }
            >
              <SelectTrigger className="w-full md:w-[220px] rounded-lg border-2 border-gray-200/80 hover:border-[#16A34A]/60 focus:border-[#16A34A] transition-colors">
                <SelectValue placeholder="Filter Kecamatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kecamatan</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        {/* DPRT */}
        <TabsContent value="dprt" className="mt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F59E0B] h-5 w-5" />
              <Input
                placeholder="Cari DPRT atau Kader..."
                value={dprtFilters.searchTerm}
                onChange={(e) =>
                  setDprtFilters({
                    ...dprtFilters,
                    searchTerm: e.target.value,
                  })
                }
                className="pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-gray-200/80 hover:border-[#F59E0B]/60 focus:border-[#F59E0B] rounded-full transition-all duration-300 text-sm shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>
            <Select
              value={dprtFilters.regionFilter}
              onValueChange={(v) =>
                setDprtFilters({
                  ...dprtFilters,
                  regionFilter: v,
                  subRegionFilter: "all",
                })
              }
            >
              <SelectTrigger className="w-full md:w-[200px] rounded-lg border-2 border-gray-200/80 hover:border-[#F59E0B]/60 focus:border-[#F59E0B] transition-colors">
                <SelectValue placeholder="Filter Kecamatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kecamatan</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {dprtFilters.regionFilter !== "all" && (
              <Select
                value={dprtFilters.subRegionFilter}
                onValueChange={(v) =>
                  setDprtFilters({ ...dprtFilters, subRegionFilter: v })
                }
              >
                <SelectTrigger className="w-full md:w-[200px] rounded-lg border-2 border-gray-200/80 hover:border-[#F59E0B]/60 focus:border-[#F59E0B] transition-colors">
                  <SelectValue placeholder="Filter Desa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Desa</SelectItem>
                  {getAvailableSubRegions().map((sr) => (
                    <SelectItem key={sr.value} value={sr.value}>
                      {sr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select
              value={dprtFilters.departmentFilter}
              onValueChange={(v) =>
                setDprtFilters({ ...dprtFilters, departmentFilter: v })
              }
            >
              <SelectTrigger className="w-full md:w-[160px] rounded-lg border-2 border-gray-200/80 hover:border-[#F59E0B]/60 focus:border-[#F59E0B] transition-colors">
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="dprt">DPRT</SelectItem>
                <SelectItem value="kader">Kader</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
