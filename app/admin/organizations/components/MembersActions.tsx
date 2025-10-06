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
import { MoreHorizontal, Pencil, Trash2, Dot } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditMemberDialog } from "./EditMemberDialog";
import type { MemberListItem } from "./MembersTable";

interface MembersActionsProps {
  member: MemberListItem;
  onChanged?: () => void;
}

type MemberStatus = "active" | "inactive" | "suspended" | "";

export function MembersActions({ member, onChanged }: MembersActionsProps) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [statusPending, setStatusPending] = React.useState<MemberStatus>("");
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (openStatus) {
      setStatusPending((member.status as MemberStatus) || "active");
    }
  }, [member.status, openStatus]);
  const statusMutation = useMutation({
    mutationFn: async (status: Exclude<MemberStatus, "">) => {
      const res = await fetch(`/api/members/${member.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal memperbarui status");
      }
      return json;
    },
    onSuccess: () => {
      toast.success("Status member berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setOpenStatus(false);
      onChanged?.();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal memperbarui status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/members/${member.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus member");
      }
      return json;
    },
    onSuccess: () => {
      toast.success("Member berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setOpenDelete(false);
      onChanged?.();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal menghapus member");
    },
  });

  const handleStatusSave = () => {
    if (!statusPending) return;
    statusMutation.mutate(statusPending as Exclude<MemberStatus, "">);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 rounded-full border border-[#001B55]/20 bg-white/80 px-3 text-xs font-medium text-[#001B55] shadow-sm hover:border-[#001B55]/40 hover:bg-white"
          >
            <MoreHorizontal className="mr-1.5 h-4 w-4" />
            Aksi
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
          <DropdownMenuItem
            onClick={() => setOpenEdit(true)}
            className="rounded-lg text-sm"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Member
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenStatus(true)}
            className="rounded-lg text-sm"
          >
            <Dot className="mr-2 h-4 w-4" />
            Ubah Status
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="rounded-lg text-sm text-red-600 focus:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditMemberDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        member={member}
        onUpdated={() => {
          setOpenEdit(false);
          onChanged?.();
        }}
      />

      <Dialog open={openStatus} onOpenChange={setOpenStatus}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Ubah Status</DialogTitle>
            <DialogDescription>
              {member.fullName} — pilih status baru.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            {(["active", "inactive", "suspended"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusPending(s)}
                disabled={statusMutation.isPending}
                className={`px-3 py-2 rounded-md text-xs border ${
                  statusPending === s
                    ? "bg-[#001B55] text-white border-[#001B55]"
                    : "bg-white text-[#001B55] border-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenStatus(false)}
              disabled={statusMutation.isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleStatusSave}
              disabled={statusMutation.isPending || !statusPending}
              className="bg-[#001B55] text-white"
            >
              {statusMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Member</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data {member.fullName} akan
              dihapus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
              disabled={deleteMutation.isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
