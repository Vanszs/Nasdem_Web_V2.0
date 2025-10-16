"use client";

export function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="border-2 border-gray-200 rounded-lg overflow-hidden"
        >
          <div className="aspect-[4/3] bg-gray-300 animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-300 w-1/3 rounded" />
            <div className="h-3 bg-gray-300 w-2/3 rounded" />
            <div className="h-3 bg-gray-300 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
