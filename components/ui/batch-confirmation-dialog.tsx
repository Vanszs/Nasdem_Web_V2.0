"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Trash2, 
  Download, 
  CheckCircle, 
  XCircle,
  Loader2,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface BatchConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  action: "delete" | "export" | "approve" | "reject" | "custom";
  itemCount: number;
  itemDetails?: {
    label: string;
    value: string | number;
  }[];
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  progress?: number;
  error?: string | null;
  confirmButtonText?: string;
  confirmButtonVariant?: "default" | "destructive" | "outline" | "secondary";
  showDetails?: boolean;
}

const actionConfig = {
  delete: {
    icon: Trash2,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    confirmText: "Hapus",
    confirmVariant: "destructive" as const,
    warning: "Tindakan ini tidak dapat dibatalkan.",
  },
  export: {
    icon: Download,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    confirmText: "Export",
    confirmVariant: "default" as const,
    warning: "Data akan diekspor dalam format CSV.",
  },
  approve: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    confirmText: "Setujui",
    confirmVariant: "default" as const,
    warning: "Pendaftaran yang disetujui tidak dapat dibatalkan.",
  },
  reject: {
    icon: XCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    confirmText: "Tolak",
    confirmVariant: "destructive" as const,
    warning: "Pendaftaran yang ditolak tidak dapat dikembalikan.",
  },
  custom: {
    icon: Info,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    confirmText: "Lanjutkan",
    confirmVariant: "default" as const,
    warning: "",
  },
};

export function BatchConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  action,
  itemCount,
  itemDetails = [],
  onConfirm,
  onCancel,
  loading = false,
  progress = 0,
  error = null,
  confirmButtonText,
  confirmButtonVariant,
  showDetails = true,
}: BatchConfirmationDialogProps) {
  const config = actionConfig[action];
  const Icon = config.icon;
  const [showMoreDetails, setShowMoreDetails] = React.useState(false);

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-full",
              config.bgColor,
              config.borderColor,
              "border"
            )}>
              <Icon className={cn("h-5 w-5", config.color)} />
            </div>
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Item count badge */}
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-sm px-3 py-1">
              {itemCount} item akan diproses
            </Badge>
          </div>

          {/* Warning message */}
          {config.warning && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-800">
                {config.warning}
              </AlertDescription>
            </Alert>
          )}

          {/* Item details */}
          {showDetails && itemDetails.length > 0 && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMoreDetails(!showMoreDetails)}
                className="w-full justify-between text-xs"
              >
                <span>Detail Item</span>
                <span>{showMoreDetails ? "Sembunyikan" : "Tampilkan"}</span>
              </Button>
              
              {showMoreDetails && (
                <div className="rounded-md border bg-gray-50 p-3 space-y-2">
                  {itemDetails.map((detail, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{detail.label}:</span>
                      <span className="font-medium">{detail.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Progress indicator */}
          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Memproses...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Error message */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button
            variant={confirmButtonVariant || config.confirmVariant}
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "w-full sm:w-auto",
              config.confirmVariant === "destructive" && "bg-red-600 hover:bg-red-700"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              confirmButtonText || config.confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}