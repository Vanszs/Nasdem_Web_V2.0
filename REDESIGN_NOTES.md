# Admin UI/UX Redesign - Branch `redesign-admin`

## 📋 Overview

Branch ini berisi redesign lengkap untuk Admin Dashboard dengan fokus pada:
- ✨ Clean & Modern UI/UX
- ♿ Accessibility (WCAG 2.1 compliant)
- 🎨 Consistent Design System
- 📱 Fully Responsive
- ⚡ Performance Optimized

## 🎯 Design System

Redesign ini menggunakan design system berdasarkan **UI Handoff JSON Specification** yang diadaptasi untuk brand NasDem Sidoarjo.

### Color Tokens

```typescript
Brand Colors:
- Primary: #001B55 (Navy Blue)
- Accent: #FF9C04 (Orange)
- Success: #53C22B (Green)
- Danger: #C81E1E (Red)

Background:
- bg: #F7F7F8 (Light gray)
- card: #FFFFFF (White)
- muted: #F1F3F5 (Light muted)

Text:
- primary: #111827 (Dark gray)
- secondary: #4B5563 (Medium gray)
- tertiary: #6B7280 (Light gray)

Content Accents:
- berita: #C3A46B (Gold)
- galeri: #E7B7A5 (Peach)
- organisasi: #6EC4B3 (Teal)
- statistik: #B7B7F0 (Lavender)
```

### Typography

```typescript
Font Family: Inter, ui-sans-serif, system-ui
Sizes: xs(12px), sm(14px), md(16px), lg(18px), xl(24px), xxl(32px), num(34px)
Weights: regular(400), medium(500), semibold(600), bold(700)
```

### Spacing & Radius

```typescript
Space: [4, 8, 12, 16, 20, 24, 32]px
Radius: sm(8px), md(12px), lg(16px), xl(20px)
```

## 📦 New Components

### 1. **KPIStat Component**
Location: `components/dashboard/kpi-stat.tsx`

Komponen untuk menampilkan statistik dengan:
- ✅ Proper accessibility (role="status", aria-label)
- 📊 Support currency, number, text formatting
- 📈 Delta indicators (up/down dengan tooltip)
- 🎨 Icon support
- 💀 Skeleton loader

**Usage:**
```tsx
<KPIStat
  label="Total Konten"
  value={512}
  format={{ type: "number" }}
  icon={FileText}
  delta={{ value: 8.2, direction: "up", tooltip: "Naik 8.2%" }}
/>
```

### 2. **ChartCard Component**
Location: `components/dashboard/chart-card.tsx`

Wrapper untuk charts dengan:
- 📊 Title & subtitle
- 🎨 Consistent card styling
- ♿ Accessible (role="group", aria-label)
- 💀 Skeleton loader

**Usage:**
```tsx
<ChartCard title="Statistik Konten" subtitle="6 bulan terakhir">
  <YourChartComponent />
</ChartCard>
```

### 3. **DataTable Component**
Location: `components/dashboard/data-table.tsx`

Advanced data table dengan:
- 📄 Pagination support
- 🔄 Loading states
- ❌ Error handling
- 📭 Empty states
- 📌 Sticky header
- 💱 Currency/number formatting per column
- 🎨 Hover effects
- ♿ Accessible

**Usage:**
```tsx
<DataTable
  columns={[
    { key: "month", label: "Bulan", width: 120 },
    { key: "total", label: "Total", align: "right", format: "number" }
  ]}
  data={monthlyData}
  rowKey="month"
  pagination={{ pageSize: 10 }}
  loading={isLoading}
  emptyState={{ title: "Belum ada data" }}
/>
```

## 🔧 Design System Utilities

Location: `lib/design-system.ts`

### Formatters
```typescript
formatCurrency(1000000, "IDR") // Rp1.000.000
formatNumber(1234567) // 1.234.567
formatDate(new Date()) // 5 Oktober 2025
formatPercentage(8.5) // 8.5%
```

### Design Tokens
```typescript
import { designTokens, layoutConfig } from "@/lib/design-system";
```

## 🎨 Updated Components

