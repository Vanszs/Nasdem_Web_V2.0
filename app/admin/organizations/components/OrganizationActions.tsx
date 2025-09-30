"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
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
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#001B55]">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => setOpenEdit(true)} className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setOpenDelete(true)}
              className="gap-2 text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Hapus
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
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#001B55]">Hapus Struktur?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data member tetap ada.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2 space-y-2 text-sm">
            <p>
              Level: <span className="font-semibold">{item.level.toUpperCase()}</span>
            </p>
            <p>
              Posisi: <span className="font-semibold">{item.position}</span>
            </p>
          </div>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
              className="border-[#001B55]/30"
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
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMut.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
