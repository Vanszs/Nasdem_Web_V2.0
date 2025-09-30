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
} from "lucide-react";
import { Member } from "../types";

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
  if (!member) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-6xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800 mb-4">
            Biodata Anggota
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative mx-auto w-48 h-48 mb-4">
                <div className="absolute -inset-3 bg-gradient-to-r from-[#001B55] via-[#FF9C04] to-[#001B55] rounded-full blur-lg opacity-30" />
                <Avatar className="relative w-full h-full border-4 border-white/50 shadow-2xl">
                  <AvatarImage
                    src={member.photo}
                    className="object-cover"
                    alt={member.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 text-4xl font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {member.name}
              </h2>
              <p className="text-lg font-medium text-slate-600 mb-3">
                {member.position}
              </p>
              <div className="flex justify-center">
                <Badge
                  className={`${
                    departmentConfig[member.department]?.className
                  } px-6 py-2 text-base font-medium`}
                >
                  {departmentConfig[member.department]?.label}
                </Badge>
              </div>
              {member.region && (
                <p className="text-sm text-slate-500 mt-2 bg-slate-100 px-4 py-1 rounded-full inline-block">
                  Region: {member.region}
                </p>
              )}
              {member.subDepartment && (
                <p className="text-sm text-slate-500 mt-1 bg-slate-100 px-4 py-1 rounded-full inline-block">
                  {member.department === "dprt" || member.department === "kader"
                    ? "Desa"
                    : "Sub"}
                  : {member.subDepartment}
                </p>
              )}
            </div>

            {member.department === "kader" &&
              member.region &&
              member.subDepartment && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                  <h3 className="font-semibold text-blue-800 text-lg mb-3 flex items-center gap-2">
                    <Building className="h-5 w-5" /> Informasi DPRT
                  </h3>
                  {(() => {
                    const dprtLeader = getDPRTLeader(
                      member.region!,
                      member.subDepartment!
                    );
                    const totalKaders = getKaderCount(
                      member.region!,
                      member.subDepartment!
                    );
                    return (
                      <div className="space-y-3">
                        {dprtLeader ? (
                          <>
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-800">
                                  Ketua DPRT
                                </p>
                                <p className="text-blue-600 font-semibold">
                                  {dprtLeader.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-green-800">
                                  Total Kader
                                </p>
                                <p className="text-green-600 font-semibold">
                                  {totalKaders} orang di Desa{" "}
                                  {member.subDepartment}
                                </p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <AlertTriangle className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-orange-800 font-medium">
                                Belum ada Ketua DPRT
                              </p>
                              <p className="text-sm text-orange-600">
                                Desa {member.subDepartment} perlu ditugaskan
                                Ketua DPRT
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

            {member.department === "dprt" &&
              member.region &&
              member.subDepartment && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
                  <h3 className="font-semibold text-amber-800 text-lg mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5" /> Kader Dibawahi
                  </h3>
                  {(() => {
                    const kaderCount = members.filter(
                      (m) =>
                        m.department === "kader" &&
                        m.region === member.region &&
                        m.subDepartment === member.subDepartment
                    ).length;
                    return (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-700 font-medium">
                            {kaderCount > 0 ? (
                              <>{kaderCount} kader aktif di bawah pengawasan</>
                            ) : (
                              <>Belum ada kader yang diawasi</>
                            )}
                          </p>
                          <p className="text-sm text-amber-600">
                            Desa {member.subDepartment}, Kec. {member.region}
                          </p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                          Lihat detail
                        </Badge>
                      </div>
                    );
                  })()}
                </div>
              )}

            <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl">
              <h3 className="font-semibold text-slate-800 text-lg mb-4">
                Informasi Kontak
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Email</p>
                    <p className="text-slate-800">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Telepon
                    </p>
                    <p className="text-slate-800">{member.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Alamat</p>
                    <p className="text-slate-800 leading-relaxed">
                      {member.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 text-lg">
                Detail Informasi
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-slate-50/50 p-4 rounded-xl">
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Tanggal Bergabung
                  </p>
                  <p className="text-slate-800 font-semibold">
                    {new Date(member.joinDate).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-xl">
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Status
                  </p>
                  <Badge
                    variant={
                      member.status === "active" ? "default" : "secondary"
                    }
                    className="mt-1"
                  >
                    {member.status === "active" ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </div>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-xl">
                <p className="text-sm font-medium text-slate-600 mb-2">
                  Deskripsi
                </p>
                <p className="text-slate-800 leading-relaxed">
                  {member.description}
                </p>
              </div>
              {member.achievements?.length ? (
                <div className="bg-gradient-to-br from-blue-50/50 to-orange-50/50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <p className="text-sm font-medium text-slate-600">
                      Pencapaian
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {member.achievements.map((a, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-slate-700"
                      >
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />{" "}
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {member.lastActivity && (
                <div className="bg-green-50/50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-slate-600">
                      Aktivitas Terakhir
                    </p>
                  </div>
                  <p className="text-slate-700">{member.lastActivity}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {member.department === "dprt" &&
          member.region &&
          member.subDepartment && (
            <div className="mt-8 pt-6 border-t border-slate-200/50">
              <h3 className="font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-amber-600" /> Data Kader{" "}
                {member.subDepartment}
              </h3>
              {(() => {
                const kaderList = members.filter(
                  (m) =>
                    m.department === "kader" &&
                    m.region === member.region &&
                    m.subDepartment === member.subDepartment
                );
                if (!kaderList.length) {
                  return (
                    <div className="bg-white p-6 rounded-lg border border-slate-200 text-center">
                      <div className="mx-auto w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-3">
                        <AlertTriangle className="h-8 w-8 text-orange-400" />
                      </div>
                      <p className="text-slate-700 font-medium mb-1">
                        Belum ada kader di Desa {member.subDepartment}
                      </p>
                      <p className="text-sm text-slate-600 mb-4">
                        Segera lakukan rekrutmen kader
                      </p>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#001B55] to-[#003875] text-white"
                      >
                        Tambah Kader Baru
                      </Button>
                    </div>
                  );
                }
                return (
                  <div className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          {[
                            "No",
                            "Nama",
                            "Tanggal Lahir",
                            "Desa Bertugas",
                            "Status",
                          ].map((h) => (
                            <th
                              key={h}
                              className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {kaderList.map((k, i) => (
                          <tr
                            key={k.id}
                            className={
                              i % 2 === 0 ? "bg-slate-50/30" : "bg-white"
                            }
                          >
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {i + 1}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="text-sm font-medium text-slate-800">
                                  {k.name}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {new Date(
                                new Date("1970-01-01").getTime() +
                                  parseInt(k.id) * 10000000000
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              Desa {k.subDepartment}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  k.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-slate-100 text-slate-800"
                                }`}
                              >
                                {k.status === "active"
                                  ? "Aktif"
                                  : "Tidak Aktif"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-sm text-slate-600 font-medium">
                        Total {kaderList.length} kader
                      </span>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#001B55] to-[#003875] text-white"
                      >
                        Tambah Kader Baru
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200/50">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="px-6 text-primary"
          >
            Tutup
          </Button>
          <Button className="px-6 bg-gradient-to-r from-[#001B55] to-[#003875] text-white">
            Edit Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
