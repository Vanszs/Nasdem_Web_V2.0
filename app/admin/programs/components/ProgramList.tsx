"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, User } from "lucide-react";
import { Program } from "../types";
import { ProgramStatusBadge } from "./ProgramStatusBadge";

interface ProgramListProps {
  programs: Program[];
  onEdit: (program: Program) => void;
  onDeleteRequest: (program: Program) => void;
}

export function ProgramList({
  programs,
  onEdit,
  onDeleteRequest,
}: ProgramListProps) {
  if (!programs.length) {
    return (
      <Card className="border border-[#E8F9FF] shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-3xl">
        <CardContent className="p-12 text-center">
          <h3 className="text-xl font-bold text-[#001B55] mb-2">
            Belum Ada Program
          </h3>
          <p className="text-[#475569] mb-4">
            Mulai tambahkan program kerja untuk ditampilkan di sini
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="grid gap-6">
      {programs.map((program: any) => (
        <Card
          key={program.id}
          className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-white overflow-hidden"
        >
          <Collapsible>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-[#F0F0F0]/50 transition-all duration-200 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-[#001B55] flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-[#FF9C04] rounded-full shadow-sm" />
                          <span className="font-bold">{program.name}</span>
                        </CardTitle>
                        {program.coordinator && (
                          <div className="flex items-center gap-2 ml-6 text-sm text-[#6B7280]">
                            <User className="w-4 h-4" />
                            <span>
                              Koordinator: {program.coordinator?.fullName}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        {program.coordinator && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E8F9FF] rounded-full">
                            <User className="w-4 h-4 text-[#001B55]" />
                            <span className="text-sm font-medium text-[#001B55]">
                              {program.coordinator.fullName}
                            </span>
                          </div>
                        )}
                        <ProgramStatusBadge status={program.status} />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {program.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {program.target !== undefined &&
                        program.target !== null && (
                          <span className="flex items-center gap-2 text-[#001B55] font-medium">
                            Target: {program.target}
                          </span>
                        )}
                      {(program.startDate || program.endDate) && (
                        <span className="text-[#6B7280]">
                          Timeline:{" "}
                          {new Date(
                            program.startDate as string
                          ).toLocaleDateString() ?? "?"}{" "}
                          -{" "}
                          {new Date(
                            program.endDate as string
                          ).toLocaleDateString() ?? "?"}
                        </span>
                      )}
                      {typeof program.currentTarget === "number" &&
                        typeof program.target === "number" &&
                        program.target > 0 && (
                          <span className="text-[#FF9C04] font-bold">
                            {Math.round(
                              (program.currentTarget / program.target) * 100
                            )}
                            % tercapai
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(program);
                      }}
                      className="rounded-full border-[#FF9C04] text-[#001B55] hover:bg-[#FF9C04] hover:text-white transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRequest(program);
                      }}
                      className="rounded-full border-[#C81E1E] text-[#C81E1E] hover:bg-[#C81E1E] hover:text-white cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-6 pb-6">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-4 flex items-center gap-2 text-[#001B55] text-lg">
                        Status Progress
                      </h4>
                      <div className="space-y-3 bg-[#F9FAFB] p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-[#001B55]">
                            Penerima:
                          </span>
                          <span className="text-[#001B55] font-semibold">
                            {program.currentTarget} / {program.target}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-[#001B55]">
                            Anggaran:
                          </span>
                          <span className="text-[#001B55] font-semibold">
                            Rp {Number(program.budget).toLocaleString("id-ID")}
                          </span>
                        </div>
                        {program.coordinator && (
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-[#001B55]">
                              Koordinator:
                            </span>
                            <span className="text-[#001B55]">
                              {program.coordinator?.fullName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
}
