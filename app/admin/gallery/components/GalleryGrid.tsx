"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";
import Image from "next/image";

export interface GalleryGridItem {
  id: string;
  title: string;
  description: string;
  category:
    | "sosial"
    | "politik"
    | "pendidikan"
    | "kaderisasi"
    | "internal"
    | "kolaborasi"
    | "pelayanan"
    | "publikasi"
    | "lainnya";
  image: string;
  uploadDate: string;
  photographer?: string;
  location?: string;
  tags: string[];
  views: number;
}

const categoryConfig: Record<
  GalleryGridItem["category"],
  { label: string; className: string }
> = {
  sosial: {
    label: "Sosial",
    className: "bg-brand-primary text-white border-2 border-brand-primary/20",
  },
  politik: {
    label: "Politik",
    className: "bg-success text-white border-2 border-success/20",
  },
  pendidikan: {
    label: "Pendidikan",
    className: "bg-info text-white border-2 border-info/20",
  },
  kaderisasi: {
    label: "Kaderisasi",
    className: "bg-muted text-muted-foreground border-2 border-muted/20",
  },
  internal: {
    label: "Internal",
    className: "bg-muted text-muted-foreground border-2 border-muted/20",
  },
  kolaborasi: {
    label: "Kolaborasi",
    className: "bg-muted text-muted-foreground border-2 border-muted/20",
  },
  pelayanan: {
    label: "Pelayanan",
    className: "bg-muted text-muted-foreground border-2 border-muted/20",
  },
  publikasi: {
    label: "Publikasi",
    className: "bg-muted text-muted-foreground border-2 border-muted/20",
  },
  lainnya: {
    label: "Lainnya",
    className: "bg-muted text-muted-foreground border-2 border-muted/20",
  },
};

interface Props {
  items: GalleryGridItem[];
  onViewDetail: (id: string) => void;
}

export function GalleryGrid({ items, onViewDetail }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card
          key={item.id}
          className="border-2 border-gray-300/80 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
        >
          <div className="relative aspect-[4/3] bg-gray-300 flex items-center justify-center overflow-hidden">
            <Image
              src={item.image || "/placeholder.svg?height=300&width=400"}
              alt={item.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Eye className="h-4 w-4" />
                  {item.views}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs bg-white/20 hover:bg-white/30 text-white border-white/30 cursor-pointer"
                  onClick={() => onViewDetail(item.id)}
                >
                  Lihat Detail
                </Button>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge className={categoryConfig[item.category].className}>
                {categoryConfig[item.category].label}
              </Badge>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span>
                  {new Date(item.uploadDate).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>
            <h3 className="font-semibold text-sm mb-1 line-clamp-1">
              {item.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {item.description}
            </p>
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
