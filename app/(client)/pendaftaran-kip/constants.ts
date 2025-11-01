// LocalStorage keys
export const DRAFT_STORAGE_KEY = "kip_registration_draft";
export const DRAFT_TIMESTAMP_KEY = "kip_registration_draft_timestamp";

// Form steps
export const TOTAL_STEPS = 4;

export const STEP_LABELS = {
  1: "Data Mahasiswa",
  2: "Data Universitas",
  3: "Data Orang Tua",
  4: "Data Pengusul",
};

export const STEP_DESCRIPTIONS = {
  1: "Lengkapi informasi pribadi mahasiswa dengan benar",
  2: "Informasi universitas dan program studi",
  3: "Data orang tua/wali mahasiswa dan kesediaan bergabung",
  4: "Informasi pengusul dan hubungan dengan mahasiswa",
};

// University status options
export const UNIVERSITY_STATUS_OPTIONS = [
  { value: "negeri", label: "Negeri" },
  { value: "swasta", label: "Swasta" },
] as const;

// Proposer status options
export const PROPOSER_STATUS_OPTIONS = [
  { value: "korcam", label: "Korcam" },
  { value: "korkel_kordes", label: "Korkel/Kordes" },
  { value: "kortps", label: "Kor TPS" },
  { value: "partai", label: "Partai" },
  { value: "relawan", label: "Relawan" },
  { value: "lainnya", label: "Lainnya" },
] as const;

// Proposer relation options
export const PROPOSER_RELATION_OPTIONS = [
  { value: "anak", label: "Anak" },
  { value: "saudara", label: "Saudara" },
  { value: "kerabat", label: "Kerabat" },
  { value: "tetangga", label: "Tetangga" },
  { value: "lainnya", label: "Lainnya" },
] as const;
