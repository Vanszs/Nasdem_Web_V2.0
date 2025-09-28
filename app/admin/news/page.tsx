import { Plus, Newspaper, TrendingUp } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { AdminLayout } from "../components/layout/AdminLayout";
import { SafeLink } from "../components/layout/SafeLink";
import { NewsTable } from "../components/news/NewsTable";
import { Card, CardContent } from "../../../components/ui/card";

export default function News() {
  const breadcrumbs = [{ label: "Dashboard", href: "/admin" }, { label: "Berita" }];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-[#001B55] tracking-tight">
              Kelola Berita
            </h1>
            <p className="text-[#6B7280] text-lg leading-relaxed">
              Buat, edit, dan kelola semua artikel untuk publikasi website.
            </p>
          </div>
          <SafeLink to="/admin/news/create">
            <Button className="bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6 py-3 rounded-2xl">
              <Plus className="w-5 h-5 mr-2" />
              Tulis Berita
            </Button>
          </SafeLink>
        </div>

        {/* Enhanced News Table Section */}
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="border border-gray-200/50 rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
              <NewsTable />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
