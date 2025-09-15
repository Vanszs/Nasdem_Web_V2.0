import { useState } from "react";
import { Pin, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";

interface PinConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPinnedTitle?: string;
  newTitle: string;
  onConfirm: () => void;
}

export function PinConfirmDialog({
  open,
  onOpenChange,
  currentPinnedTitle,
  newTitle,
  onConfirm,
}: PinConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Pin className="h-5 w-5 text-accent" />
            Jadikan Berita Ini Pinned?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p>
                  Hanya satu berita yang boleh di-pin dalam satu waktu. Tindakan ini akan:
                </p>
                
                {currentPinnedTitle && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Berita yang saat ini di-pin:</p>
                    <Badge variant="outline" className="text-xs">
                      {currentPinnedTitle}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Status pin akan dicabut otomatis
                    </p>
                  </div>
                )}
                
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium mb-1">Berita yang akan di-pin:</p>
                  <Badge className="bg-accent text-accent-foreground text-xs">
                    {newTitle}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Akan tampil sebagai highlight utama di landing page
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isConfirming}
            className="bg-[#FF9C04] hover:bg-[#001B55] text-white transition-all duration-300"
          >
            {isConfirming ? "Memproses..." : "Ya, Pin Berita Ini"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}