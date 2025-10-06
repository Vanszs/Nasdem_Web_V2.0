# Admin Design System - NasDem Sidoarjo

## Color Palette

### Primary Colors
- **Blue NasDem**: `#001B55` - Primary brand color
- **White**: `#FFFFFF` - Background utama
- **Gray**: `#6B7280`, `#F0F0F0` - Text dan background secondary

### Opacity Variations (Blue Only)
- Border tipis: `/10`, `/20`
- Border medium: `/30`, `/40`
- Text subtle: `/60`
- Hover background: `/5`

### ❌ Warna yang TIDAK Digunakan
- **NO Orange/Yellow** `#FF9C04` - Tidak digunakan sama sekali
- **NO Gradients** - Tidak ada gradient backgrounds
- **NO Filled Colors** - Hanya border dan text

## Komponen Reusable

### 1. PageHeader
```tsx
import { PageHeader } from "../components/ui/PageHeader";
import { IconName } from "lucide-react";

<PageHeader
  icon={<IconName className="w-6 h-6 text-[#001B55]" />}
  title="Judul Halaman"
  description="Deskripsi halaman"
  action={
    <ActionButton icon={<Plus className="w-4 h-4" />} variant="primary">
      Action Text
    </ActionButton>
  }
/>
```

### 2. ContentCard
```tsx
import { ContentCard } from "../components/ui/ContentCard";

<ContentCard
  title="Card Title"
  description="Card description"
  icon={<Icon className="w-5 h-5 text-[#001B55]" />}
>
  {/* Content here */}
</ContentCard>
```

### 3. ActionButton
```tsx
import { ActionButton } from "../components/ui/ActionButton";
import { Plus, Edit, Filter } from "lucide-react";

// Primary button
<ActionButton icon={<Plus className="w-4 h-4" />} variant="primary">
  Button Text
</ActionButton>

// Secondary button
<ActionButton icon={<Edit className="w-4 h-4" />} variant="secondary">
  Button Text
</ActionButton>

// Outline button
<ActionButton icon={<Filter className="w-4 h-4" />} variant="outline">
  Button Text
</ActionButton>
```

**PENTING**: Icons harus di-pass sebagai ReactNode (JSX element), BUKAN sebagai component class!

## Design Principles

### ✅ DO's
1. **Clean & Minimal** - White backgrounds dengan border tipis biru
2. **Consistent Spacing** - Gunakan gap-4, gap-6, space-y-6
3. **Subtle Borders** - `border border-[#001B55]/10` atau `/20`
4. **Text Hierarchy** - `text-[#001B55]` untuk heading, `text-gray-600` untuk body
5. **Rounded Corners** - `rounded-xl` untuk cards, `rounded-lg` untuk buttons
6. **Shadow Subtle** - `shadow-sm` default, `hover:shadow-md` optional

### ❌ DON'Ts
1. **NO Gradient Backgrounds** - Hanya solid white
2. **NO Orange/Yellow Colors** - Hanya biru NasDem
3. **NO Heavy Shadows** - Tidak ada `shadow-xl` atau `shadow-2xl`
4. **NO Filled Color Backgrounds** - Kecuali white
5. **NO Complex Animations** - Keep it simple

## Component Structure Pattern

```tsx
import { PageHeader } from "../components/ui/PageHeader";
import { ContentCard } from "../components/ui/ContentCard";
import { ActionButton } from "../components/ui/ActionButton";
import { AdminLayout } from "../components/layout/AdminLayout";
import { IconComponent, Plus } from "lucide-react";

export default function PageName() {
  const breadcrumbs = [
    { label: "Dashboard", href: "/admin" },
    { label: "Page Name" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          icon={<IconComponent className="w-6 h-6 text-[#001B55]" />}
          title="Page Title"
          description="Page description"
          action={
            <ActionButton icon={<Plus className="w-4 h-4" />}>
              Action
            </ActionButton>
          }
        />

        {/* Content Card */}
        <ContentCard
          title="Section Title"
          description="Section description"
          icon={<Icon className="w-5 h-5 text-[#001B55]" />}
        >
          {/* Your content here */}
        </ContentCard>
      </div>
    </AdminLayout>
  );
}
```

## Badge Styles

```tsx
// Blue badge (default)
<Badge className="border border-[#001B55]/20 bg-white text-[#001B55]">
  Text
</Badge>

// Success badge
<Badge className="border border-emerald-500/20 bg-white text-emerald-600">
  Active
</Badge>

// Danger badge
<Badge className="border border-red-500/20 bg-white text-red-600">
  Inactive
</Badge>
```

## Table Styles

```tsx
<Table>
  <TableHeader>
    <TableRow className="border-b border-[#001B55]/10">
      <TableHead className="py-4 px-6 text-[#001B55] font-semibold text-sm">
        Header
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="border-b border-gray-100 hover:bg-gray-50">
      <TableCell className="py-5 px-6 font-medium text-[#001B55]">
        Data
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Form Input Styles

```tsx
// Search input
<Input
  placeholder="Search..."
  className="border-[#001B55]/20 focus:border-[#001B55]/40 focus:ring-[#001B55]/20"
/>

// Select
<Select>
  <SelectTrigger className="border-[#001B55]/20">
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent className="border-[#001B55]/20">
    <SelectItem value="option">Option</SelectItem>
  </SelectContent>
</Select>
```

## Migration Checklist

Saat mengkonversi halaman lama ke design system baru:

- [ ] Replace gradient backgrounds dengan white `bg-white`
- [ ] Remove semua warna orange `#FF9C04`
- [ ] Replace dengan border tipis biru `border-[#001B55]/20`
- [ ] Gunakan `PageHeader` untuk header section
- [ ] Gunakan `ContentCard` untuk content sections
- [ ] Gunakan `ActionButton` untuk buttons
- [ ] Update badge styles (no gradients)
- [ ] Update table styles (clean borders)
- [ ] Check text colors (gray-600 untuk body, [#001B55] untuk headings)
- [ ] Remove shadow-xl, gunakan shadow-sm
- [ ] Update rounded corners (rounded-xl untuk cards)
