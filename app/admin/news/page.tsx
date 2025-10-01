import { Plus, Newspaper, FileText } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { AdminLayout } from "../components/layout/AdminLayout";
import { SafeLink } from "../components/layout/SafeLink";
import { NewsTable } from "../components/news/NewsTable";

export default function News() {
  const breadcrumbs = [{ label: "Dashboard", href: "/admin" }, { label: "Berita" }];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Hero Header with Gradient Background */}
        <div 
          className="relative rounded-3xl p-8 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #001B55 0%, #002266 100%)",
            boxShadow: "0 20px 60px -12px rgba(0, 27, 85, 0.25)",
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9C04]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF9C04]/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FF9C04]/20 backdrop-blur-sm flex items-center justify-center">
                  <Newspaper className="w-6 h-6 text-[#FF9C04]" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                    Kelola Berita
                  </h1>
                  <p className="text-white/70 text-base lg:text-lg mt-1">
                    Buat, edit, dan kelola semua artikel untuk publikasi website
                  </p>
                </div>
              </div>
            </div>
            <SafeLink to="/admin/news/create">
              <Button 
                className="group relative overflow-hidden rounded-2xl px-6 py-3 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #FF9C04 0%, #FFB04A 100%)",
                }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2 text-white">
                  <Plus className="w-5 h-5" />
                  Tulis Berita Baru
                </span>
              </Button>
            </SafeLink>
          </div>
        </div>

        {/* Enhanced News Table Section */}
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#001B55]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#001B55]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#001B55]">Daftar Berita</h2>
                <p className="text-sm text-gray-600">Kelola dan publikasikan konten berita</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <NewsTable />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
