"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, TrendingUp, Users, Target } from "lucide-react";
import { Program } from "../types";

interface ProgramStatsProps {
  programs: Program[];
}

export function ProgramStats({ programs }: ProgramStatsProps) {
  const total = programs.length;
  const berlangsung = programs.filter((p) => p.status === "ongoing").length;
  const selesai = programs.filter((p) => p.status === "completed").length;
  const rataProgress = programs.length
    ? Math.round(
        programs.reduce((s, p) => {
          if (typeof p.target === "number" && p.target > 0) {
            return (
              s +
              Math.min(
                100,
                Math.round((Number(p.currentTarget) / Number(p.target)) * 100)
              )
            );
          }
          return s;
        }, 0) / programs.length
      )
    : 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="border-0 shadow-xl rounded-3xl bg-gradient-to-br from-[#001B55] to-[#003080] text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">
                Total Program
              </p>
              <p className="text-4xl font-bold">{total}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <ClipboardList className="w-7 h-7" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-xl rounded-3xl bg-gradient-to-br from-[#FF9C04] to-[#FFB04A] text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">
                Sedang Berlangsung
              </p>
              <p className="text-4xl font-bold">{berlangsung}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-xl rounded-3xl bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Selesai</p>
              <p className="text-4xl font-bold text-[#001B55]">{selesai}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-[#001B55]/5 flex items-center justify-center">
              <Users className="w-7 h-7 text-[#001B55]" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-xl rounded-3xl bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Rata Progress
              </p>
              <p className="text-4xl font-bold text-[#001B55]">
                {rataProgress}%
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-[#FF9C04]/10 flex items-center justify-center">
              <Target className="w-7 h-7 text-[#FF9C04]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
