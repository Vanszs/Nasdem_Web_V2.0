"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  onCreate?: () => void;
}

export function GalleryHeader({ onCreate }: Props) {
  const router = useRouter();
  return (
    <div className="bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kelola Galeri</h1>
          <p className="text-muted-foreground">
            Upload dan organisir foto dan media
          </p>
        </div>
        <Button
          className="cursor-pointer bg-[#FF9C04] hover:bg-[#001B55] text-white border-2 border-[#FF9C04] hover:border-[#001B55] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          onClick={() =>
            onCreate ? onCreate() : router.push("/admin/gallery/upload")
          }
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>
    </div>
  );
}
