

# CLAUDE.md

## ⚠️ CRITICAL RULES - READ FIRST ⚠️

### 🚫 NEVER RUN NPM COMMANDS
**JANGAN PERNAH MENJALANKAN COMMAND NPM RUN APAPUN!**
- ❌ NEVER: `npm run dev`
- ❌ NEVER: `npm run build`
- ❌ NEVER: `npm run start`
- ❌ NEVER: `npm install <package>`
- ❌ NEVER: Any npm run commands
- ⚠️ If user asks to run npm, politely decline and explain it should be done manually

### 📚 ALWAYS USE CONTEXT7 MCP REFERENCES
**SETIAP PERUBAHAN WAJIB CEK DOKUMENTASI CONTEXT7 MCP TERLEBIH DAHULU!**

Before making ANY changes:
1. 🔍 **Search Context7 MCP** for the library/framework documentation
2. 📖 **Read official docs** using `mcp_context_resolve-library-id` and `mcp_context_get-library-docs`
3. ✅ **Verify patterns** match the latest official documentation
4. 🔄 **Use up-to-date examples** from Context7, not outdated patterns

**Priority Order for References:**
1. Context7 MCP Documentation (HIGHEST PRIORITY)
2. Official library docs via Context7
3. Existing codebase patterns (only if matches Context7 docs)

**When to Use Context7:**
- ✅ Before implementing new features with external libraries
- ✅ When using React, Next.js, Prisma, or any framework
- ✅ When user asks about best practices
- ✅ When debugging library-specific issues
- ✅ When refactoring existing code
- ✅ Before suggesting code patterns

**Example Usage:**
```typescript
// ❌ WRONG - Don't assume patterns without checking docs
// Using outdated or guessed patterns

// ✅ CORRECT - Check Context7 MCP first
// 1. Call: mcp_context_resolve-library-id with "next.js"
// 2. Call: mcp_context_get-library-docs with the library ID
// 3. Use the official patterns from documentation
// 4. Implement with confidence based on latest docs
```

---

