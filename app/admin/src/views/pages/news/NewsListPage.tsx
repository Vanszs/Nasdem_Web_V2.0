import { Plus } from "lucide-react";
import { AdminLayout } from "../../../components/layout/AdminLayout";
import { Button } from "../../../components/ui/button";
import { NewsTable } from "../../../components/news/NewsTable";
import { SafeLink } from "../../../components/layout/SafeLink";

export function NewsListPage() {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Berita" }
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header Section with Border */}
        <div className="bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Kelola Berita</h1>
              <p className="text-muted-foreground">
                Buat, edit, dan kelola artikel untuk publikasi website.
              </p>
            </div>
            <SafeLink to="/news/create">
              <Button className="bg-[#FF9C04] hover:bg-[#FF9C04]/90 text-white font-semibold border-2 border-[#FF9C04]/20 hover:border-[#FF9C04]/40 focus-ring transition-all duration-300 shadow-lg hover:shadow-xl">
                <Plus className="mr-2 h-4 w-4" />
                Tulis Berita Baru
              </Button>
            </SafeLink>
          </div>
        </div>
        
        {/* News Table Section with Border */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <NewsTable />
        </div>
      </div>
    </AdminLayout>
  );
}