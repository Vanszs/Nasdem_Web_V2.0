# CLAUDE.md


JANGAN MELAKUKAN NPM RUN SAMA SEKALI

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

### Key Directory Structure
```
app/
├── page.tsx                    # Public homepage
├── admin/                      # Protected admin area
│   ├── layout.tsx             # Admin-specific layout
│   ├── src/                   # Admin source code
│   │   ├── components/        # Admin UI components
│   │   ├── views/pages/       # Admin page components
│   │   └── lib/               # Admin utilities
│   └── styles/admin.css       # Admin-only styles
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

const roleError = requireRole(req, ['superadmin', 'editor']);
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

### Current Design System (Updated Oct 2025)
**Modern Futuristic Color Palette:**
- Primary: `#001B55` (deep navy - headers, text, icons)
- Accent: `#C5BAFF` (soft purple - active states, highlights)
- Background: `#FBFBFB` (ultra light gray - main background)
- Surface: `#E8F9FF` (light blue tint - cards, sidebar)
- Surface Alt: `#C4D9FF` (light blue - hover states)
- Border: `#D8E2F0` (soft gray-blue - borders)
- Hover: `#F0F6FF` (very light blue - table hover)
- Text Primary: `#001B55` (deep navy)
- Text Secondary: `#475569` (slate gray)
- Success: `#34D399` (green - positive trends)
- Error: `#F87171` (red - negative trends)

**Legacy Colors (Being phased out):**
- ~~Accent Orange: `#FF9C04`~~ (only use for specific brand elements)
- ~~Background: `#F0F0F0`~~ (replaced by `#FBFBFB`)
- ~~Surface: `#FFFFFF`~~ (replaced by `#E8F9FF` for cards)

### Design Principles
- Clean, flat, and futuristic design
- Creative geometry with rounded corners (16px cards, 8-10px buttons)
- Micro-interactions with gentle hover states (`scale-[1.02]`, `duration-300`)
- Generous white space for premium feel
- Mobile-first responsive design
- Minimal shadows: `shadow-[0_1px_3px_rgba(0,0,0,0.05)]`

### Component Styling Standards
**Cards:**
```typescript
className="bg-white border border-[#E8F9FF] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.08)] transition-all duration-300"
style={{ borderRadius: "16px" }}
```

**Buttons (Active/Selected):**
```typescript
className="bg-[#C5BAFF] text-[#001B55] hover:bg-[#C4D9FF]"
```

**Buttons (Hover):**
```typescript
className="hover:bg-[#C4D9FF] hover:text-[#001B55]"
```

**Tables:**
- Header: `bg-[#E8F9FF] border-b border-[#C4D9FF]`
- Striped rows: `bg-white` / `bg-[#E8F9FF]/30`
- Hover: `hover:bg-[#F0F6FF]`

**Sidebar:**
- Background: `bg-[#E8F9FF]`
- Border: `border-[#C4D9FF]`
- Active menu: `bg-[#C5BAFF] text-[#001B55]`
- Hover: `bg-[#C4D9FF]`

**Search Box:**
- Background: `bg-[#E8F9FF]`
- Border: `border-[#C4D9FF]`
- Focus: `border-[#C5BAFF] ring-2 ring-[#C5BAFF]/20`

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
- NEVER modify global CSS files (`app/globals.css`, `app/admin/styles/admin.css`)
- NEVER modify library CSS (Tailwind, Shadcn/ui base styles)
- Apply custom styling directly to components using Tailwind classes or inline styles
- Use CSS modules or styled-jsx for complex custom CSS needs

### File Organization
- Admin components live in `app/admin/src/components/`, not root `components/`
- Public components use root `components/` directory
- Section components follow `[feature]-section.tsx` naming convention

### Import Patterns
- Use `@/` alias for root imports
- Use relative paths within directories
- Database operations always use the singleton `db` from `@/lib/db`

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

This codebase prioritizes Indonesian political party management with strict role-based access, complex election data relationships, and responsive public-facing content display.