This file provides guidance to Claude Code/Github Copilot (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official website for DPD Partai NasDem Sidoarjo - a Next.js 15 application with TypeScript, Prisma ORM, and PostgreSQL database. It serves as both a public website and multi-role admin system for Indonesian political party management.

## Common Development Commands

```bash
# Development
npm run dev              # Start development server (localhost:3000)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npx prisma generate     # Generate Prisma client after schema changes
npx prisma db push      # Push schema changes to database
npx prisma studio       # Open Prisma Studio for database inspection
npm run prisma:seed     # Seed database with initial data
```

## Architecture Overview

### Tech Stack

- **Next.js 15** with App Router (not Pages Router)
- **TypeScript** with strict typing
- **Prisma ORM** with PostgreSQL database
- **Tailwind CSS v4** + Shadcn/ui components
- **JWT Authentication** with cookie-based sessions

### Core Package Dependencies

#### UI & Styling

- **Shadcn/ui** - Base component library (DO NOT edit root files in `components/ui/`)
- **Tailwind CSS v4** - Utility-first CSS framework
- **BlockNote** - Rich text editor with existing reusable component

#### Data Management

- **Prisma** - Type-safe ORM for PostgreSQL
- **React Query (TanStack Query)** - Server state management and API fetching
- **Zod** - Schema validation for forms and API

#### Form & Table Handling

- **React Hook Form** - Performant form handling with validation
- **React Table (TanStack Table)** - Headless table component (use reusable wrapper)

### Key Directory Structure

```
app/
├── page.tsx                    # Public homepage
├── admin/                      # Protected admin area
│   ├── layout.tsx             # Admin-specific layout
│   ├── (other-public-routes)/     # Other public pages
├── api/                       # API routes (Next.js App Router)
│   ├── auth/login/route.ts    # Authentication endpoint
│   └── [entity]/route.ts      # CRUD endpoints
├── berita/                    # Public news pages
├── galeri/                    # Public gallery pages
└── (other-public-routes)/     # Other public pages

components/
├── ui/                        # Shadcn/ui components
├── [feature]-section.tsx      # Page section components
└── [feature].tsx             # Standalone components

lib/
├── db.ts                      # Prisma client singleton
├── jwt-middleware.ts          # Auth middleware
└── utils.ts                   # Utility functions
```

## Authentication & Authorization

### Role-Based Access Control

```typescript
enum UserRole {
  superadmin    // Full system access
  editor        // Content management
  analyst       // Data analysis only
}
```

### Authentication Pattern

Always check both authentication AND authorization in API routes:

```typescript
// In API routes
const authError = requireAuth(req);
if (authError) return authError;

const roleError = requireRole(req, ["superadmin", "editor"]);
if (roleError) return roleError;
```

- Use `lib/jwt-middleware.ts` for protected routes
- JWT tokens stored in httpOnly cookies
- Always validate user role for protected operations

## Database Patterns

### Prisma Client Usage

- Always use `db` from `@/lib/db` (singleton pattern)
- Follow established enum types in schema.prisma
- Key entities: `Member`, `StrukturOrganisasi`, `DprdElectionAnalysis`

### Key Entity Relationships

- `Member` → `StrukturOrganisasi` (organizational hierarchy)
- `DprdElectionAnalysis` → `Dapil/Kecamatan/Desa/Tps` (election geography)
- `Party` → `Caleg` → `DprdCalegResult` (candidate results)

## UI/UX Conventions

### Design System - Two Distinct Palettes (Updated Oct 2025)

#### 🌐 **PUBLIC LANDING PAGE Color Palette**

**Use for:** `app/page.tsx`, `components/nasdem-*`, `components/*-section.tsx`, all public routes

**Primary Colors:**

- Brand Primary: `#001B55` (deep navy - NasDem signature color)
- Brand Accent: `#FF9C04` (vibrant orange - CTAs, highlights, active states)
- White: `#FFFFFF` (clean backgrounds, cards)

**Background & Surface:**

- Main Background: `#FFFFFF` / `#F9FAFB` (pure white / very light gray)
- Section Alt: `#F0F0F0` (subtle gray for alternating sections)
- Gradient Surface: `from-[#FFFFFF] to-[#F0F0F0]/30`

**Text Colors:**

- Heading: `#001B55` (navy for titles)
- Body: `#6B7280` (gray for paragraphs)
- Muted: `#9CA3AF` (lighter gray for subtle text)

**Interactive States:**

- Active: `text-[#FF9C04]` with `bg-[#FF9C04]` accent bars
- Hover: `hover:text-[#FF9C04]` or `hover:bg-[#001B55]`
- Button Primary: `bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90`
- Button Hover: `hover:from-[#001B55] hover:to-[#001B55]`

**Borders & Shadows:**

- Border: `border-gray-100` / `border-gray-200`
- Shadow: `shadow-lg`, `shadow-xl` for depth
- Accent Shadow: `shadow-[#FF9C04]/30` for glow effects

---

#### 🔐 **ADMIN AREA Color Palette**

**Use for:** `app/admin/**`, admin components, protected routes

**Modern Futuristic Colors:**

- Primary: `#001B55` (deep navy - headers, text, icons)
- Accent: `#C5BAFF` (soft purple - active states, highlights)
- Background: `#FBFBFB` (ultra light gray - main background)
- Surface: `#E8F9FF` (light blue tint - cards, sidebar)
- Surface Alt: `#C4D9FF` (light blue - hover states)
- Border: `#D8E2F0` / `#C4D9FF` (soft gray-blue borders)
- Hover: `#F0F6FF` (very light blue - table hover)

**Text Colors:**

- Text Primary: `#001B55` (deep navy)
- Text Secondary: `#475569` (slate gray)
- Text Muted: `#6B7280` (gray)

**Status Colors:**

- Success: `#34D399` (green - positive trends)
- Error: `#F87171` (red - negative trends)
- Warning: `#FBBF24` (yellow - alerts)

**Interactive States:**

- Active: `bg-[#C5BAFF] text-[#001B55]`
- Hover: `hover:bg-[#C4D9FF]`
- Focus: `border-[#C5BAFF] ring-2 ring-[#C5BAFF]/20`

---

### ⚠️ **CRITICAL RULES:**

1. **NEVER mix palettes** - Landing uses Orange (#FF9C04), Admin uses Purple (#C5BAFF)
2. **Landing page = Vibrant & Bold** - High contrast, strong CTAs, traditional web feel
3. **Admin area = Soft & Modern** - Futuristic, flat design, data-focused
4. Check file path before applying colors:
   - `app/page.tsx` or `components/` → Use **Landing Palette**
   - `app/admin/` → Use **Admin Palette**

### Design Principles

**Landing Page Design:**

- Bold and vibrant with strong visual hierarchy
- Traditional web aesthetics with modern touches
- High contrast for readability
- Large hero sections with dramatic CTAs
- Shadow-heavy for depth (`shadow-lg`, `shadow-xl`)
- Rounded corners (12-16px for cards, 8-12px for buttons)
- Gradient buttons for maximum attention
- Mobile-first responsive design

**Admin Design:**

- Clean, flat, and futuristic
- Data-focused with minimal distractions
- Soft colors for reduced eye strain during long sessions
- Creative geometry with subtle rounded corners (16px cards, 8-10px buttons)
- Micro-interactions with gentle hover states (`scale-[1.02]`, `duration-300`)
- Generous white space for premium feel
- Minimal shadows: `shadow-[0_1px_3px_rgba(0,0,0,0.05)]`
- Mobile-first responsive design

---

### Component Styling Standards

#### 🌐 **LANDING PAGE Components**

**Hero Section:**

```typescript
className =
  "relative overflow-hidden bg-gradient-to-br from-[#001B55] via-[#001B55] to-[#001845]";
// Overlay: bg-gradient-to-t from-black/60 via-black/30 to-transparent
```

**Section Headers:**

```typescript
className =
  "text-3xl md:text-4xl lg:text-5xl font-bold text-[#001B55] mb-4 leading-tight";
// Body: text-base md:text-lg text-[#6B7280]
```

**Primary CTA Button:**

```typescript
className =
  "bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-4 font-semibold";
```

**Secondary Button:**

```typescript
className =
  "text-[#6B7280] hover:bg-[#001B55]/5 hover:text-[#001B55] border border-transparent hover:border-[#001B55]/20 transition-all duration-300 rounded-xl px-8 py-4";
```

**Cards (Landing):**

```typescript
className =
  "bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100";
```

**Active States (Landing):**

```typescript
// Navigation active
className="text-[#FF9C04] font-bold relative"
// With animated underline
<span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FF9C04] rounded-full animate-pulse"></span>

// Button/Tab active
className="bg-gradient-to-r from-[#001B55] to-[#001B55]/95 text-white shadow-lg"
// Indicator dot
<div className="w-2 h-2 rounded-full bg-[#FF9C04] animate-pulse shadow-lg shadow-[#FF9C04]/30"></div>
```

---

#### 🔐 **ADMIN AREA Components**

**Cards (Admin):**

```typescript
className="bg-white border border-[#E8F9FF] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.08)] transition-all duration-300"
style={{ borderRadius: "16px" }}
```

**Buttons (Active/Selected):**

```typescript
className =
  "bg-[#C5BAFF] text-[#001B55] hover:bg-[#C4D9FF] transition-all duration-300";
```

**Buttons (Hover):**

```typescript
className =
  "hover:bg-[#C4D9FF] hover:text-[#001B55] transition-all duration-300";
```

**Tables:**

- Header: `bg-[#E8F9FF] border-b border-[#C4D9FF]`
- Striped rows: `bg-white` / `bg-[#E8F9FF]/30`
- Hover: `hover:bg-[#F0F6FF] transition-all duration-200`

**Sidebar:**

- Background: `bg-[#E8F9FF]`
- Border: `border-[#C4D9FF]`
- Active menu: `bg-[#C5BAFF] text-[#001B55]`
- Hover: `bg-[#C4D9FF] transition-colors duration-200`

**Search Box (Admin):**

- Background: `bg-[#E8F9FF]`
- Border: `border-[#C4D9FF]`
- Focus: `border-[#C5BAFF] ring-2 ring-[#C5BAFF]/20`

**Form Inputs (Admin):**

```typescript
className =
  "bg-white border border-[#C4D9FF] focus:border-[#C5BAFF] focus:ring-2 focus:ring-[#C5BAFF]/20 rounded-lg transition-all duration-300";
```

### Component Guidelines

- Use Shadcn/ui components from `components/ui/`
- Apply CVA (Class Variance Authority) for component variants
- Follow TypeScript interfaces for props
- Use `cn()` utility for conditional classes
- Always apply hover effects with `transition-all duration-300`
- Use `scale-[1.02]` or `scale-110` for micro-interactions

## Development Workflows

### Pre-Build Checklist ✅

Before running `npm run build`, verify:

1. **"use client" directive:**

   - All components with hooks (`useState`, `useEffect`, etc.) have `"use client"` at top
   - All components with event handlers (`onClick`, `onChange`, etc.) have `"use client"`
   - All components using browser APIs (`window`, `localStorage`, etc.) have `"use client"`

2. **Import validation:**

   - No circular imports between components
   - All `@/` imports resolve correctly
   - No unused imports that might cause tree-shaking issues

3. **TypeScript errors:**

   - Run `npm run lint` to check for type errors
   - Fix all TypeScript warnings before build

4. **Component exports:**

   - All page.tsx files export a default function
   - All components are properly exported from their files

5. **API routes:**
   - All route.ts files follow correct Next.js 15 pattern
   - Authentication middleware properly applied

**Common Build Error Patterns:**

```bash
# Error: "You're importing a component that needs useState"
# Fix: Add "use client" to the component file

# Error: "Module not found"
# Fix: Check import paths, ensure @/ alias is correct

# Error: "Text content does not match server-rendered HTML"
# Fix: Check for hydration mismatches, ensure consistent rendering
```

### Database Changes

1. Update `prisma/schema.prisma`
2. Run `npx prisma generate` to regenerate client
3. Apply changes with `npx prisma db push`

### API Route Pattern

```typescript
export async function GET/POST/PUT/DELETE(req: NextRequest) {
  // 1. Authentication check
  const authError = requireAuth(req);
  if (authError) return authError;

  // 2. Role authorization
  const roleError = requireRole(req, ['allowed-roles']);
  if (roleError) return roleError;

  // 3. Business logic with Prisma
  // 4. Return NextResponse.json()
}
```

## Important Constraints

### Package Usage Rules ⚠️ MANDATORY

**ALWAYS use existing packages for their intended purposes:**

1. **Form Handling - React Hook Form + Zod:**

   ```typescript
   import { useForm } from "react-hook-form";
   import { zodResolver } from "@hookform/resolvers/zod";
   import { z } from "zod";

   const formSchema = z.object({
     name: z.string().min(3, "Minimal 3 karakter"),
     email: z.string().email("Email tidak valid"),
   });

   const form = useForm({
     resolver: zodResolver(formSchema),
     defaultValues: { name: "", email: "" },
   });
   ```

2. **API Fetching - React Query:**

   ```typescript
   import {
     useQuery,
     useMutation,
     useQueryClient,
   } from "@tanstack/react-query";

   // GET request
   const { data, isLoading, error } = useQuery({
     queryKey: ["news", id],
     queryFn: () => fetch(`/api/news/${id}`).then((res) => res.json()),
   });

   // POST/PUT/DELETE request
   const mutation = useMutation({
     mutationFn: (data) =>
       fetch("/api/news", {
         method: "POST",
         body: JSON.stringify(data),
       }),
     onSuccess: () => queryClient.invalidateQueries(["news"]),
   });
   ```

3. **Rich Text Editor - BlockNote:**

   - Use existing reusable BlockNote component (check `components/` or `app/admin/components/`)
   - DO NOT create new rich text editor implementations

4. **Table Handling - React Table:**

   - Use reusable table component wrapper if exists
   - If creating new table, make it reusable in `components/ui/data-table.tsx` pattern

5. **Database Operations - Prisma:**

   ```typescript
   import { db } from "@/lib/db";

   // Always use the singleton instance
   const users = await db.user.findMany();
   ```

**NEVER:**

- Implement manual form validation when React Hook Form + Zod exists
- Use `fetch` without React Query for data fetching
- Create custom rich text editors
- Build tables from scratch without React Table
- Use alternative ORMs or raw SQL queries

### Component Size & Reusability Rules ⚠️ CRITICAL

1. **File Size Limit:**

   - Maximum **500 lines per component file**
   - If exceeding 500 lines, split into smaller components
   - Extract hooks, utilities, and types to separate files

2. **Component Reusability:**

   - **ALWAYS check existing components first** before creating new ones
   - Reuse Shadcn/ui components from `components/ui/`
   - Create new components ONLY if they are reusable across multiple pages
   - Place reusable components in appropriate directories:
     - Admin reusable: `app/admin/components/shared/`
     - Public reusable: `components/`

3. **Component Splitting Strategy:**

   ```
   ✅ GOOD - Split by responsibility:
   - UserForm.tsx (120 lines)
   - UserFormFields.tsx (80 lines)
   - UserFormActions.tsx (40 lines)
   - useUserForm.ts (60 lines)

   ❌ BAD - One monolithic file:
   - UserManagement.tsx (650 lines)
   ```

4. **Extraction Patterns:**
   - Extract form schemas → separate `.schema.ts` files
   - Extract API calls → custom hooks in `hooks/` directory
   - Extract business logic → utility functions in `lib/`
   - Extract type definitions → `.types.ts` files

### CSS & Styling Rules ⚠️ STRICT

**NEVER EDIT:**

- ❌ `app/globals.css` - Global CSS file
- ❌ `components/ui/*` - Shadcn/ui root component files
- ❌ Library CSS files (Tailwind config is OK to update)

**ALWAYS:**

- ✅ Use Tailwind utility classes directly on components
- ✅ Use `cn()` utility for conditional classes
- ✅ Create component-specific styles with Tailwind
- ✅ Use CSS modules for complex isolated styles (rare cases)

**Styling Pattern:**

```typescript
import { cn } from "@/lib/utils";

// ✅ CORRECT
<div className={cn(
  "bg-white rounded-lg p-4",
  isActive && "bg-[#C5BAFF]",
  className // Allow external className override
)}>

// ❌ WRONG - Don't modify globals.css
// Add to globals.css:
// .custom-card { background: white; padding: 1rem; }
```

### "use client" Directive Rules ⚠️ CRITICAL

**ALWAYS add `"use client"` directive at the TOP of any component file that uses:**

1. **React Hooks:**

   - `useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`, etc.
   - `useRouter`, `usePathname`, `useSearchParams` (from `next/navigation`)

2. **Event Handlers:**

   - `onClick`, `onChange`, `onSubmit`, `onFocus`, `onBlur`, etc.
   - Any component with interactive user actions

3. **Browser APIs:**

   - `window`, `document`, `localStorage`, `sessionStorage`
   - `addEventListener`, `setTimeout`, `setInterval`

4. **Third-Party Libraries that require client-side:**
   - `toast` from `sonner`
   - Charts libraries (Recharts, etc.)
   - Animation libraries

**Correct Pattern:**

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MyComponent() {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount(count + 1)}>{count}</Button>;
}
```

**Files that ALWAYS need "use client":**

- `app/admin/components/layout/ModernSidebar.tsx` ✅
- `app/admin/components/layout/TopNavbar.tsx` ✅
- `app/admin/components/layout/AdminLayout.tsx` ✅
- `app/admin/components/gallery/GalleryUploadPage.tsx` ✅
- `app/admin/components/gallery/GalleryPage.tsx` ✅
- `app/admin/components/gallery/MediaUploadPage.tsx` ✅
- `app/admin/components/news/PinConfirmDialog.tsx` ✅
- `app/admin/components/news/NewsTable.tsx` ✅
- `app/admin/components/statistik/StatistikDataTable.tsx` ✅
- `app/admin/components/statistik/StatistikChartsSection.tsx` ✅
- `app/admin/page.tsx` (Dashboard with charts) ✅
- `app/admin/news/page.tsx` ✅
- `app/admin/user/page.tsx` ✅
- `app/admin/beneficiaries/page.tsx` ✅
- `app/admin/landing/page.tsx` ✅
- `app/admin/programs/page.tsx` ✅
- `app/admin/statistik-pemilu/page.tsx` ✅
- `app/admin/gallery/page.tsx` ✅
- `app/admin/organizations/page.tsx` ✅
- Any component with `useState`, event handlers, or browser APIs

**Files that DON'T need "use client":**

- Pure server components without hooks or events
- API routes (`app/api/**/route.ts`)
- Middleware (`middleware.ts`)
- Static data fetching components

**Build Error Prevention:**

- Before creating any new component, ask: "Does it use hooks or event handlers?"
- If YES → Add `"use client"` as FIRST LINE
- If NO → Keep as server component
- When importing a client component into a server component, the import is fine (children pattern)

### CSS Rules

- NEVER modify global CSS files (`app/globals.css`)
- NEVER modify library CSS (Tailwind, Shadcn/ui base styles)
- Apply custom styling directly to components using Tailwind classes or inline styles
- Use CSS modules or styled-jsx for complex custom CSS needs

### File Organization

- Admin components live in `app/admin/src/components/`, not root `components/`
- Public components use root `components/` directory
- Section components follow `[feature]-section.tsx` naming convention
- Keep component files under 500 lines - split if needed
- Organize by feature, not by type:

  ```
  ✅ GOOD:
  app/admin/components/news/
    ├── NewsForm.tsx
    ├── NewsTable.tsx
    ├── NewsFilters.tsx
    └── hooks/
        └── useNewsData.ts

  ❌ BAD:
  app/admin/components/
    ├── forms/NewsForm.tsx
    ├── tables/NewsTable.tsx
    └── filters/NewsFilters.tsx
  ```

### Import Patterns

- Use `@/` alias for root imports
- Use relative paths within directories
- Database operations always use the singleton `db` from `@/lib/db`
- Import existing reusable components before creating new ones
- Group imports logically:

  ```typescript
  // 1. External packages
  import { useState } from "react";
  import { useQuery } from "@tanstack/react-query";

  // 2. Internal components
  import { Button } from "@/components/ui/button";
  import { NewsCard } from "./NewsCard";

  // 3. Utilities & types
  import { cn } from "@/lib/utils";
  import type { News } from "@/lib/types";
  ```

## Best Practices & Patterns

### Form Implementation Pattern

**ALWAYS use this pattern for forms:**

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 1. Define schema with Zod
const formSchema = z.object({
  title: z.string().min(3, "Minimal 3 karakter"),
  content: z.string().min(10, "Minimal 10 karakter"),
});

type FormData = z.infer<typeof formSchema>;

export function NewsForm() {
  const queryClient = useQueryClient();

  // 2. Initialize form with React Hook Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", content: "" },
  });

  // 3. API mutation with React Query
  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      form.reset();
    },
  });

  // 4. Submit handler
  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan judul..." />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </form>
    </Form>
  );
}
```

### Data Fetching Pattern

**ALWAYS use React Query for API calls:**

```typescript
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// GET - Fetching list
export function NewsListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render data */}</div>;
}

// GET - Fetching single item with params
export function NewsDetailPage({ id }: { id: string }) {
  const { data } = useQuery({
    queryKey: ["news", id],
    queryFn: () => fetch(`/api/news/${id}`).then((res) => res.json()),
    enabled: !!id, // Only fetch when id exists
  });
}

// POST/PUT/DELETE - Mutations
export function useDeleteNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fetch(`/api/news/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
}
```

### Table Implementation Pattern

**Use React Table with reusable wrapper:**

```typescript
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table"; // Reusable wrapper
import { useQuery } from "@tanstack/react-query";

