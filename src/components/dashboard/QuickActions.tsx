import { Plus, FileText, Image, Users, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { SafeLink } from "@/src/components/layout/SafeLink";
import { cn } from "@/src/lib/utils";

const quickActions = [
  {
    title: "Tulis Berita",
    description: "Buat artikel baru",
    href: "/admin/news/create",
    icon: FileText,
    color: "text-nasdem-blue",
  },
  {
    title: "Upload Media",
    description: "Tambah foto/video",
    href: "/admin/gallery",
    icon: Image, 
    color: "text-nasdem-orange",
  },
  {
    title: "Kelola Struktur",
    description: "Update pengurus",
    href: "/admin/structure/dpd",
    icon: Users,
    color: "text-nasdem-blue",
  },
];

export function QuickActions() {
  return (
    <div className="space-y-3">
      {quickActions.map((action) => (
        <SafeLink key={action.title} to={action.href}>
          <div className="group p-4 rounded-lg border border-gray-200 hover:border-nasdem-orange hover:bg-gray-50 transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg bg-gray-100 group-hover:bg-white transition-colors",
                action.color
              )}>
                <action.icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-900 group-hover:text-nasdem-blue">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {action.description}
                </p>
              </div>
              
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-nasdem-orange group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </div>
        </SafeLink>
      ))}
      
      <div className="pt-3 border-t border-gray-200">
        <Button 
          variant="outline" 
          className="w-full h-10 rounded-lg border-nasdem-blue text-nasdem-blue hover:bg-nasdem-blue hover:text-white transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Lihat Semua
        </Button>
      </div>
    </div>
  );
}