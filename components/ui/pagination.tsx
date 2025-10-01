import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

interface SimplePaginationProps {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  totalItems?: number;
}

export function SimplePagination({
  page,
  totalPages,
  onChange,
  totalItems,
}: SimplePaginationProps) {
  if (totalPages <= 1) return null;
  const paginateTo = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    onChange(nextPage);
  };

  const buildPages = (): (number | "ellipsis")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const pages: (number | "ellipsis")[] = [1];
    const siblings = 1;
    const leftBound = Math.max(2, page - siblings);
    const rightBound = Math.min(totalPages - 1, page + siblings);

    if (leftBound > 2) {
      pages.push("ellipsis");
    }

    for (let p = leftBound; p <= rightBound; p++) {
      pages.push(p);
    }

    if (rightBound < totalPages - 1) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);
    return pages;
  };

  const pages = buildPages();
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 md:flex-row md:items-center md:justify-between">
      <div className="text-xs md:text-sm text-[#6B7280]">
        Halaman <span className="font-semibold text-[#001B55]">{page}</span> dari {totalPages}
        {typeof totalItems === "number" && (
          <span className="ml-2 text-xs md:text-sm">({totalItems} data)</span>
        )}
      </div>
      <Pagination className="w-full md:w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault();
                paginateTo(page - 1);
              }}
              className={cn(
                "rounded-lg",
                page === 1 && "pointer-events-none opacity-40"
              )}
            />
          </PaginationItem>
          {pages.map((p, idx) => (
            <PaginationItem key={`${p}-${idx}`}>
              {p === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(event) => {
                    event.preventDefault();
                    paginateTo(p);
                  }}
                  className={cn(
                    "rounded-lg",
                    p === page && "border-[#001B55] text-[#001B55]"
                  )}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault();
                paginateTo(page + 1);
              }}
              className={cn(
                "rounded-lg",
                page === totalPages && "pointer-events-none opacity-40"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
