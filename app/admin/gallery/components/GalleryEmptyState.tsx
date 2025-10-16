"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <Button
        className="cursor-pointer bg-[#FF9C04] hover:bg-[#001B55] text-white border-2 border-[#FF9C04] hover:border-[#001B55] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        onClick={() => router.push("/admin/gallery/upload")}
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload Media
      </Button>
    </Card>
  );
}
