"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

interface Props {
  initialSearch?: string;
  initialRole?: "all" | "superadmin" | "editor" | "analyst";
  onChange: (v: {
    search: string;
    role: "all" | "superadmin" | "editor" | "analyst";
  }) => void;
}

export function UserFilters({
  initialSearch = "",
  initialRole = "all",
  onChange,
}: Props) {
  const [search, setSearch] = useState(initialSearch);
  const [role, setRole] = useState<"all" | "superadmin" | "editor" | "analyst">(
    initialRole
  );
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    onChange({ search: debouncedSearch, role });
  }, [debouncedSearch, role, onChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
      <Input
        placeholder="Cari nama atau email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-72"
      />
      <Select value={role} onValueChange={(v: any) => setRole(v)}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Semua Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Role</SelectItem>
          <SelectItem value="superadmin">Super Admin</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="analyst">Analyst</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
