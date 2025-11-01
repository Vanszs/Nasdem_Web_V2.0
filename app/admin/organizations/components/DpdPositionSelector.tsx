"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDpdPositionsGrouped } from "@/lib/dpd-positions";

interface DpdPositionSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Dropdown selector untuk posisi DPD dengan grouping
 * Menampilkan 35 posisi DPD yang dikelompokkan menjadi:
 * 1. Ketua & Wakil Ketua Bidang (27 posisi)
 * 2. Sekretaris & Bendahara (8 posisi)
 */
export function DpdPositionSelector({
  value,
  onChange,
  disabled = false,
}: DpdPositionSelectorProps) {
  const groupedPositions = getDpdPositionsGrouped();

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className="h-11 w-full bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] transition-all duration-300 disabled:opacity-50"
        style={{ borderRadius: "10px" }}
      >
        <SelectValue placeholder="Pilih posisi DPD" />
      </SelectTrigger>
      <SelectContent
        className="bg-white border border-[#D8E2F0] max-h-[400px]"
        style={{ borderRadius: "10px" }}
      >
        {groupedPositions.map((group, groupIndex) => (
          <SelectGroup key={groupIndex}>
            <SelectLabel className="text-xs font-bold text-[#001B55] bg-[#E8F9FF] px-3 py-2">
              {group.label}
            </SelectLabel>
            {group.options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="hover:bg-[#F0F6FF] transition-colors pl-6"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#C5BAFF] w-8">
                    #{option.order}
                  </span>
                  <span className="text-sm text-[#001B55]">{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
