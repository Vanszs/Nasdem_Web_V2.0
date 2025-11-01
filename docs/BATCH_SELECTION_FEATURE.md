# Batch Selection Feature Documentation

## Overview
Fitur batch selection telah ditingkatkan ke semua tabel admin untuk memungkinkan pengguna memilih multiple items dan melakukan aksi batch (delete, approve, reject, export, dll) dengan UI/UX yang lebih rapi dan robust.

## Components Created

### 1. **useBatchSelection Hook** (`hooks/use-batch-selection.ts`)
Reusable React hook yang ditingkatkan untuk mengelola state batch selection di semua tabel.

**Features:**
- ✅ Select/deselect individual rows
- ✅ Select/deselect all rows
- ✅ Clear all selections
- ✅ Execute batch actions with callback
- ✅ Auto-sync dengan data changes
- ✅ Type-safe dengan TypeScript generics
- ✅ Loading states untuk batch actions
- ✅ Progress tracking untuk long-running operations
- ✅ Error handling dengan detailed messages
- ✅ Selection persistence across page navigation
- ✅ Retry functionality untuk failed actions

**Usage:**
```typescript
const batchSelection = useBatchSelection({
  data: tableData,
  idField: "id", // optional, defaults to "id"
  persistKey: "news-batch-selection", // optional, untuk persistence
  enablePersistence: true, // optional, defaults to false
  onBatchAction: async (action, selectedIds) => {
    // Handle batch action (delete, approve, etc.)
    if (action === "delete") {
      await deleteBatch(selectedIds);
    }
  },
});
```

**API:**
```typescript
{
  selectedIds: any[],           // Array of selected IDs
  selectedCount: number,        // Count of selected items
  isAllSelected: boolean,       // True if all items selected
  isRowSelected: (id) => boolean, // Check if row is selected
  toggleRowSelection: (id) => void, // Toggle single row
  toggleAllSelection: () => void,   // Toggle all rows
  clearSelection: () => void,       // Clear all selections
  executeBatchAction: (action: string) => Promise<boolean>, // Execute action
  hasSelection: boolean,        // True if any items selected
  actionState: {             // Enhanced action state tracking
    loading: boolean;
    error: string | null;
    progress: number;
    total: number;
  },
  retryLastAction: () => void,  // Retry failed action
  clearError: () => void,        // Clear error state
}
```

### 2. **BatchActionBar Component** (`components/ui/batch-action-bar.tsx`)
Reusable UI component yang ditingkatkan untuk menampilkan action bar dengan batch controls.

**Features:**
- ✅ Display selected count dengan animasi
- ✅ Select/deselect all button
- ✅ Clear selection button
- ✅ Delete action button
- ✅ Export action button (optional)
- ✅ Custom actions support dengan loading states
- ✅ Admin color scheme (purple/blue theme) dengan gradient
- ✅ Keyboard shortcuts support (Ctrl+A, Escape)
- ✅ Responsive design untuk mobile devices
- ✅ Loading overlay dengan progress indicator
- ✅ Accessibility improvements (ARIA labels, screen reader support)
- ✅ Visual feedback dan micro-interactions

**Props:**
```typescript
interface BatchActionBarProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  customActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: ButtonVariant;
    className?: string;
    loading?: boolean; // New: loading state per action
  }>;
  className?: string;
  loading?: boolean; // New: overall loading state
  loadingMessage?: string; // New: custom loading message
}
```

**Usage:**
```tsx
<BatchActionBar
  selectedCount={batchSelection.selectedCount}
  totalCount={data.length}
  isAllSelected={batchSelection.isAllSelected}
  onSelectAll={batchSelection.toggleAllSelection}
  onClearSelection={batchSelection.clearSelection}
  onDelete={() => batchSelection.executeBatchAction("delete")}
  onExport={() => batchSelection.executeBatchAction("export")}
  loading={batchSelection.actionState.loading}
  loadingMessage={`Memproses ${batchSelection.selectedCount} item...`}
  customActions={[
    {
      label: "Approve",
      variant: "default",
      onClick: () => handleApprove(),
      loading: batchSelection.actionState.loading,
    }
  ]}
/>
```

