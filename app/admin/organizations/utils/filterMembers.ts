import { Member } from "../types";

// Sumber tunggal util filter

export type ActiveTab = "dpd" | "sayap" | "dpc" | "dprt";

export interface DpdFilters {
  searchTerm: string;
  // Optional untuk kompatibilitas lama (jika ada kode lama mengakses)
  departmentFilter?: string;
}

export interface SayapFilters {
  searchTerm: string;
  departmentFilter: string; // all | nama sayap
}

export interface DpcFilters {
  searchTerm: string;
  regionFilter: string; // all | regionId
}

export interface DprtFilters {
  searchTerm: string;
  regionFilter: string; // kecamatan
  subRegionFilter: string; // desa
  departmentFilter: string; // all | dprt | kader
}

// Default states
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
      if (dpc.regionFilter !== "all") regionId = Number(dpc.regionFilter);
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

export function buildMemberQueryParams(
  tab: ActiveTab,
  filters: {
    dpd: DpdFilters;
    sayap: SayapFilters;
    dpc: DpcFilters;
    dprt: DprtFilters;
  },
  extra?: { status?: string; gender?: string }
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

export function filterMembers(
  members: Member[],
  activeTab: ActiveTab,
  dpd: DpdFilters,
  sayap: SayapFilters,
  dpc: DpcFilters,
  dprt: DprtFilters
) {
  const current =
    activeTab === "dpd"
      ? dpd
      : activeTab === "sayap"
      ? sayap
      : activeTab === "dpc"
      ? dpc
      : dprt;

  return members.filter((member) => {
    const search = current.searchTerm?.toLowerCase?.() || "";
    const matchesSearch =
      member.name.toLowerCase().includes(search) ||
      member.position.toLowerCase().includes(search);

    let matchesTab = false;
    if (activeTab === "dpd") matchesTab = member.department === "dpd";
    if (activeTab === "sayap") matchesTab = member.department === "sayap";
    if (activeTab === "dpc") matchesTab = member.department === "dpc";
    if (activeTab === "dprt") matchesTab = member.department === "dprt";

    const matchesDepartment =
      !("departmentFilter" in current) ||
      current.departmentFilter === "all" ||
      (activeTab === "sayap"
        ? member.subDepartment === current.departmentFilter
        : member.department === current.departmentFilter);

    const matchesRegion =
      !("regionFilter" in current) ||
      current.regionFilter === "all" ||
      member.region === current.regionFilter ||
      (!member.region && current.regionFilter === "all");

    const matchesSubRegion =
      !("subRegionFilter" in current) ||
      current.subRegionFilter === "all" ||
      member.subDepartment === current.subRegionFilter ||
      (!member.subDepartment && current.subRegionFilter === "all");

    return (
      matchesSearch &&
      matchesTab &&
      matchesDepartment &&
      matchesRegion &&
      matchesSubRegion
    );
  });
}
