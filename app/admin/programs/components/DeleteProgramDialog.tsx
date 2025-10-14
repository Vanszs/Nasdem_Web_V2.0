"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import type { Program } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteProgramDialogProps {
  open: boolean;
  program: Program | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProgramDialog({
  open,
  program,
  onOpenChange,
}: DeleteProgramDialogProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/programs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus program");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Program berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      onOpenChange(false);
    },
    onError: (e: any) => {
      toast.error(e?.message || "Gagal menghapus program");
    },
  });

  const isDeleting = deleteMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#C81E1E]">
            <AlertTriangle className="h-5 w-5" />
            Konfirmasi Hapus
          </DialogTitle>
          <DialogDescription>
            {isDeleting
              ? "Sedang menghapus program..."
              : "Apakah Anda yakin ingin menghapus program ini? Tindakan ini tidak dapat dibatalkan."}
          </DialogDescription>
        </DialogHeader>
        {program && (
          <div className="py-4">
            <div className="bg-[#E8F9FF] rounded-lg p-4 border border-[#C4D9FF]">
              <h4 className="font-semibold text-[#001B55] mb-1">
                {program.name}
              </h4>
              <p className="text-sm text-[#475569] line-clamp-3">
                {program.description}
              </p>
            </div>
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="rounded-full cursor-pointer"
          >
            Batal
          </Button>
          <Button
            onClick={() => {
              if (program) deleteMutation.mutate(program.id);
            }}
            disabled={!program || isDeleting}
            className="bg-[#C81E1E] hover:bg-[#A01818] rounded-full text-white cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" /> Hapus
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
