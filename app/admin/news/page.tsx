import { Plus, Newspaper, FileText } from "lucide-react";
import { AdminLayout } from "../components/layout/AdminLayout";
import { SafeLink } from "../components/layout/SafeLink";
import { NewsTable } from "../components/news/NewsTable";
import { PageHeader } from "../components/ui/PageHeader";
import { ContentCard } from "../components/ui/ContentCard";
import { ActionButton } from "../components/ui/ActionButton";

export default function News() {
  const breadcrumbs = [{ label: "Dashboard", href: "/admin" }, { label: "Berita" }];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          icon={<Newspaper className="w-6 h-6 text-[#001B55]" />}
          title="Kelola Berita"
          description="Buat, edit, dan kelola semua artikel untuk publikasi website"
          action={
            <SafeLink to="/admin/news/create">
              <ActionButton icon={<Plus className="w-4 h-4" />} variant="primary">
                Tulis Berita Baru
              </ActionButton>
            </SafeLink>
          }
        />

        {/* News Table Section */}
        <ContentCard
          title="Daftar Berita"
          description="Kelola dan publikasikan konten berita"
          icon={<FileText className="w-5 h-5 text-[#001B55]" />}
        >
          <NewsTable />
        </ContentCard>
      </div>
    </AdminLayout>
  );
}
