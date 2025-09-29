// Jenis tab utama
export type ActiveTab = "dpd" | "sayap" | "dpc" | "dprt";

// State filter per tab (mengikuti penggunaan di page.tsx)
export interface DpdFilters {
  searchTerm: string;
}

export interface SayapFilters {
  searchTerm: string;
  departmentFilter: string; // all | nama sayap (legacy UI)
}

export interface DpcFilters {
  searchTerm: string;
  regionFilter: string; // all | regionId (kecamatan)
}

export interface DprtFilters {
  searchTerm: string;
  regionFilter: string; // kecamatan (all | id)
  subRegionFilter: string; // desa (all | id)
  departmentFilter: string; // all | dprt | kader
}

// Nilai awal
export const initialDpdFilters: DpdFilters = { searchTerm: "" };
export const initialSayapFilters: SayapFilters = {
  searchTerm: "",
  departmentFilter: "all",
};
export const initialDpcFilters: DpcFilters = {
  searchTerm: "",
  regionFilter: "all",
};
export const initialDprtFilters: DprtFilters = {
  searchTerm: "",
  regionFilter: "all",
  subRegionFilter: "all",
  departmentFilter: "all",
};

// Ambil search term aktif (utility optional)
export function getActiveSearchTerm(
  tab: ActiveTab,
  f: {
    dpd: DpdFilters;
    sayap: SayapFilters;
    dpc: DpcFilters;
    dprt: DprtFilters;
  }
): string {
  switch (tab) {
    case "dpd":
      return f.dpd.searchTerm;
    case "sayap":
      return f.sayap.searchTerm;
    case "dpc":
      return f.dpc.searchTerm;
    case "dprt":
      return f.dprt.searchTerm;
  }
}

// Derivasi level & regionId untuk query API (sesuai logika di page.tsx)
export function deriveLevelAndRegion(
  tab: ActiveTab,
  dpc: DpcFilters,
  dprt: DprtFilters
): { level?: string; regionId?: number } {
  let level: string | undefined;
  let regionId: number | undefined;

  switch (tab) {
    case "dpd":
      level = "dpd";
      break;
    case "sayap":
      level = "sayap";
      break;
    case "dpc":
      level = "dpc";
      if (dpc.regionFilter !== "all") {
        regionId = Number(dpc.regionFilter);
      }
      break;
    case "dprt":
      level = dprt.departmentFilter === "kader" ? "kader" : "dprt";
      if (dprt.subRegionFilter !== "all") {
        regionId = Number(dprt.subRegionFilter);
      } else if (dprt.regionFilter !== "all") {
        regionId = Number(dprt.regionFilter);
      }
      break;
  }
  return { level, regionId };
}

// Bangun parameter untuk hook useMembers (kecuali page, pageSize, dll)
export function buildMemberQueryParams(
  tab: ActiveTab,
  filters: {
    dpd: DpdFilters;
    sayap: SayapFilters;
    dpc: DpcFilters;
    dprt: DprtFilters;
  },
  extra?: {
    status?: string;
    gender?: string;
  }
) {
  const search = getActiveSearchTerm(tab, filters) || undefined;
  const { level, regionId } = deriveLevelAndRegion(
    tab,
    filters.dpc,
    filters.dprt
  );

  return {
    search,
    level,
    regionId,
    status: extra?.status && extra.status !== "all" ? extra.status : undefined,
    gender: extra?.gender && extra.gender !== "all" ? extra.gender : undefined,
    struktur: true,
  };
}
