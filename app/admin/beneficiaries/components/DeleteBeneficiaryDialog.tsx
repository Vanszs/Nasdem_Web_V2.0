"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import type { Beneficiary } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function DeleteBeneficiaryDialog({
  open,
  beneficiary,
  onOpenChange,
}: {
  open: boolean;
  beneficiary: Beneficiary | null;
  onOpenChange: (v: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/beneficiaries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus penerima manfaat");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Penerima manfaat berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e?.message || "Gagal menghapus"),
  });

  const isDeleting = mutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#C81E1E]">
            <AlertTriangle className="h-5 w-5" /> Konfirmasi Hapus
          </DialogTitle>
          <DialogDescription>
            {isDeleting
              ? "Sedang menghapus..."
              : "Aksi ini tidak dapat dibatalkan."}
          </DialogDescription>
        </DialogHeader>
        {beneficiary && (
          <div className="py-4">
            <div className="bg-[#E8F9FF] rounded-lg p-4 border border-[#C4D9FF]">
              <h4 className="font-semibold text-[#001B55] mb-1">
                {beneficiary.fullName}
              </h4>
              <p className="text-sm text-[#475569]">
                Program ID: {beneficiary.programId}
              </p>
            </div>
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="rounded-full"
          >
            Batal
          </Button>
          <Button
            onClick={() => beneficiary && mutation.mutate(beneficiary.id)}
            disabled={!beneficiary || isDeleting}
            className="bg-[#C81E1E] hover:bg-[#A01818] rounded-full text-white"
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
