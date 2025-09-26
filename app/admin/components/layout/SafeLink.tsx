"use client";

import Link from "next/link";
import { forwardRef } from "react";

type SafeLinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export const SafeLink = forwardRef<HTMLAnchorElement, SafeLinkProps>(
  ({ children, to, className, prefetch, ...props }, ref) => {
    return (
      <Link ref={ref} href={to} className={className} prefetch={prefetch} {...props}>
        {children}
      </Link>
    );
  }
);

SafeLink.displayName = "SafeLink";
