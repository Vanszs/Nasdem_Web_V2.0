import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { KipFormData } from "../schema";
import { clearDraft, getDraftTimestamp } from "../helpers";

interface DraftIndicatorProps {
  form: UseFormReturn<KipFormData>;
  draftLoaded: boolean;
}

export function DraftIndicator({ form, draftLoaded }: DraftIndicatorProps) {
  if (!draftLoaded) return null;

  const handleClearDraft = () => {
    if (confirm("Yakin ingin menghapus draft dan reset form?")) {
      form.reset();
      clearDraft();
      toast.success("Draft berhasil dihapus");
    }
  };

  return (
    <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <Save className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-green-900">
            Draft Otomatis Aktif
          </p>
          <p className="text-xs text-green-700">
            Data Anda disimpan otomatis setiap perubahan
            {getDraftTimestamp() && (
              <span className="ml-1">• Terakhir: {getDraftTimestamp()}</span>
            )}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClearDraft}
        className="text-green-700 hover:text-green-900 hover:bg-green-100"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Hapus Draft
      </Button>
    </div>
  );
}