interface News {
  id: string;
  title: string;
  createdAt: Date;
}

const columns: ColumnDef<News>[] = [
  {
    accessorKey: "title",
    header: "Judul",
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("id-ID"),
  },
];

export function NewsTable() {
  const { data = [] } = useQuery({
    queryKey: ["news"],
    queryFn: () => fetch("/api/news").then((res) => res.json()),
  });

  return <DataTable columns={columns} data={data} />;
}
```

### Component Splitting Example

**When component exceeds 500 lines:**

```typescript
// ❌ BAD - NewsManagementPage.tsx (650 lines)
export function NewsManagementPage() {
  // Form logic (200 lines)
  // Table logic (250 lines)
  // Filter logic (150 lines)
  // Action handlers (50 lines)
}

// ✅ GOOD - Split into multiple files

// NewsManagementPage.tsx (80 lines)
export function NewsManagementPage() {
  return (
    <div>
      <NewsFilters />
      <NewsTable />
      <NewsFormDialog />
    </div>
  );
}

// NewsForm.tsx (120 lines)
export function NewsForm() {
  /* Form implementation */
}

// NewsTable.tsx (150 lines)
export function NewsTable() {
  /* Table implementation */
}

// NewsFilters.tsx (80 lines)
export function NewsFilters() {
  /* Filter implementation */
}

