import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Users, Check, X, Clock } from "lucide-react";
import { Member } from "../types";

interface MemberCardProps {
  member: Member;
  onClick: (m: Member) => void;
  statusConfig: any;
  departmentConfig: any;
  getDPRTLeader: (region: string, subDepartment: string) => Member | undefined;
  getKaderCount: (region: string, subDepartment: string) => number;
}

export function MemberCard(props: MemberCardProps) {
  const {
    member,
    onClick,
    statusConfig,
    departmentConfig,
    getDPRTLeader,
    getKaderCount,
  } = props;
  return (
    <div
      onClick={() => onClick(member)}
      className="group relative overflow-hidden bg-white backdrop-blur-xl border border-white/40 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#001B55]/2 via-transparent to-[#FF9C04]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative p-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#001B55] via-[#FF9C04] to-[#001B55] rounded-full blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <Avatar className="relative w-16 h-16 ring-2 ring-white/60 shadow-md">
              <AvatarImage src={member.photo} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-[#001B55] to-[#001B55]/80 text-white text-sm font-bold">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1">
              <div className="w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center bg-[#16A34A]">
                {member.status === "active" ? (
                  <Check className="h-2.5 w-2.5" />
                ) : member.status === "inactive" ? (
                  <X className="h-2.5 w-2.5" />
                ) : (
                  <Clock className="h-2.5 w-2.5" />
                )}
              </div>
            </div>
          </div>
          <div className="text-center space-y-2 w-full">
            <h3 className="text-sm font-bold text-[#001B55] leading-tight group-hover:text-[#001B55]/80 transition-colors">
              {member.name}
            </h3>
            <Badge
              className={`${
                departmentConfig[member.department]?.className
              } px-2 py-0.5 rounded-lg font-medium text-xs`}
            >
              {departmentConfig[member.department]?.label}
            </Badge>
            <p className="text-xs font-medium text-[#6B7280]">
              {member.position}
            </p>
            {member.subDepartment && (
              <div className="bg-[#F0F0F0]/60 p-2 rounded-lg">
                <p className="text-xs text-[#6B7280] font-medium">
                  Desa {member.subDepartment}
                </p>
                {member.department === "kader" && (
                  <div className="mt-1 text-xs text-[#001B55] font-medium">
                    {(() => {
                      const dprtLeader = getDPRTLeader(
                        member.region || "",
                        member.subDepartment!
                      );
                      return dprtLeader
                        ? `DPRT: ${dprtLeader.name
                            .split(" ")
                            .slice(0, 2)
                            .join(" ")}`
                        : "DPRT: Belum ada ketua";
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {member.department === "dprt" &&
          member.region &&
          member.subDepartment && (
            <div className="mt-3 bg-[#FF9C04]/10 p-2 rounded-lg border border-[#FF9C04]/20">
              <div className="flex items-center gap-1 mb-1">
                <Users className="h-3 w-3 text-[#FF9C04]" />
                <span className="text-xs font-semibold text-[#FF9C04]">
                  Kader
                </span>
              </div>
              <div className="text-xs text-[#6B7280]">
                {(() => {
                  const count = getKaderCount(
                    member.region!,
                    member.subDepartment!
                  );
                  return count > 0 ? `${count} aktif` : "Belum ada";
                })()}
              </div>
            </div>
          )}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-5 h-5 bg-[#001B55]/10 rounded-full flex items-center justify-center">
              <Mail className="h-3 w-3 text-[#001B55]" />
            </div>
            <span className="text-[#6B7280] truncate">{member.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-5 h-5 bg-[#16A34A]/10 rounded-full flex items-center justify-center">
              <Phone className="h-3 w-3 text-[#16A34A]" />
            </div>
            <span className="text-[#6B7280]">{member.phone}</span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <div className="w-5 h-5 bg-[#C81E1E]/10 rounded-full flex items-center justify-center mt-0.5">
              <MapPin className="h-3 w-3 text-[#C81E1E]" />
            </div>
            <span className="text-[#6B7280] line-clamp-2 leading-relaxed">
              {member.address}
            </span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-[#F0F0F0] flex items-center justify-between">
          <Badge
            className={`${
              statusConfig[member.status].className
            } px-2 py-0.5 rounded-md text-xs font-medium`}
          >
            {statusConfig[member.status].label}
          </Badge>
          <span className="text-xs text-[#6B7280] font-medium">
            {new Date(member.joinDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
