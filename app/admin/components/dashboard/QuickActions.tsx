import {
  Plus,
  FileText,
  Image,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SafeLink } from "../layout/SafeLink";

const quickActions = [
  {
    title: "Tulis Berita Baru",
    description: "Buat artikel dan publikasi berita terbaru",
    href: "/news/create",
    icon: FileText,
    gradient: "from-[#001B55]/10 via-[#001B55]/5 to-transparent",
    iconBg: "from-[#001B55] to-[#001B55]/80",
  },
  {
    title: "Upload Media",
    description: "Tambah foto, video dan galeri baru",
    href: "/gallery/upload",
    icon: Image,
    gradient: "from-[#FF9C04]/10 via-[#FF9C04]/5 to-transparent",
    iconBg: "from-[#FF9C04] to-[#FF9C04]/80",
  },
  {
    title: "Kelola Struktur",
    description: "Update data pengurus dan organisasi",
    href: "/structure/dpd",
    icon: Users,
    gradient: "from-[#001B55]/10 via-[#FF9C04]/5 to-transparent",
    iconBg: "from-[#001B55] to-[#FF9C04]",
  },
  {
    title: "Dashboard Analytics",
    description: "Lihat statistik dan performa sistem",
    href: "/analytics",
    icon: Sparkles,
    gradient: "from-[#FF9C04]/10 via-[#001B55]/5 to-transparent",
    iconBg: "from-[#FF9C04] to-[#001B55]",
  },
];

export function QuickActions() {
  return (
    <div className="space-y-3">
      {quickActions.map((action, index) => (
        <SafeLink key={action.title} to={action.href}>
          <div
            className={cn(
              "group/item relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer",
              "bg-gradient-to-br",
              action.gradient,
              "border-2 border-gray-200/70 hover:border-[#FF9C04]/40"
            )}
          >
            {/* Enhanced Hover Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#001B55]/8 via-[#FF9C04]/8 to-[#001B55]/8 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />

            <div className="relative flex items-center gap-4">
              {/* Enhanced Icon */}
              <div
                className={cn(
                  "flex-shrink-0 p-3 rounded-2xl transition-all duration-300 group-hover/item:scale-110 border border-white/30",
                  "bg-gradient-to-br",
                  action.iconBg,
                  "shadow-lg group-hover/item:shadow-xl"
                )}
              >
                <action.icon className="h-5 w-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground group-hover/item:text-[#001B55] transition-colors duration-300">
                  {action.title}
                </h4>
                <p className="text-xs text-muted-foreground group-hover/item:text-muted-foreground/80 transition-colors duration-300 line-clamp-2">
                  {action.description}
                </p>
              </div>

              {/* Enhanced Arrow */}
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover/item:text-[#FF9C04] group-hover/item:translate-x-1 transition-all duration-300 flex-shrink-0" />
            </div>

            {/* Enhanced Decorative Elements */}
            <div className="absolute -top-1 -right-1 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
          </div>
        </SafeLink>
      ))}

      {/* Enhanced Add More Button - Non-glossy */}
      <div className="pt-4 border-t border-gray-200/60">
        <Button
          variant="outline"
          className="w-full h-12 rounded-2xl bg-white border-2 border-gray-300 hover:border-[#FF9C04] hover:bg-[#FF9C04]/5 text-[#001B55] hover:text-[#FF9C04] transition-all duration-300 group/add font-medium"
        >
          <Plus className="h-4 w-4 mr-2 group-hover/add:rotate-90 transition-transform duration-300" />
          <span className="font-medium">Lihat Semua Menu</span>
        </Button>
      </div>
    </div>
  );
}
