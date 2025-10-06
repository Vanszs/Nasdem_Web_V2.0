"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { EditOrganizationDialog } from "./EditOrganizationDialog";
import { useOrganizationMutations } from "@/app/admin/organizations/hooks/useOrganizations";
import type { StrukturItem } from "./OrganizationTable";

interface LookupRegion { id: number; name: string; type: string }
interface LookupSayap { id: number; name: string }

interface OrganizationActionsProps {
  item: StrukturItem;
  regions: LookupRegion[];
  sayapTypes: LookupSayap[];
}

export function OrganizationActions({ item, regions, sayapTypes }: OrganizationActionsProps) {
  const { update: updateMut, remove: deleteMut } = useOrganizationMutations();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 rounded-full border border-[#001B55]/20 bg-white/80 px-4 text-xs font-semibold uppercase tracking-wide text-[#001B55] shadow-sm transition-all hover:border-[#001B55]/40 hover:bg-white hover:shadow-md"
          >
            <MoreHorizontal className="mr-2 h-4 w-4" />
            Aksi
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-2xl border border-[#001B55]/15 bg-white/95 p-2 shadow-2xl backdrop-blur"
        >
          <DropdownMenuItem
            onClick={() => setOpenEdit(true)}
            className="group gap-3 rounded-xl px-3 py-2 text-sm text-[#001B55] transition-colors hover:bg-[#001B55]/5 focus:bg-[#001B55]/5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#001B55]/10 text-[#001B55] transition-colors group-hover:bg-[#001B55]/15">
              <Pencil className="h-4 w-4" />
            </span>
            <span className="flex flex-col">
              <span className="font-medium">Edit Struktur</span>
              <span className="text-xs text-gray-500">Perbarui rincian organisasi</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2 h-px bg-gradient-to-r from-transparent via-[#001B55]/20 to-transparent" />
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="group gap-3 rounded-xl px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 focus:bg-red-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors group-hover:bg-red-100">
              <Trash2 className="h-4 w-4" />
            </span>
            <span className="flex flex-col">
              <span className="font-medium">Hapus</span>
              <span className="text-xs text-red-400">Hapus struktur ini secara permanen</span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <EditOrganizationDialog
        open={openEdit}
        onOpenChange={(o) => setOpenEdit(o)}
        item={item}
        regions={regions}
        sayapTypes={sayapTypes}
        onUpdate={(id, payload) =>
          updateMut.mutate({ id, data: payload }, { onSuccess: () => setOpenEdit(false) })
        }
        updating={updateMut.isPending}
      />

      {/* Delete Confirmation */}
      <Dialog open={openDelete} onOpenChange={(o) => setOpenDelete(o)}>
        <DialogContent className="sm:max-w-sm border-0 bg-white/95 backdrop-blur-xl shadow-2xl">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-red-100/60 via-transparent to-red-200/40" />
          <div className="relative space-y-4">
            <DialogHeader className="space-y-3 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg">
                <Trash2 className="h-6 w-6" />
              </div>
              <DialogTitle className="text-lg font-semibold text-red-700">
                Hapus Struktur?
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Tindakan ini tidak dapat dibatalkan. Data anggota tetap tersimpan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 rounded-xl bg-white/70 p-4 text-sm shadow-inner">
              <p>
                <span className="text-gray-500">Level:</span>{" "}
                <span className="font-semibold text-[#001B55]">
                  {item.level.toUpperCase()}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Posisi:</span>{" "}
                <span className="font-semibold text-[#001B55]">
                  {item.position}
                </span>
              </p>
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setOpenDelete(false)}
                className="flex-1 rounded-xl border-[#001B55]/20 text-[#001B55] hover:bg-[#001B55]/5"
              >
                Batal
              </Button>
              <Button
                onClick={() =>
                  deleteMut.mutate(item.id, {
                    onSuccess: () => setOpenDelete(false),
                  })
                }
                disabled={deleteMut.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white shadow-lg hover:brightness-105"
              >
                {deleteMut.isPending ? "Menghapus..." : "Hapus"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
