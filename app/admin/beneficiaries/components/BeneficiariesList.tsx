"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, User } from "lucide-react";
import type { Beneficiary } from "../types";

export function BeneficiariesList({
  data,
  isLoading,
  onEdit,
  onDelete,
}: {
  data: Beneficiary[];
  isLoading: boolean;
  onEdit: (b: Beneficiary) => void;
  onDelete: (b: Beneficiary) => void;
}) {
  if (isLoading) {
    return (
      <Card className="border border-[#E8F9FF] shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-3xl">
        <CardContent className="p-8">
          <div className="h-6 w-40 bg-slate-200 animate-pulse rounded mb-3" />
          <div className="h-4 w-full bg-slate-100 animate-pulse rounded mb-2" />
          <div className="h-4 w-3/4 bg-slate-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card className="border border-[#E8F9FF] shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-3xl">
        <CardContent className="p-12 text-center">
          <h3 className="text-xl font-bold text-[#001B55] mb-2">
            Belum Ada Data
          </h3>
          <p className="text-[#475569] mb-4">
            Tambahkan penerima manfaat untuk mulai
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {data.map((b) => (
        <Card key={b.id} className="border-0 shadow-xl rounded-3xl">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#C5BAFF] rounded-full" />
                <CardTitle className="text-[#001B55] font-bold">
                  {b.fullName}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => onEdit(b)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full text-[#C81E1E] border-[#C81E1E]"
                  onClick={() => onDelete(b)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="text-[#475569]">
                Program:{" "}
                <span className="text-[#001B55] font-medium">
                  {b.program?.name ?? b.programId}
                </span>
              </div>
              {b.nik && (
                <div className="text-[#475569]">
                  NIK:{" "}
                  <span className="text-[#001B55] font-medium">{b.nik}</span>
                </div>
              )}
              {b.phone && (
                <div className="text-[#475569]">
                  Telepon:{" "}
                  <span className="text-[#001B55] font-medium">{b.phone}</span>
                </div>
              )}
              <div className="text-[#475569]">
                Status:{" "}
                <span className="text-[#001B55] font-medium">
                  {b.status === "pending" ? "Menunggu" : "Selesai"}
                </span>
              </div>
              {b.proposerName && (
                <div className="text-[#475569]">
                  Pengusul:{" "}
                  <span className="text-[#001B55] font-medium">
                    {b.proposerName}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