// hooks/useNewsData.ts (70 lines)
export function useNewsData() {
  /* Data fetching logic */
}
```

### Rich Text Editor Usage

**ALWAYS use existing BlockNote component:**

```typescript
import { BlockNoteEditor } from "@/components/BlockNoteEditor"; // Check actual path

export function NewsForm() {
  const [content, setContent] = useState("");

  return (
    <form>
      <BlockNoteEditor initialContent={content} onChange={setContent} />
    </form>
  );
}

// ❌ NEVER create new rich text editor implementations
```

### Import Patterns

## Key Features

### Election Data Analysis

- Complex nested relationships through `DprdElectionAnalysis` entity
- Geographic hierarchy: `Dapil` → `Kecamatan` → `Desa` → `Tps`
- Results split between party-level and candidate-level data

### Organization Management

- `StrukturOrganisasi` handles hierarchical positions
- `OrgLevel` enum defines organizational tiers (dpd, sayap, dpc, dprt, kader)
- Members can have multiple positions over time with date ranges

### Content Management

- News, Programs, and Gallery link to User for author tracking
- Consistent upload/media handling patterns
- Content validation and sanitization implemented

---

## ⚠️ CRITICAL REMINDERS - READ BEFORE CODING

### Package Usage Checklist ✅

Before implementing any feature, check:

- [ ] **Forms?** → Use React Hook Form + Zod
- [ ] **API Calls?** → Use React Query
- [ ] **Tables?** → Use React Table with reusable wrapper
- [ ] **Rich Text?** → Use existing BlockNote component
- [ ] **Database?** → Use Prisma with `db` singleton
- [ ] **Base Components?** → Check Shadcn/ui first

### File Size Checklist ✅

Before saving component:

- [ ] Component under 500 lines?
- [ ] If >500 lines, split into smaller components
- [ ] Extracted hooks to separate files?
- [ ] Extracted types/schemas to `.types.ts` or `.schema.ts`?

### Styling Checklist ✅

Before styling:

- [ ] Check file location: Public (Orange) or Admin (Purple)?
- [ ] NOT editing `app/globals.css`?
- [ ] NOT editing `components/ui/*` root files?
- [ ] Using Tailwind utilities with `cn()` helper?

### Reusability Checklist ✅

Before creating new component:

- [ ] Checked if similar component exists?
- [ ] Component will be reused in multiple places?
- [ ] Placed in correct directory (admin/shared vs root components)?

### Build Checklist ✅

Before committing code:

- [ ] All interactive components have `"use client"` directive?
- [ ] No circular imports?
- [ ] TypeScript errors resolved?
- [ ] All imports use `@/` alias correctly?

---

This codebase prioritizes Indonesian political party management with strict role-based access, complex election data relationships, and responsive public-facing content display.

**Development Philosophy:**

- **Reuse over reinvent** - Check existing packages and components first
- **Modular over monolithic** - Keep files small and focused
- **Type-safe over permissive** - Leverage TypeScript and Zod
- **Consistent over creative** - Follow established patterns
- **Standard libraries over custom solutions** - Use React Hook Form, React Query, React Table
