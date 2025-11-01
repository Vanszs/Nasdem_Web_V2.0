"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, Users, UserPlus } from "lucide-react";
import { OrganizationMemberForm } from "./OrganizationMemberForm";
import { KaderToDprtForm } from "./KaderToDprtForm";

interface AddMemberDialogProps {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
}

/**
 * Dialog wrapper untuk menambahkan anggota ke organisasi
 * Memiliki 2 tabs:
 * 1. Anggota → Organisasi: Untuk menambahkan member ke struktur (DPD, DPC, DPRT, Sayap)
 * 2. Kader → DPRT: Untuk menautkan kader ke member DPRT
 */
export function AddMemberDialog({
  open,
  onOpenChange,
}: AddMemberDialogProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const controlledOpen = open !== undefined ? open : dialogOpen;
  
  const setOpen = (v: boolean) => {
    onOpenChange?.(v);
    if (open === undefined) {
      setDialogOpen(v);
    }
  };

  const [tab, setTab] = React.useState("org");

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={controlledOpen} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] bg-white border border-[#D8E2F0] p-0 overflow-hidden flex flex-col"
        style={{
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0, 27, 85, 0.15)",
        }}
      >
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-[#E8F9FF] bg-gradient-to-r from-white to-[#F8FBFF]">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center bg-gradient-to-br from-[#001B55] to-[#003875] shadow-md"
              style={{ borderRadius: "10px" }}
            >
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-bold text-[#001B55]">
                Tambah Keanggotaan Organisasi
              </DialogTitle>
              <p className="text-xs text-[#475569] mt-0.5">
                Tambahkan anggota ke struktur atau tautkan kader ke DPRT
              </p>
            </div>
          </div>
        </DialogHeader>

        <div
          className="flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#C5BAFF #f0f0f0",
          }}
        >
          <div className="px-5 py-4">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="w-full inline-flex h-auto p-0 bg-transparent gap-2 border-b-2 border-gray-200/80 mb-4">
                <TabsTrigger
                  value="org"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#001B55] data-[state=active]:to-[#003875] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-[#001B55] data-[state=active]:border-b-0 data-[state=active]:shadow-md data-[state=inactive]:bg-white/70 data-[state=inactive]:text-[#475569] data-[state=inactive]:border data-[state=inactive]:border-gray-200 data-[state=inactive]:border-b-0 data-[state=inactive]:hover:text-[#001B55] data-[state=inactive]:hover:border-[#001B55]/30 data-[state=inactive]:hover:bg-white font-medium transition-all duration-200 py-2.5 px-4 rounded-t-lg mb-[-2px] text-sm"
                >
                  <Link2 className="mr-1.5 h-4 w-4" /> Anggota → Organisasi
                </TabsTrigger>
                <TabsTrigger
                  value="kader"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#001B55] data-[state=active]:to-[#003875] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-[#001B55] data-[state=active]:border-b-0 data-[state=active]:shadow-md data-[state=inactive]:bg-white/70 data-[state=inactive]:text-[#475569] data-[state=inactive]:border data-[state=inactive]:border-gray-200 data-[state=inactive]:border-b-0 data-[state=inactive]:hover:text-[#001B55] data-[state=inactive]:hover:border-[#001B55]/30 data-[state=inactive]:hover:bg-white font-medium transition-all duration-200 py-2.5 px-4 rounded-t-lg mb-[-2px] text-sm"
                >
                  <Users className="mr-1.5 h-4 w-4" /> Kader → DPRT
                </TabsTrigger>
              </TabsList>

              <TabsContent value="org" className="mt-0">
                <OrganizationMemberForm
                  onSuccess={handleSuccess}
                  isDialogOpen={controlledOpen}
                />
              </TabsContent>

              <TabsContent value="kader" className="mt-0">
                <KaderToDprtForm
                  onSuccess={handleSuccess}
                  isDialogOpen={controlledOpen}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
