"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Target } from "lucide-react";

export function ProgramCard({
  program,
  IconComponent,
  JoinDialog,
  DetailDialog,
  showJoin = true,
}: {
  program: any;
  IconComponent: any;
  JoinDialog?: React.ReactNode;
  DetailDialog: React.ReactNode;
  showJoin?: boolean;
}) {
  const target = Number(program.target) || 0;
  const current = Number(program.currentTarget) || 0;
  const percent =
    target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-nasdem-blue bg-white">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-nasdem-blue/10 rounded-xl flex items-center justify-center">
            <IconComponent className="text-nasdem-blue h-8 w-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <CardTitle className="text-2xl mb-2 text-nasdem-blue">
                  {program.name}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed text-gray-600">
                  {program.description}
                </CardDescription>
              </div>
              <Badge className="bg-nasdem-orange text-white capitalize">
                {program.status}
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target size={14} />
                  <span>Target: {target}</span>
                </div>
                <Progress value={percent} className="h-2" />
                <span className="text-xs text-gray-500">
                  {percent}% tercapai
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={14} />
                <span>
                  Timeline:{" "}
                  {program.startDate
                    ? new Date(program.startDate).getFullYear()
                    : "-"}{" "}
                  -{" "}
                  {program.endDate
                    ? new Date(program.endDate).getFullYear()
                    : "-"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-nasdem-orange font-medium">
                <Clock size={14} />
                <span>Status: {program.status}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 items-center">
              <div className="flex items-center gap-3 md:col-span-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src={
                      program.coordinator?.photoUrl || "/placeholder-user.jpg"
                    }
                    alt={program.coordinator?.fullName || "Koordinator"}
                    width={40}
                    height={40}
                    className="object-cover w-10 h-10"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  Koordinator:{" "}
                  <span className="font-semibold text-nasdem-blue">
                    {program.coordinator?.fullName || "-"}
                  </span>
                </div>
              </div>
              <div className="justify-self-end flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-gray-300 hover:border-[#001B55] hover:text-[#001B55]"
                    >
                      Detail Program
                    </Button>
                  </DialogTrigger>
                  {DetailDialog}
                </Dialog>
                {showJoin && JoinDialog && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-nasdem-orange to-nasdem-orange/90 hover:from-nasdem-orange/90 hover:to-nasdem-orange text-white">
                        Ikut Program
                      </Button>
                    </DialogTrigger>
                    {JoinDialog}
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>{/* reserved for details */}</CardContent>
    </Card>
  );
}
