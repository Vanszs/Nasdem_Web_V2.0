"use client";

import { Card } from "@/components/ui/card";
import { Image, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export function GalleryEmptyState() {
  const router = useRouter();
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 hover:border-gray-300/90 shadow-lg hover:shadow-xl transition-all duration-300 p-12 text-center">
      <Image className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4 p-2 border-2 border-dashed border-gray-300/60 rounded-2xl" />
      <h3 className="text-lg font-semibold mb-2">Galeri Media</h3>
      <p className="text-muted-foreground mb-4">
        Unggah foto untuk mulai membangun galeri.
      </p>
    </Card>
  );
}