### ModernSidebar (Enhanced)

**New Features:**
- ♿ Full ARIA labels & roles
- ⌨️ Keyboard navigation (Arrow Up/Down)
- 🎯 Focus indicators
- 📱 Better tooltips
- 🔊 Screen reader support

**Accessibility Improvements:**
```tsx
// ARIA attributes
aria-label="Navigasi utama admin"
aria-expanded={isExpanded}
aria-controls="submenu-id"
aria-current="page"
role="navigation"
role="list"
role="listitem"

// Keyboard support
onKeyDown={handleArrowNavigation}

// Focus management
focus:ring-2 focus:ring-brand-accent
```

### Admin Dashboard Page (Redesigned)

**New Layout:**
- 📊 KPI Grid (1/2/4 columns responsive)
- 📈 Charts Row (1/2 columns responsive)
- 📋 Data Table with pagination
- ⚡ Quick Actions cards

**Features:**
- Clean & minimal design
- Consistent spacing
- Loading states everywhere
- Responsive grid system
- Hover effects

## 📱 Responsive Breakpoints

```typescript
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

## 🚀 Installation & Usage

### 1. Install Dependencies (if needed)

```bash
npm install recharts  # For charts (optional)
npm install @tailwindcss/typography  # Already in config
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. View Changes

Navigate to: `http://localhost:3000/admin`

## 📊 Performance

- ⚡ Bundle size optimized
- 🎨 CSS-first approach (minimal JS)
- 💀 Skeleton loaders untuk perceived performance
- 📦 Lazy load ready

## ♿ Accessibility Features

### WCAG 2.1 Compliance
- ✅ Color contrast min 4.5:1
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ ARIA labels & roles
- ✅ Screen reader support
- ✅ Semantic HTML

### Keyboard Support
- `Tab` - Navigate forward
- `Shift + Tab` - Navigate backward
- `Arrow Down` - Next menu item
- `Arrow Up` - Previous menu item
- `Enter` - Activate link/button
- `Space` - Toggle dropdown

## 🧪 Testing

### Test IDs Available
```typescript
testIds: {
  kpi_year_total: "kpi-year-total",
  chart_dept: "chart-dept",
  chart_trend: "chart-trend",
  table_costs: "table-costs"
}
```

## 📝 File Structure

```
lib/
├── design-system.ts          # Design tokens & utilities

components/
└── dashboard/
    ├── kpi-stat.tsx          # KPI card component
    ├── chart-card.tsx        # Chart wrapper
    └── data-table.tsx        # Enhanced table

app/admin/
├── page.tsx                  # Redesigned dashboard
├── page-old.tsx             # Backup of old version
└── components/layout/
    ├── ModernSidebar.tsx    # Enhanced sidebar
    └── ModernSidebar-old.tsx # Backup
```

## 🎯 Next Steps (Optional Enhancements)

1. **Charts Integration**
   - Install recharts
   - Create StackedBarChart component
   - Create MultiLineChart component

2. **Real Data Integration**
   - Connect to actual APIs
   - Implement React Query for data fetching
   - Add real-time updates

3. **Dark Mode**
   - Implement theme switcher
   - Use darkModeTokens from design-system.ts

4. **Analytics**
   - Add event tracking
   - Implement analytics events

5. **i18n**
   - Multi-language support
   - Translation keys

## 🐛 Known Issues

- Charts are placeholders (need recharts installation)
- Data is currently mock/sample data
- Dark mode not yet implemented

## 📖 Documentation

For detailed component documentation, check:
- [Design System Guide](./lib/design-system.ts)
- [KPI Stat Props](./components/dashboard/kpi-stat.tsx)
- [Data Table Props](./components/dashboard/data-table.tsx)

## 🤝 Contributing

When making changes:
1. Follow the design system tokens
2. Maintain accessibility standards
3. Add proper TypeScript types
4. Include skeleton loaders for async content
5. Test keyboard navigation

## 📄 License

Internal project - DPD NasDem Sidoarjo

---

**Created on:** October 5, 2025  
**Branch:** redesign-admin  
**Status:** Ready for review ✅
