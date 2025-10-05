/**
 * Design System Configuration
 * Based on UI handoff specification with NasDem brand colors
 */

export const designTokens = {
  color: {
    bg: "#F7F7F8",
    card: "#FFFFFF",
    muted: "#F1F3F5",
    text: {
      primary: "#111827",
      secondary: "#4B5563",
      tertiary: "#6B7280",
    },
    border: "#E5E7EB",
    accent: {
      // Content categories
      berita: "#C3A46B",
      galeri: "#E7B7A5",
      organisasi: "#6EC4B3",
      statistik: "#B7B7F0",
    },
    // NasDem Brand Colors
    brand: {
      primary: "#001B55", // Navy Blue
      accent: "#FF9C04", // Orange
      success: "#53C22B", // Green
      danger: "#C81E1E", // Red
    },
  },
  radius: {
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.25rem", // 20px
  },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.06)",
    md: "0 4px 16px rgba(0,0,0,0.06)",
    lg: "0 8px 24px rgba(0,0,0,0.08)",
    xl: "0 12px 32px rgba(0,0,0,0.1)",
  },
  space: [0, 4, 8, 12, 16, 20, 24, 32],
  typography: {
    family: ["Inter", "ui-sans-serif", "system-ui"],
    sizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      md: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.5rem", // 24px
      xxl: "2rem", // 32px
      num: "2.125rem", // 34px - for large numbers
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
} as const;

export const layoutConfig = {
  container: {
    maxWidth: 1200,
    paddingX: 24,
    paddingY: 24,
  },
  grid: {
    kpis: {
      columns: { default: 1, md: 3 },
      gap: 16,
    },
    charts: {
      columns: { default: 1, lg: 2 },
      gap: 16,
    },
    table: {
      marginTop: 24,
    },
  },
} as const;

// Theme for dark mode (future enhancement)
export const darkModeTokens = {
  bg: "#0B0F17",
  card: "#0F1623",
  text: {
    primary: "#E5E7EB",
    secondary: "#9CA3AF",
  },
  border: "#1F2937",
} as const;

// Accessibility standards
export const a11yConfig = {
  contrastMin: 4.5,
  keyboardNavigation: true,
  focusVisible: true,
} as const;

// Currency formatter utility
export function formatCurrency(
  value: number,
  currency: "USD" | "IDR" = "IDR",
  locale: string = "id-ID"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Number formatter utility
export function formatNumber(
  value: number,
  locale: string = "id-ID"
): string {
  return new Intl.NumberFormat(locale).format(value);
}

// Date formatter utility
export function formatDate(
  date: Date | string,
  locale: string = "id-ID"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

// Percentage formatter utility
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}
