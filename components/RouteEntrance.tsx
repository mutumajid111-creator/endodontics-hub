"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function RouteEntrance({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const publicPage = !pathname.startsWith("/admin");
  return <div key={pathname} className={publicPage ? "routeEntrance" : undefined}>{children}</div>;
}
