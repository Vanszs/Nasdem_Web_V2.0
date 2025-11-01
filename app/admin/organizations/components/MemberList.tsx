"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Member } from "../hooks/useOrganizationData";

interface MemberListProps {
  selectedIds: number[];
  onToggle: (id: number) => void;
  membersList?: Member[];
  isLoading?: boolean;
}

/**
 * Reusable component untuk menampilkan daftar member dengan checkbox
 * Digunakan di OrganizationMemberForm dan KaderToDprtForm
 */
export function MemberList({
  selectedIds,
  onToggle,
  membersList = [],
  isLoading = false,
}: MemberListProps) {
  return (
    <div
      className="max-h-72 overflow-y-auto border border-[#D8E2F0] bg-white divide-y divide-[#E8F9FF]"
      style={{
        borderRadius: "10px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
    >
      {isLoading ? (
        <div className="p-8 text-center text-sm text-[#475569]">
          Memuat data...
        </div>
      ) : membersList.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#475569]">
          Tidak ada anggota tersedia
        </div>
      ) : (
        membersList.map((m) => {
          const checked = selectedIds.includes(m.id);
          return (
            <label
              key={m.id}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-300 ${
                checked ? "bg-[#F0F6FF]" : "hover:bg-[#FBFBFB]"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(m.id)}
                className="h-4 w-4 rounded border-[#C4D9FF] text-[#C5BAFF] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-colors"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#001B55] truncate">
                  {m.fullName}
                </div>
                <div className="text-xs text-[#475569] mt-0.5">
                  {m.status || "active"}
                </div>
              </div>
            </label>
          );
        })
      )}
    </div>
  );
}
