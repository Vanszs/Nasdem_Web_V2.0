"use client";
import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { AdminLayout } from "../components/layout/AdminLayout";
import { ProgramFormDialog } from "./components/ProgramFormDialog";
import { ProgramStats } from "./components/ProgramStats";
import { ProgramList } from "./components/ProgramList";
import { DeleteProgramDialog } from "./components/DeleteProgramDialog";
import type { Program } from "./types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function ProgramsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery<{ success: boolean; data: Program[] }>({
    queryKey: ["programs"],
    queryFn: async () => {
      const res = await fetch("/api/programs");
      if (!res.ok) throw new Error("Failed to fetch programs");
      return res.json();
    },
  });

  const programs: Program[] = useMemo(() => data?.data ?? [], [data]);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  const requestDelete = (program: Program) => {
    setProgramToDelete(program);
    setDeleteDialogOpen(true);
  };

  const breadcrumbs = [{ label: "Program Kerja" }];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#001B55] rounded-2xl shadow-lg">
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#001B55] leading-tight">
                  Program Kerja
                </h1>
                <p className="text-[#475569] mt-1">
                  Kelola program kerja DPD NasDem Sidoarjo
                </p>
              </div>
            </div>
            <ProgramFormDialog
              editingProgram={editingProgram}
              onClose={() => setEditingProgram(null)}
              onSuccess={() =>
                queryClient.invalidateQueries({ queryKey: ["programs"] })
              }
              triggerClassName="h-14 px-8 cursor-pointer rounded-full bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
            />
          </div>
        </div>
        <ProgramStats programs={programs} />
        <ProgramList
          programs={programs}
          onEdit={(p) => setEditingProgram(p)}
          onDeleteRequest={requestDelete}
        />
      </div>
      <DeleteProgramDialog
        open={deleteDialogOpen}
        program={programToDelete}
        onOpenChange={setDeleteDialogOpen}
      />
    </AdminLayout>
  );
}
