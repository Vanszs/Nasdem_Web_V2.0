# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

### Brand Colors
- Primary Blue: `#001B55` (header, sidebar, main accents)
- Accent Orange: `#FF9C04` (primary buttons, highlights, badges)
- Background: `#F0F0F0` (content sections)
- Surface: `#FFFFFF` (cards, tables, forms, modals)
- Danger: `#C81E1E` (destructive actions)

### Design Principles
- Clean, flat, and futuristic design
- Creative geometry with rounded corners and pill-shaped elements
- Micro-interactions with gentle hover states
- Generous white space for premium feel
- Mobile-first responsive design

### Component Guidelines
- Use Shadcn/ui components from `components/ui/`
- Apply CVA (Class Variance Authority) for component variants
- Follow TypeScript interfaces for props
- Use `cn()` utility for conditional classes

## Development Workflows

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