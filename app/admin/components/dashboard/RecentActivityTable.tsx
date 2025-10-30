"use client";

import { DataTable, DataTableColumn } from "@/components/dashboard/data-table";

export type RecentRow = Record<string, number | string>;

export function RecentActivityTable({
  columns,
  data,
}: {
  columns: DataTableColumn[];
  data: RecentRow[];
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey="month"
      stickyHeader={true}
      pagination={{ pageSize: 6 }}
      loading={false}
      emptyState={{
        title: "Belum ada data aktivitas",
        action: {
          label: "Refresh Data",
          onClick: () => window.location.reload(),
        },
      }}
    />
  );
}