### 3. **EnhancedCheckbox Component** (`components/ui/enhanced-checkbox.tsx`)
Checkbox component yang ditingkatkan dengan visual feedback yang lebih baik.

**Features:**
- ✅ Multiple variants (default, table, card)
- ✅ Hover dan focus states dengan animasi
- ✅ Visual feedback ring saat focus/hover
- ✅ Smooth transitions dan micro-interactions
- ✅ Accessibility improvements (ARIA labels)
- ✅ Keyboard navigation support
- ✅ Indeterminate state untuk partial selection

### 4. **BatchConfirmationDialog Component** (`components/ui/batch-confirmation-dialog.tsx`)
Dialog konfirmasi yang ditingkatkan dengan detail yang lebih lengkap.

**Features:**
- ✅ Action-specific styling dan icons
- ✅ Item count badge
- ✅ Detailed item information
- ✅ Progress indicator untuk long-running operations
- ✅ Error handling dengan retry options
- ✅ Warning messages untuk destructive actions
- ✅ Collapsible detail sections
- ✅ Loading states dengan disable buttons

## Tables Updated

### 1. **NewsTable** (`app/admin/components/news/NewsTable.tsx`)
- ✅ Batch selection checkbox column
- ✅ BatchActionBar integration
- ✅ Batch delete functionality
- ✅ API endpoint: `POST /api/news/batch-delete`

### 2. **UserTable** (`app/admin/user/components/UserTable.tsx`)
- ✅ Batch selection using React Table
- ✅ BatchActionBar integration
- ✅ Batch delete functionality
- ✅ Prevents self-deletion
- ✅ API endpoint: `POST /api/users/batch-delete`

### 3. **MembersTable** (`app/admin/organizations/components/MembersTable.tsx`)
- ✅ Batch selection checkbox column
- ✅ BatchActionBar integration
- ✅ Batch delete functionality
- ✅ Batch export functionality (placeholder)
- ✅ API endpoint: `POST /api/members/batch-delete`

### 4. **RegistrationsTable** (`app/admin/pending-requests/member-regist/components/RegistrationsTable.tsx`)
- ✅ Batch selection checkbox column
- ✅ BatchActionBar integration
- ✅ Batch approve functionality
- ✅ Batch reject functionality
- ✅ API endpoints:
  - `POST /api/membership-applications/batch-approve`
  - `POST /api/membership-applications/batch-reject`

## API Endpoints Created

### 1. **POST /api/news/batch-delete**
Soft delete multiple news items.

**Request:**
```json
{
  "ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully deleted 3 news items",
  "deletedCount": 3
}
```

**Authorization:** `superadmin`, `editor`

### 2. **POST /api/users/batch-delete**
Soft delete multiple users (prevents self-deletion).

**Request:**
```json
{
  "ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully deleted 2 users",
  "deletedCount": 2,
  "skipped": 1
}
```

**Authorization:** `superadmin` only

### 3. **POST /api/members/batch-delete**
Soft delete multiple members.

**Request:**
```json
{
  "ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully deleted 3 members",
  "deletedCount": 3
}
```

**Authorization:** `superadmin`, `editor`

### 4. **POST /api/membership-applications/batch-approve**
Approve multiple pending membership applications.

**Request:**
```json
{
  "ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully approved 3 applications",
  "approvedCount": 3
}
```

**Authorization:** `superadmin`, `editor`

### 5. **POST /api/membership-applications/batch-reject**
Reject multiple pending membership applications.

**Request:**
```json
{
  "ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully rejected 3 applications",
  "rejectedCount": 3
}
```

**Authorization:** `superadmin`, `editor`

