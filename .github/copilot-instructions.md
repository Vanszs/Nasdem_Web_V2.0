# Copilot Instructions - NasDem Sidoarjo Website

## 🏛️ Project Overview
This is the official website for DPD Partai NasDem Sidoarjo - a multi-role admin system with public website for Indonesian political party management. The system handles organization structure, election data analysis, news management, and member databases.

## 🔧 Tech Stack & Architecture

### Core Stack
- **Next.js 15** with App Router (not Pages Router)
- **TypeScript** with strict typing
- **Prisma ORM** with PostgreSQL database
- **Tailwind CSS v4** + Shadcn/ui components
- **JWT Authentication** with cookie-based sessions

### Key Dependencies
- `@prisma/client` for database operations
- `bcrypt` for password hashing
- `jsonwebtoken` for authentication
- `@radix-ui/*` components via Shadcn/ui
- `lucide-react` for icons
- `class-variance-authority` for component variants

## 📁 Critical File Structure Patterns

```
app/
├── page.tsx                    # Public homepage
├── admin/                      # Protected admin area
│   ├── layout.tsx             # Admin-specific layout
│   ├── providers.tsx          # Admin context providers
│   ├── styles/admin.css       # Admin-only styles
│   └── src/                   # Admin source code
│       ├── components/        # Admin UI components
│       ├── views/pages/       # Admin page components
│       └── lib/               # Admin utilities
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

## 🔐 Authentication & Authorization

### Role-Based Access Control
```typescript
// User roles defined in Prisma schema
enum UserRole {
  superadmin    // Full system access
  editor        // Content management
  analyst       // Data analysis only
}
```

### JWT Implementation Pattern
- Use `lib/jwt-middleware.ts` for protected routes
- Cookies are httpOnly, secure in production
- Always check both authentication AND authorization:

```typescript
// In API routes
const authError = requireAuth(req);
if (authError) return authError;

const roleError = requireRole(req, ['superadmin', 'editor']);
if (roleError) return roleError;
```

## 🗄️ Database Patterns

### Prisma Client Usage
- Always use `db` from `@/lib/db` (singleton pattern)
- Follow the established enum types in schema.prisma
- Complex relationships: `DprdElectionAnalysis` connects all election data

### Key Entity Relationships
- `Member` → `StrukturOrganisasi` (organizational hierarchy)
- `DprdElectionAnalysis` → `Dapil/Kecamatan/Desa/Tps` (election geography)
- `Party` → `Caleg` → `DprdCalegResult` (candidate results)

## 🎨 UI/UX Conventions

### Component Architecture
- Use Shadcn/ui components from `components/ui/`
- Apply CVA (Class Variance Authority) for variants
- Follow the button.tsx pattern for component structure

### Styling Guidelines  
- **Primary Colors**: Blue (`#001B55`) and Orange (`#FF9C04`)
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Supported via `class` strategy
- Use `cn()` utility for conditional classes

### CSS & Styling Rules ⚠️
- **NEVER modify global CSS files** (`app/globals.css`, `app/admin/styles/admin.css`)
- **NEVER modify library CSS** (Tailwind, Shadcn/ui base styles)
- **Custom styling**: Apply directly to components using Tailwind classes or inline styles
- **Component-level CSS**: Use CSS modules or styled-jsx if complex custom CSS needed
- **Override patterns**: Use `cn()` utility to merge Tailwind classes safely

### Layout Patterns
- Admin pages use dedicated `admin/layout.tsx`
- Public pages share root `layout.tsx`
- Section components follow `[feature]-section.tsx` naming

## 🔄 Development Workflows

### Database Changes
1. Update `prisma/schema.prisma`
2. Run `npx prisma generate` (client regeneration)
3. Apply migrations if needed

### API Route Pattern
```typescript
// Standard API route structure
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

### Component Development
- Start with Shadcn/ui base components
- Add variants using CVA pattern
- Implement responsive design with Tailwind
- Use TypeScript interfaces for props
- **Custom styling**: Apply styles directly to individual components, never modify global CSS

## 🚨 Common Gotchas

1. **Admin vs Public Routes**: Admin components are in `app/admin/src/`, not root `components/`
2. **Prisma Enums**: Use schema-defined enums, don't create custom ones
3. **Authentication**: Always validate BOTH token AND role for protected routes
4. **Import Paths**: Use `@/` alias for root imports, relative paths within directories
5. **Database Relations**: Election data has complex nested relationships - check existing queries before writing new ones
6. **CSS Modifications**: NEVER edit global CSS files - always apply custom styles at component level

## 🎯 Project-Specific Patterns

### Election Data Analysis
- All election data flows through `DprdElectionAnalysis` entity
- Geographic hierarchy: `Dapil` → `Kecamatan` → `Desa` → `Tps`
- Results split between party-level and candidate-level data

### Organization Management
- `StrukturOrganisasi` handles all hierarchical positions
- `OrgLevel` enum defines organizational tiers
- Members can have multiple positions over time (date ranges)

### Content Management
- News, Programs, and Gallery all link to User (author tracking)
- Use consistent upload/media handling patterns
- Implement proper content validation and sanitization

This codebase prioritizes Indonesian political party management with strict role-based access, complex election data relationships, and responsive public-facing content display.