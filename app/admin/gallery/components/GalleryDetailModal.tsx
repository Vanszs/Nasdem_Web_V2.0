"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
}

export function GalleryDetailModal({
  open,
  onOpenChange,
  title,
  media,
  onEdit,
  onDelete,
}: Props) {
  const [index, setIndex] = useState(0);
  const current = media[index];

  const prev = () => setIndex((i) => (i - 1 + media.length) % media.length);
  const next = () => setIndex((i) => (i + 1) % media.length);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
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
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : null}
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
        {current?.caption && (
          <p className="text-sm text-muted-foreground mt-2">
            {current.caption}
          </p>
        )}
        {(onEdit || onDelete) && (
          <div className="flex justify-end gap-2 pt-2">
            {onDelete && (
              <Button
                variant="outline"
                onClick={onDelete}
                className="cursor-pointer"
              >
                Hapus
              </Button>
            )}
            {onEdit && (
              <Button onClick={onEdit} className="cursor-pointer">
                Edit
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