## Design System

**Color Palette (Admin Area):**
- Background: `#E8F9FF` (light blue)
- Border: `#C4D9FF` (soft blue)
- Active/Accent: `#C5BAFF` (soft purple)
- Primary Text: `#001B55` (deep navy)
- Hover: `#C4D9FF` (light blue)

**Checkbox Styling:**
```css
rounded border-gray-300 text-[#001B55] focus:ring-2 focus:ring-[#001B55]/20
```

## Usage Pattern for New Tables

```tsx
"use client";

import { useBatchSelection } from "@/hooks/use-batch-selection";
import { BatchActionBar } from "@/components/ui/batch-action-bar";
import { toast } from "sonner";

export function MyTable({ data }: Props) {
  // 1. Initialize batch selection
  const batchSelection = useBatchSelection({
    data,
    idField: "id",
    onBatchAction: async (action, selectedIds) => {
      if (action === "delete") {
        const confirmed = window.confirm(
          `Delete ${selectedIds.length} items?`
        );
        if (!confirmed) return;

        try {
          const response = await fetch("/api/my-resource/batch-delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: selectedIds }),
          });

          if (!response.ok) throw new Error("Failed");

          toast.success(`Deleted ${selectedIds.length} items`);
          batchSelection.clearSelection();
          refetch(); // or window.location.reload()
        } catch (err) {
          toast.error("Failed to delete", {
            description: (err as Error).message,
          });
        }
      }
    },
  });

  // 2. Add checkbox column to table
  const columns = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={batchSelection.isAllSelected}
          onChange={batchSelection.toggleAllSelection}
          className="rounded border-gray-300 text-[#001B55] focus:ring-2 focus:ring-[#001B55]/20"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={batchSelection.isRowSelected(row.id)}
          onChange={() => batchSelection.toggleRowSelection(row.id)}
          className="rounded border-gray-300 text-[#001B55] focus:ring-2 focus:ring-[#001B55]/20"
        />
      ),
    },
    // ... other columns
  ];

  // 3. Add BatchActionBar
  return (
    <div className="space-y-4">
      <BatchActionBar
        selectedCount={batchSelection.selectedCount}
        totalCount={data.length}
        isAllSelected={batchSelection.isAllSelected}
        onSelectAll={batchSelection.toggleAllSelection}
        onClearSelection={batchSelection.clearSelection}
        onDelete={() => batchSelection.executeBatchAction("delete")}
      />

      {/* Your table here */}
    </div>
  );
}
```

## Security Considerations

1. **Authentication:** All batch endpoints require valid JWT token
2. **Authorization:** Role-based access control via `requireRole()`
3. **Validation:** Input validation for IDs array
4. **Soft Delete:** Uses `deletedAt` field instead of hard delete
5. **Self-Protection:** User deletion prevents deleting own account

## Testing Checklist

- [ ] Select individual items
- [ ] Select all items
- [ ] Deselect all items
- [ ] Execute batch delete
- [ ] Execute batch approve/reject (registrations)
- [ ] Verify API endpoints work
- [ ] Check role-based permissions
- [ ] Test with large datasets
- [ ] Verify UI responsiveness
- [ ] Check error handling

## Future Enhancements

- [ ] Add batch edit functionality
- [ ] Implement batch export to CSV/Excel
- [ ] Add undo/redo for batch actions
- [ ] Persist selection across page navigation
- [ ] Add batch status change (for news)
- [ ] Implement progress indicator for large batches
- [ ] Add keyboard shortcuts (Ctrl+A for select all)

## Notes

- All batch operations use soft delete (`deletedAt` field)
- Selections are reset after successful batch action
- Toast notifications provide user feedback
- Confirmation dialogs prevent accidental actions
- Loading states handled by mutation hooks (React Query)

---

**Created:** 2025-01-11
**Last Updated:** 2025-01-11
**Version:** 1.0.0
