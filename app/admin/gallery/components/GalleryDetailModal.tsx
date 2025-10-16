"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ActivityMediaItem {
  id: number;
  type: "image" | "video";
  url: string;
  caption?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  media: ActivityMediaItem[];
  onEdit?: () => void;
  onDelete?: () => void;
  // Optional public details pane
  description?: string;
  uploadDate?: string | Date;
  location?: string;
  category?: string;
  // Auto play for media slider (in seconds). If not provided, defaults to disabled.
  autoPlaySeconds?: number;
}

export function GalleryDetailModal({
  open,
  onOpenChange,
  title,
  media,
  onEdit,
  onDelete,
  description,
  uploadDate,
  location,
  category,
  autoPlaySeconds,
}: Props) {
  const [index, setIndex] = useState(0);
  const current = media[index];

  const prev = () => setIndex((i) => (i - 1 + media.length) % media.length);
  const next = () => setIndex((i) => (i + 1) % media.length);

  // Auto slide when enabled and there are multiple media items
  // Only runs while modal is open
  const delay =
    typeof autoPlaySeconds === "number" && autoPlaySeconds > 0
      ? autoPlaySeconds * 1000
      : undefined;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (!open || !delay || media.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % media.length);
    }, delay);
    return () => clearInterval(id);
  }, [open, delay, media.length]);

  const showDetails = Boolean(
    description || uploadDate || location || category || onEdit || onDelete
  );
  const formattedDate = uploadDate
    ? new Date(uploadDate).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[75vw] sm:w-[85vw] md:w-[75vw] h-auto !max-w-none">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div
          className={
            showDetails ? "grid grid-cols-1 md:grid-cols-2 gap-6" : undefined
          }
        >
          {/* Left: media slider */}
          <div className="relative w-full aspect-video bg-gray-300 rounded-md overflow-hidden">
            {current?.type === "image" ? (
              <Image
                src={current.url}
                alt={current.caption || title}
                fill
                className="object-contain"
              />
            ) : current ? (
              <iframe
                src={current.url}
                className="w-full h-full object-contain"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : null}

            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            {current?.caption && (
              <div className="absolute inset-x-0 bottom-0 p-4 z-10">
                <p className="text-white text-sm drop-shadow-md max-w-[90%]">
                  {current.caption}
                </p>
              </div>
            )}

            {media.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prev}
                  className="cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={next}
                  className="cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Right: details (optional) */}
          {showDetails && (
            <div className="space-y-5">
              {description && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-muted-foreground mb-1">
                    Deskripsi
                  </h4>
                  <p className="text-sm leading-relaxed">{description}</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formattedDate && (
                  <div>
                    <div className="text-base font-semibold text-muted-foreground">
                      Tanggal Upload
                    </div>
                    <div className="text-sm">{formattedDate}</div>
                  </div>
                )}
                {location && (
                  <div>
                    <div className="text-base font-semibold text-muted-foreground">
                      Lokasi
                    </div>
                    <div className="text-sm">{location}</div>
                  </div>
                )}
                {category && (
                  <div>
                    <div className="text-base font-semibold text-muted-foreground">
                      Kategori
                    </div>
                    <div className="mt-1">
                      <Badge className={categoryBadgeClass(category)}>
                        {category}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {(onEdit || onDelete) && (
          <DialogFooter>
            <div className="flex justify-end gap-2 pt-2">
              {onDelete && (
                <Button
                  variant="outline"
                  onClick={onDelete}
                  className="cursor-pointer !bg-red-600 !hover:bg-red-700 !hover:text-white text-white border-transparent"
                >
                  Hapus
                </Button>
              )}
              {onEdit && (
                <Button
                  onClick={onEdit}
                  className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Edit
                </Button>
              )}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function categoryBadgeClass(cat?: string) {
  const c = (cat || "").toLowerCase();
  switch (c) {
    case "sosial":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "politik":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "pendidikan":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
    case "kaderisasi":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "internal":
      return "bg-slate-100 text-slate-800 hover:bg-slate-100";
    case "kolaborasi":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    case "pelayanan":
      return "bg-cyan-100 text-cyan-800 hover:bg-cyan-100";
    case "publikasi":
      return "bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
}
