# Admin Design System Specification
## DPD NasDem Sidoarjo - Complete Styling Guide

**Version:** 2.0  
**Last Updated:** October 6, 2025  
**Branch:** redesign-admin  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [Chart Styling](#chart-styling)
7. [UI Patterns](#ui-patterns)
8. [Critical Rules](#critical-rules)
9. [Implementation Examples](#implementation-examples)
10. [Migration Checklist](#migration-checklist)

---

## 🎨 Design Philosophy

### Core Principles
1. **Clean & Minimal** - No gradients, flat design with subtle borders only
2. **Blue Palette Only** - Use #001B55 (NasDem Blue) with opacity variations, NO orange/yellow (#FF9C04)
3. **White Backgrounds** - All cards, modals, sections use pure white (#FFFFFF)
4. **Subtle Borders** - Border colors use blue with low opacity (10%, 20%, 30%)
5. **Consistent Spacing** - Follow 4px grid system (4, 8, 12, 16, 20, 24, 32)

### Design Keywords
- Futuristic, Clean, Professional, Minimal
- Corporate, Data-driven, Modern
- Accessible, Readable, Scannable

---

## 🎨 Color System

### Primary Colors (USE THESE)
```css
/* Primary Blue - Main brand color */
#001B55 - NasDem Blue (headers, primary text, borders, accents)

/* Neutral Gray Scale */
#FFFFFF - White (backgrounds, cards, surfaces)
#F0F0F0 - Light Gray (subtle backgrounds, disabled states)
#6B7280 - Medium Gray (secondary text, labels)
#111827 - Near Black (rare use, only for extreme emphasis)

/* Opacity Variations of #001B55 */
#001B55/10 - 10% opacity (very subtle borders, backgrounds)
#001B55/20 - 20% opacity (standard borders)
#001B55/30 - 30% opacity (hover states)
#001B55/40 - 40% opacity (active states)
#001B55/60 - 60% opacity (disabled text)
```

### Deprecated Colors (DO NOT USE)
```css
/* BANNED - Remove these from all admin pages */
#FF9C04 - Orange (brand accent - NOT for admin)
#FFB04A - Light Orange
#FFA500 - Golkar Orange
#DC2626 - Red (except for danger/delete actions)
#16A34A - Green (except for success states)

/* BANNED - No gradients allowed */
bg-gradient-to-* (all gradient utilities)
from-* to-* via-* (gradient color stops)
```

### Semantic Colors (Limited Use)
```css
/* Success State ONLY */
#16A34A - Green (success messages, confirmed states)

/* Danger State ONLY */
#C81E1E - Red (delete buttons, error states, warnings)

/* Info/Status (Rare) */
#3B82F6 - Blue (informational badges, rare use)
```

---

## 📝 Typography

### Font Family
```css
font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
```

### Text Colors
```css
/* Primary Text */
text-[#001B55] - Headings, important text, active items

/* Secondary Text */
text-[#6B7280] - Body text, descriptions, labels, placeholders

/* Tertiary Text (Rare) */
text-[#9CA3AF] - Timestamps, metadata, very subtle text
```

### Font Sizes (Tailwind Custom)
```javascript
'xs':   ['0.75rem',  { lineHeight: '1rem' }],     // 12px - Small labels, badges
'sm':   ['0.875rem', { lineHeight: '1.25rem' }],  // 14px - Body text, descriptions
'md':   ['1rem',     { lineHeight: '1.5rem' }],   // 16px - Default body
'lg':   ['1.125rem', { lineHeight: '1.75rem' }],  // 18px - Subheadings
'xl':   ['1.5rem',   { lineHeight: '2rem' }],     // 24px - Page titles
'xxl':  ['2rem',     { lineHeight: '2.5rem' }],   // 32px - Hero headings
'num':  ['2.125rem', { lineHeight: '2.5rem' }],   // 34px - Large numbers/stats
```

### Font Weights
```javascript
'regular':  400  // Body text
'medium':   500  // Labels, subtle emphasis
'semibold': 600  // Subheadings, buttons
'bold':     700  // Main headings, emphasis
```

### Typography Examples
```tsx
// Page Title
<h1 className="text-xl font-bold text-[#001B55]">Dashboard Admin</h1>

// Section Heading
<h2 className="text-lg font-semibold text-[#001B55]">Statistik Pemilu</h2>

// Body Text
<p className="text-sm text-[#6B7280]">Deskripsi atau informasi tambahan</p>

// Label
<label className="text-xs font-medium text-[#6B7280] uppercase">Filter</label>

// Timestamp
<span className="text-xs text-[#9CA3AF]">Updated: 12:30 PM</span>
```

---

## 📐 Spacing & Layout

### Spacing Scale (4px Grid)
```javascript
'4':  '0.25rem',  // 4px  - Tight spacing, icon gaps
'8':  '0.5rem',   // 8px  - Small gaps, button padding
'12': '0.75rem',  // 12px - Medium gaps
'16': '1rem',     // 16px - Standard gaps, card padding
'20': '1.25rem',  // 20px - Section spacing
'24': '1.5rem',   // 24px - Large padding
'32': '2rem',     // 32px - Section dividers
```

### Border Radius
```javascript
'sm':  '0.5rem',   // 8px  - Small elements, badges
'md':  '0.75rem',  // 12px - Buttons, inputs
'lg':  '1rem',     // 16px - Cards (rare)
'xl':  '1.25rem',  // 20px - Large cards (standard)
'2xl': '1.5rem',   // 24px - Hero sections (rare)
```

### Shadows (Subtle Only)
```javascript
'sm': '0 1px 2px rgba(0,0,0,0.06)',   // Subtle lift
'md': '0 4px 16px rgba(0,0,0,0.06)',  // Card hover
'lg': '0 8px 24px rgba(0,0,0,0.08)',  // Modal/Dialog
'xl': '0 12px 32px rgba(0,0,0,0.1)',  // Popover (rare)
```

### Container
```javascript
'container': '1200px'  // Max width for content
```

---

## 🧩 Component Library

### PageHeader Component
**Location:** `app/admin/components/ui/PageHeader.tsx`

**Props Interface:**
```typescript
interface PageHeaderProps {
  icon?: ReactNode;        // Pass <Icon className="..." /> NOT Icon component
  title: string;
  description?: string;
  actions?: ReactNode;
}
```

**Usage:**
```tsx
import { PageHeader } from "../components/ui";
import { Newspaper } from "lucide-react";

<PageHeader
  icon={<Newspaper className="w-6 h-6 text-[#001B55]" />}
  title="Manajemen Berita"
  description="Kelola semua berita dan artikel"
  actions={
    <ActionButton
      onClick={handleCreate}
      icon={<Plus className="w-4 h-4" />}
    >
      Tambah Berita
    </ActionButton>
  }
/>
```

**Styling:**
```tsx
// Container
className="bg-white rounded-xl border border-[#001B55]/20 p-6 shadow-sm"

// Icon wrapper
className="flex items-center justify-center w-12 h-12 rounded-xl border border-[#001B55]/20 bg-white"

// Title
className="text-xl font-bold text-[#001B55]"

// Description
className="text-sm text-[#6B7280] mt-1"
```

---

### ContentCard Component
**Location:** `app/admin/components/ui/ContentCard.tsx`

**Props Interface:**
```typescript
interface ContentCardProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}
```

**Usage:**
```tsx
import { ContentCard } from "../components/ui";

<ContentCard
  title="Data Berita"
  description="Daftar semua berita yang tersedia"
>
  {/* Table or content here */}
</ContentCard>
```

**Styling:**
```tsx
// Container
className="bg-white rounded-xl border border-[#001B55]/10 p-6 shadow-sm"

// Header (if present)
className="mb-4 pb-4 border-b border-[#001B55]/10"

// Title
className="text-lg font-semibold text-[#001B55]"

// Description
className="text-sm text-[#6B7280] mt-1"
```

---

### ActionButton Component
**Location:** `app/admin/components/ui/ActionButton.tsx`

**Props Interface:**
```typescript
interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;        // Pass <Icon /> NOT Icon component
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
}
```

**Variants:**
```tsx
// Primary (Blue)
className="bg-[#001B55] text-white hover:bg-[#001B55]/90 
           border border-[#001B55] shadow-sm"

// Secondary (Gray)
className="bg-[#F0F0F0] text-[#001B55] hover:bg-[#001B55]/10 
           border border-[#001B55]/20"

// Outline (Border only)
className="bg-white text-[#001B55] hover:bg-[#001B55]/5 
           border border-[#001B55]/30"

// Ghost (No border)
className="bg-transparent text-[#001B55] hover:bg-[#001B55]/5"
```

**Usage:**
```tsx
import { ActionButton } from "../components/ui";
import { Plus } from "lucide-react";

<ActionButton
  variant="primary"
  onClick={handleClick}
  icon={<Plus className="w-4 h-4" />}
>
  Tambah Data
</ActionButton>
```

---

### ModernSidebar Component
**Location:** `app/admin/components/layout/ModernSidebar.tsx`

**Key Styling Rules:**
```tsx
// Container
className="h-screen w-64 bg-white border-r border-[#001B55]/20"

// Logo Section
className="p-6 border-b border-[#001B55]/20"

// Navigation Item (Inactive)
className="flex items-center gap-3 px-4 py-3 text-[#6B7280] 
           hover:bg-[#001B55]/5 hover:text-[#001B55] 
           rounded-lg transition-all duration-200"

// Navigation Item (Active)
className="flex items-center gap-3 px-4 py-3 
           bg-[#001B55]/10 text-[#001B55] border-l-4 border-[#001B55] 
           rounded-lg font-semibold"

// Icon
className="w-5 h-5"

// Badge/Counter
className="ml-auto px-2 py-1 text-xs font-semibold 
           bg-[#001B55]/10 text-[#001B55] rounded-full"

// Status Indicator
className="w-2 h-2 bg-[#16A34A] rounded-full"
```

---

## 📊 Chart Styling

### BarChart (Recharts) Configuration

**Stacked Bar Chart (Dashboard Style):**
```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

<BarChart
  data={data}
  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
  barCategoryGap="20%"
>
  <CartesianGrid
    strokeDasharray="3 3"
    vertical={false}
    stroke="#E5E7EB"
  />
  <XAxis
    dataKey="month"
    fontSize={12}
    stroke="#6B7280"
    tickLine={false}
    axisLine={false}
  />
  <YAxis
    fontSize={12}
    stroke="#6B7280"
    tickLine={false}
    axisLine={false}
  />
  <Tooltip
    cursor={{ fill: "#F9FAFB" }}
    content={<CustomTooltip />}
  />
  <Legend
    wrapperStyle={{ fontSize: "12px" }}
    iconType="circle"
    iconSize={8}
  />
  <Bar
    dataKey="value"
    fill="#001B55"
    radius={[8, 8, 0, 0]}
    maxBarSize={40}
  />
</BarChart>
```

**Horizontal Bar Chart (Ranking Style):**
```tsx
<BarChart
  data={data}
  layout="vertical"
  barCategoryGap="20%"
  margin={{ top: 5, right: 48, bottom: 5, left: 0 }}
>
  <CartesianGrid 
    horizontal={false}
    stroke="#E5E7EB"
    strokeDasharray="3 3"
  />
  <XAxis
    type="number"
    fontSize={12}
    stroke="#6B7280"
    tickLine={false}
    axisLine={false}
  />
  <YAxis
    dataKey="name"
    type="category"
    fontSize={12}
    stroke="#6B7280"
    tickLine={false}
    axisLine={false}
    width={220}
  />
  <Tooltip
    cursor={{ fill: "#F9FAFB" }}
    content={<CustomTooltip />}
  />
  <Bar
    dataKey="value"
    radius={[0, 8, 8, 0]}
    maxBarSize={40}
  >
    {data.map((item) => (
      <Cell key={item.id} fill={item.color || "#001B55"} />
    ))}
    <LabelList
      dataKey="label"
      position="right"
      offset={8}
      fill="#6B7280"
      fontSize={12}
    />
  </Bar>
</BarChart>
```

### Chart Colors (Data Visualization)
```javascript
// Use these colors for different data series in charts
const chartColors = {
  primary:   "#001B55",  // NasDem Blue
  berita:    "#C3A46B",  // Gold/Tan
  galeri:    "#E7B7A5",  // Peach
  organisasi:"#6EC4B3",  // Teal
  program:   "#B7B7F0",  // Lavender
};
```

### Tooltip Styling
```tsx
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  
  return (
    <div className="rounded-xl border border-[#001B55]/20 bg-white px-4 py-3 shadow-sm">
      <p className="text-sm font-semibold text-[#001B55] mb-2">
        {label}
      </p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-xs text-[#6B7280]">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.name}:</span>
          <span className="font-semibold text-[#001B55]">
            {entry.value.toLocaleString('id-ID')}
          </span>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 UI Patterns

### Table Styling
```tsx
// Table Container
<div className="overflow-x-auto rounded-xl border border-[#001B55]/10">
  <table className="w-full">
    {/* Header */}
    <thead className="bg-[#F0F0F0] border-b border-[#001B55]/10">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-semibold text-[#001B55] uppercase tracking-wide">
          Nama
        </th>
      </tr>
    </thead>
    
    {/* Body */}
    <tbody className="divide-y divide-[#001B55]/10">
      <tr className="hover:bg-[#001B55]/5 transition-colors">
        <td className="px-4 py-3 text-sm text-[#6B7280]">
          Data
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Form Input Styling
```tsx
// Text Input
<input
  type="text"
  className="w-full px-4 py-2 border border-[#001B55]/20 rounded-lg
             bg-white text-[#001B55] placeholder-[#6B7280]
             focus:border-[#001B55] focus:outline-none focus:ring-2 focus:ring-[#001B55]/20
             transition-all duration-200"
  placeholder="Masukkan teks..."
/>

// Select Dropdown (Shadcn)
<Select>
  <SelectTrigger className="h-10 bg-white border border-[#001B55]/20 
                           text-[#001B55] hover:border-[#001B55]/30 
                           focus:border-[#001B55] transition-colors">
    <SelectValue placeholder="Pilih opsi" />
  </SelectTrigger>
  <SelectContent className="bg-white border border-[#001B55]/20">
    <SelectItem value="1" className="hover:bg-[#F0F0F0] text-[#001B55]">
      Opsi 1
    </SelectItem>
  </SelectContent>
</Select>
```

### Badge Styling
```tsx
// Info Badge (Blue)
<Badge className="px-3 py-1 bg-[#001B55] text-white text-xs font-semibold rounded-full">
  Active
</Badge>

// Success Badge
<Badge className="px-3 py-1 bg-[#16A34A] text-white text-xs font-semibold rounded-full">
  Success
</Badge>

// Neutral Badge
<Badge className="px-3 py-1 bg-[#F0F0F0] text-[#6B7280] text-xs font-semibold rounded-full border border-[#001B55]/20">
  Pending
</Badge>
```

### Modal/Dialog Styling
```tsx
<Dialog>
  <DialogContent className="bg-white rounded-xl border border-[#001B55]/20 shadow-lg max-w-2xl">
    {/* Header */}
    <DialogHeader className="border-b border-[#001B55]/10 pb-4">
      <DialogTitle className="text-xl font-bold text-[#001B55]">
        Tambah Data Baru
      </DialogTitle>
      <DialogDescription className="text-sm text-[#6B7280] mt-1">
        Lengkapi form di bawah untuk menambahkan data
      </DialogDescription>
    </DialogHeader>
    
    {/* Content */}
    <div className="py-4">
      {/* Form fields here */}
    </div>
    
    {/* Footer */}
    <DialogFooter className="border-t border-[#001B55]/10 pt-4">
      <Button variant="outline">Batal</Button>
      <Button variant="primary">Simpan</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## ⚠️ Critical Rules

### 1. Icon Passing Rule (CRITICAL!)
**❌ WRONG - Will cause React hydration error:**
```tsx
import { Newspaper } from "lucide-react";

<PageHeader icon={Newspaper} />  // WRONG! Passing component class
```

**✅ CORRECT:**
```tsx
import { Newspaper } from "lucide-react";

<PageHeader 
  icon={<Newspaper className="w-6 h-6 text-[#001B55]" />}  // CORRECT! Passing JSX element
/>
```

**Reason:** Client Components cannot receive non-serializable props (functions, classes). Always pass pre-rendered JSX elements.

---

### 2. Color Usage Rules
**✅ ALWAYS USE:**
- `#001B55` - Primary blue for everything
- `#FFFFFF` - White backgrounds
- `#F0F0F0` - Subtle backgrounds
- `#6B7280` - Secondary text
- Opacity variations: `/10`, `/20`, `/30`, `/40`, `/60`

**❌ NEVER USE in Admin:**
- `#FF9C04` - Orange (brand accent, public site only)
- `bg-gradient-*` - No gradients allowed
- `from-*`, `to-*`, `via-*` - No gradient utilities
- Multiple bright colors mixing (rainbow effects)

---

### 3. Border Guidelines
**Standard borders:**
```tsx
border border-[#001B55]/10  // Very subtle (cards, containers)
border border-[#001B55]/20  // Standard (inputs, buttons)
border border-[#001B55]/30  // Emphasized (active states)
```

**NO filled backgrounds with borders:**
```tsx
❌ bg-blue-500 border border-blue-600  // WRONG
✅ bg-white border border-[#001B55]/20  // CORRECT
```

---

### 4. Spacing Consistency
Always use the 4px grid:
```tsx
gap-4   // 16px
p-6     // 24px
mt-4    // 16px
space-y-4  // 16px vertical
```

**Avoid arbitrary values:**
```tsx
❌ p-[13px]     // WRONG
✅ p-3          // CORRECT (12px)
```

---

### 5. Responsive Design
Always test on:
- Mobile: 375px - 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

Use Tailwind breakpoints:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## 📖 Implementation Examples

### Complete Page Example
```tsx
"use client";

import { useState } from "react";
import { Newspaper, Plus, Search } from "lucide-react";
import { PageHeader, ContentCard, ActionButton } from "../components/ui";
import { AdminLayout } from "../components/layout/AdminLayout";

export default function NewsPage() {
  const breadcrumbs = [
    { label: "Dashboard", href: "/admin" },
    { label: "Berita" }
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        {/* Header */}
        <PageHeader
          icon={<Newspaper className="w-6 h-6 text-[#001B55]" />}
          title="Manajemen Berita"
          description="Kelola semua berita dan artikel"
          actions={
            <ActionButton
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => router.push("/admin/news/create")}
            >
              Tambah Berita
            </ActionButton>
          }
        />

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#001B55]/10 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Cari berita..."
                className="w-full pl-10 pr-4 py-2 border border-[#001B55]/20 rounded-lg
                           bg-white text-[#001B55] placeholder-[#6B7280]
                           focus:border-[#001B55] focus:outline-none focus:ring-2 focus:ring-[#001B55]/20"
              />
            </div>
            <Select>
              <SelectTrigger className="w-48 h-10 bg-white border border-[#001B55]/20">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="politik">Politik</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <ContentCard
          title="Daftar Berita"
          description="Total 24 berita tersedia"
        >
          <NewsTable data={data} />
        </ContentCard>
      </div>
    </AdminLayout>
  );
}
```

---

## ✅ Migration Checklist

When updating any admin page to new design system:

### Phase 1: Color Cleanup
- [ ] Remove ALL `#FF9C04` (orange) references
- [ ] Remove ALL gradient utilities (`bg-gradient-*`)
- [ ] Replace with `#001B55` and opacity variations
- [ ] Change text colors to `text-[#001B55]` or `text-[#6B7280]`
- [ ] Update borders to `border-[#001B55]/10` or `/20`

### Phase 2: Component Migration
- [ ] Replace custom headers with `<PageHeader />`
- [ ] Wrap content sections in `<ContentCard />`
- [ ] Replace buttons with `<ActionButton />`
- [ ] Update icon passing (use JSX elements, not component classes)

### Phase 3: Layout & Spacing
- [ ] Ensure consistent spacing using 4px grid
- [ ] Update border radius to standard values (xl, 2xl)
- [ ] Apply shadow-sm consistently
- [ ] Check responsive breakpoints

### Phase 4: Charts & Data
- [ ] Update chart colors to match specification
- [ ] Apply standard chart margins and styling
- [ ] Update tooltip styling
- [ ] Ensure axis colors are `#6B7280`

### Phase 5: Testing
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1440px)
- [ ] Check for hydration errors
- [ ] Verify no console warnings

---

## 🔄 Quick Reference

### Common Class Combinations

**Page Container:**
```tsx
className="max-w-7xl mx-auto space-y-6 p-6"
```

**Card:**
```tsx
className="bg-white rounded-xl border border-[#001B55]/10 p-6 shadow-sm"
```

**Primary Button:**
```tsx
className="px-4 py-2 bg-[#001B55] text-white rounded-lg border border-[#001B55] 
           hover:bg-[#001B55]/90 font-semibold shadow-sm transition-all"
```

**Input:**
```tsx
className="w-full px-4 py-2 border border-[#001B55]/20 rounded-lg bg-white 
           text-[#001B55] focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20"
```

**Table Header:**
```tsx
className="bg-[#F0F0F0] border-b border-[#001B55]/10"
```

**Table Row:**
```tsx
className="hover:bg-[#001B55]/5 transition-colors"
```

---

## 📚 File Structure Reference

```
app/admin/
├── components/
│   ├── ui/
│   │   ├── PageHeader.tsx       # Reusable page header
│   │   ├── ContentCard.tsx      # Content container
│   │   ├── ActionButton.tsx     # Button with variants
│   │   └── index.ts             # Barrel exports
│   ├── layout/
│   │   ├── ModernSidebar.tsx    # Navigation sidebar
│   │   ├── TopNavbar.tsx        # Top navigation
│   │   └── AdminLayout.tsx      # Main layout wrapper
│   ├── news/
│   │   └── NewsTable.tsx        # News data table
│   ├── statistik/
│   │   ├── StatistikChartsSection.tsx   # Chart components
│   │   ├── StatistikKPICards.tsx        # KPI cards
│   │   └── StatistikDataTable.tsx       # Data table
│   └── dashboard/
│       ├── kpi-stat.tsx         # KPI statistics
│       ├── chart-card.tsx       # Chart wrapper
│       └── stacked-bar-chart.tsx # Bar chart
├── page.tsx                     # Dashboard (✅ Updated)
├── news/page.tsx               # News list (✅ Updated)
├── user/page.tsx               # User management (✅ Updated)
├── gallery/page.tsx            # Gallery (⏳ Pending)
├── organizations/page.tsx      # Organizations (⏳ Pending)
├── statistik-pemilu/page.tsx   # Election stats (✅ Updated)
└── DESIGN_SYSTEM.md            # This file
```

---

## 🎓 Learning Resources

### For AI Assistants
When asked to update admin pages:

1. **Read this spec first** - Understand color system and rules
2. **Use component library** - Don't create custom components
3. **Follow patterns** - Match existing updated pages (news, user, dashboard)
4. **Check examples** - Refer to implementation examples above
5. **Test thoroughly** - Verify no gradients, correct colors, proper icons

### Key Commands
```bash
# Start dev server
pnpm run dev

# Check for errors
pnpm run lint

# Build for production
pnpm run build
```

---

## 📞 Contact & Support

**Project:** DPD NasDem Sidoarjo Website v2.0  
**Repository:** Nasdem_Web_V2.0  
**Branch:** redesign-admin  
**Design System Version:** 2.0

---

**Last Updated:** October 6, 2025  
**Status:** ✅ Production Ready  
**Maintained By:** Development Team

---

*This specification is the single source of truth for admin styling. All admin pages must follow these guidelines without exception.*
