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
import { AlertTriangle, Trash2 } from "lucide-react";
import type { Program } from "../types";

interface DeleteProgramDialogProps {
  open: boolean;
  program: Program | null;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: number) => void;
}

export function DeleteProgramDialog({
  open,
  program,
  onOpenChange,
  onDelete,
}: DeleteProgramDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#C81E1E]">
            <AlertTriangle className="h-5 w-5" />
            Konfirmasi Hapus
          </DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus program ini? Tindakan ini tidak
            dapat dibatalkan.
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
            className="rounded-full"
          >
            Batal
          </Button>
          <Button
            onClick={() => {
              if (program) onDelete(program.id);
            }}
            className="bg-[#C81E1E] hover:bg-[#A01818] rounded-full text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
