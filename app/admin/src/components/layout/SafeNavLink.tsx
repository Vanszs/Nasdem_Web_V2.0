"use client";

import { ReactNode, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SafeNavLinkProps {
  to: string;
  children: ReactNode;
  className?: string | ((props: { isActive: boolean }) => string);
}

export function SafeNavLink({ to, children, className }: SafeNavLinkProps) {
  const pathname = usePathname();
  const isActive = useMemo(() => pathname === to, [pathname, to]);

  const computedClassName = typeof className === "function"
    ? className({ isActive })
    : className;

  return (
    <Link href={to} className={computedClassName}>
      {children}
    </Link>
  );
}
