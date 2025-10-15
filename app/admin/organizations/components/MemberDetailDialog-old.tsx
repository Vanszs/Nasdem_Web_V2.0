"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlueBorderButton } from "@/app/admin/components/ui/BlueBorderButton";
import { BlueBorderCard } from "@/app/admin/components/ui/BlueBorderCard";
import {
  Users,
  Building,
  UserCheck,
  AlertTriangle,
  Trophy,
  Clock,
  Mail,
  Phone,
  MapPin,
  Printer,
  CreditCard,
  Calendar,
  Home,
  Briefcase,
  Heart,
  User,
  X,
} from "lucide-react";
import { Member } from "../types";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  member: Member | null;
  members: Member[];
  departmentConfig: any;
  getDPRTLeader: (region: string, subDepartment: string) => Member | undefined;
  getKaderCount: (region: string, subDepartment: string) => number;
}

export function MemberDetailDialog({
  open,
  onOpenChange,
  member,
  members,
  departmentConfig,
  getDPRTLeader,
  getKaderCount,
}: Props) {
  const handlePrint = () => {
    window.print();
  };
  
  if (!member) return null;
  
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-full h-[90vh] bg-white border-2 border-[#001B55]/20 rounded-2xl shadow-2xl p-0 overflow-hidden">
        
        {/* Modern Flat Header with Close Button */}
        <div className="relative bg-white border-b-2 border-[#E8F9FF]">
          {/* Close Button - Top Right */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-5 top-5 w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 group z-10"
            aria-label="Tutup dialog"
          >
            <X className="w-4.5 h-4.5 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" />
          </button>
          
          <div className="px-6 py-5 flex items-center gap-5">
            {/* Avatar with Ring */}
            <div className="relative">
              <Avatar className="w-16 h-16 ring-2 ring-[#E8F9FF] ring-offset-2">
                <AvatarImage src={member.photo} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-[#C5BAFF] to-[#E8F9FF] text-[#001B55] text-lg font-bold">
                  {member.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              {/* Status Indicator */}
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${member.status === "active" ? "bg-green-500" : "bg-gray-400"}`}></div>
            </div>
            
            {/* Member Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-[#001B55] mb-1 truncate">{member.name}</h2>
              <p className="text-sm text-gray-600 mb-2.5 truncate">{member.position}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={`${departmentConfig[member.department]?.className} border-0 px-2.5 py-0.5 text-xs font-medium`}>
                  {departmentConfig[member.department]?.label}
                </Badge>
                <Badge variant="outline" className={`border-0 px-2.5 py-0.5 text-xs font-medium ${member.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {member.status === "active" ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
            </div>
            
            {/* Print Button - Clean */}
            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-[#E8F9FF] hover:bg-[#C5BAFF] text-[#001B55] border-0 rounded-lg px-4 py-2.5 gap-2 transition-all duration-200 font-medium shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Cetak
            </Button>
          </div>
        </div>

        {/* Full Horizontal Content - No Scroll */}
        <div className="h-[calc(90vh-140px)] p-4 overflow-hidden">
          <div className="flex gap-3 h-full">
            
            {/* Section 1 - Personal Data & KTP */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              {/* Personal Information */}
              <BlueBorderCard className="p-3 flex-1">
                <h3 className="text-xs font-semibold text-[#001B55] mb-2 flex items-center gap-2">
                  <CreditCard className="w-3 h-3" />
                  Data Pribadi
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 text-[10px]">NIK</span>
                    <p className="font-medium truncate">{member.nik || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px]">No. KTA</span>
                    <p className="font-medium truncate">{member.ktaNumber || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px]">Email</span>
                    <p className="font-medium truncate">{member.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px]">Telepon</span>
                    <p className="font-medium truncate">{member.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px]">Status</span>
                    <p className="font-medium truncate">{member.maritalStatus || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px]">Keluarga</span>
                    <p className="font-medium truncate">{member.familyCount ? `${member.familyCount} orang` : "-"}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 text-[10px]">Alamat</span>
                    <p className="font-medium truncate">{member.address}</p>
                  </div>
                </div>
              </BlueBorderCard>

              {/* KTP Photo */}
              <BlueBorderCard className="p-3 h-48">
                <h3 className="text-xs font-semibold text-[#001B55] mb-2 flex items-center gap-2">
                  <CreditCard className="w-3 h-3" />
                  Foto KTP
                </h3>
                {member.ktpPhotoUrl ? (
                  <div className="flex items-center justify-center h-full">
                    <img
                      src={member.ktpPhotoUrl}
                      alt="Foto KTP"
                      className="max-w-full max-h-32 h-auto rounded border border-gray-300"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded border border-dashed border-gray-300">
                    <div className="text-center">
                      <CreditCard className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-[10px] text-gray-500">Belum ada foto KTP</p>
                    </div>
                  </div>
                )}
              </BlueBorderCard>
            </div>

            {/* Section 2 - Membership & Description */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              {/* Membership Information */}
              <BlueBorderCard className="p-3 flex-1">
                <h3 className="text-xs font-semibold text-[#001B55] mb-2 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Data Keanggotaan
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-500 text-[10px]">Tanggal Bergabung</span>
                    <p className="font-medium">
                      {new Date(member.joinDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px]">Jabatan</span>
                    <p className="font-medium truncate">{member.position}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px]">Departemen</span>
                    <p className="font-medium">{departmentConfig[member.department]?.label}</p>
                  </div>
                  {member.region && (
                    <div>
                      <span className="text-gray-500 text-[10px]">Kecamatan</span>
                      <p className="font-medium truncate">{member.region}</p>
                    </div>
                  )}
                  {member.subDepartment && (
                    <div>
                      <span className="text-gray-500 text-[10px]">Desa</span>
                      <p className="font-medium truncate">{member.subDepartment}</p>
                    </div>
                  )}
                </div>
              </BlueBorderCard>

              {/* Description */}
              <BlueBorderCard className="p-3 flex-1">
                <h3 className="text-xs font-semibold text-[#001B55] mb-2 flex items-center gap-2">
                  <User className="w-3 h-3" />
                  Biodata & Deskripsi
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-6">
                  {member.description || "Belum ada deskripsi"}
                </p>
              </BlueBorderCard>

              {/* Last Activity */}
              {member.lastActivity && (
                <BlueBorderCard className="p-3 h-20">
                  <h3 className="text-xs font-semibold text-[#001B55] mb-2 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Aktivitas Terakhir
                  </h3>
                  <p className="text-xs text-gray-700 line-clamp-2">{member.lastActivity}</p>
                </BlueBorderCard>
              )}
            </div>

            {/* Section 3 - Benefits & Achievements */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              {/* Benefits */}
              {member.benefits && member.benefits.length > 0 && (
                <BlueBorderCard className="p-3 flex-1">
                  <h3 className="text-xs font-semibold text-[#001B55] mb-2 flex items-center gap-2">
                    <Briefcase className="w-3 h-3" />
                    Program & Bantuan
                  </h3>
                  <ul className="space-y-1 max-h-24 overflow-y-auto">
                    {member.benefits.map((benefit, i) => (
                      <li key={i} className="text-[10px] flex items-start gap-1 p-1 bg-[#E8F9FF] rounded">
                        <div className="w-1 h-1 bg-[#001B55] rounded-full mt-0.5 flex-shrink-0" />
                        <span className="font-medium truncate">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </BlueBorderCard>
              )}

              {/* Achievements */}
              {member.achievements && member.achievements.length > 0 && (
                <BlueBorderCard className="p-3 flex-1">
                  <h3 className="text-xs font-semibold text-[#001B55] mb-2 flex items-center gap-2">
                    <Trophy className="w-3 h-3" />
                    Pencapaian & Prestasi
                  </h3>
                  <ul className="space-y-1 max-h-24 overflow-y-auto">
                    {member.achievements.map((achievement, i) => (
                      <li key={i} className="text-[10px] flex items-start gap-1 p-1 bg-yellow-50 rounded">
                        <Trophy className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium truncate">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </BlueBorderCard>
              )}

              {/* Organization Info - DPRT for Kader */}
              {member.department === "kader" && member.region && member.subDepartment && (
                <BlueBorderCard className="p-3 flex-1">
                  <h3 className="text-xs font-semibold text-[#001B55] mb-2 flex items-center gap-2">
                    <Building className="w-3 h-3" />
                    Informasi DPRT
                  </h3>
                  {(() => {
                    const dprtLeader = getDPRTLeader(member.region!, member.subDepartment!);
                    const totalKaders = getKaderCount(member.region!, member.subDepartment!);
                    
                    return (
                      <div className="space-y-2">
                        {dprtLeader ? (
                          <>
                            <div className="flex items-center gap-2 p-1 bg-[#E8F9FF] rounded">
                              <div className="w-6 h-6 bg-[#001B55] rounded flex items-center justify-center flex-shrink-0">
                                <UserCheck className="w-3 h-3 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[9px] text-gray-500">Ketua DPRT</p>
                                <p className="text-xs font-bold text-[#001B55] truncate">{dprtLeader.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-1 bg-green-50 rounded">
                              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                                <Users className="w-3 h-3 text-white" />
                              </div>
                              <div>
                                <p className="text-[9px] text-gray-500">Total Kader</p>
                                <p className="text-xs font-bold text-green-700">{totalKaders} orang</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 p-1 bg-orange-50 rounded border border-orange-200">
                            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
                              <AlertTriangle className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-[10px] text-orange-900 font-bold truncate">Belum ada Ketua DPRT</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </BlueBorderCard>
              )}

              {/* Kader yang Dibawahi - untuk DPRT */}
              {member.department === "dprt" && member.region && member.subDepartment && (
                <BlueBorderCard className="p-3 h-20">
                  <h3 className="text-xs font-semibold text-[#001B55] mb-2 flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    Kader Dibawahi
                  </h3>
                  {(() => {
                    const kaderCount = members.filter(
                      (m) =>
                        m.department === "kader" &&
                        m.region === member.region &&
                        m.subDepartment === member.subDepartment
                    ).length;
                    
                    return (
                      <div className="flex items-center justify-between p-1 bg-amber-50 rounded">
                        <div className="min-w-0 flex-1">
                          <p className="text-amber-900 font-bold text-xs truncate">
                            {kaderCount > 0 ? `${kaderCount} kader aktif` : "Belum ada kader"}
                          </p>
                          <p className="text-[9px] text-amber-700 truncate">Desa {member.subDepartment}</p>
                        </div>
                        <Badge className="bg-amber-500 text-white hover:bg-amber-600 px-1 py-0.5 text-[10px]">
                          {kaderCount}
                        </Badge>
                      </div>
                    );
                  })()}
                </BlueBorderCard>
              )}

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#001B55]/20 px-4 py-3 bg-gray-50/50 flex items-center justify-between">
          <BlueBorderButton onClick={() => onOpenChange(false)}>
            Tutup
          </BlueBorderButton>
          <BlueBorderButton onClick={handlePrint} className="bg-[#001B55] hover:bg-[#001B55]/90 text-white border-[#001B55]">
            <Printer className="w-4 h-4 mr-2" />
            Cetak
          </BlueBorderButton>
        </div>

      </DialogContent>
    </Dialog>
  );
}
