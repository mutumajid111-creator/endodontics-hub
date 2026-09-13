"use client";

import NextLink, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import type { ComponentProps } from "react";

function PendingScreen({ label }: { label: string }) {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return createPortal(
    <div className="navigationPending" role="status" aria-live="polite">
      <div><span className="navigationPendingLine" aria-hidden="true"/><small>ENDODONTICS HUB</small><strong>{label}</strong><span>Opening your next chapter…</span></div>
    </div>,
    document.body,
  );
}

type Props = ComponentProps<typeof NextLink> & { navItem?: boolean };

export default function ExperienceLink({ children, navItem, ...props }: Props) {
  const pathname = usePathname();
  const href = typeof props.href === "string" ? props.href : props.href.pathname || "";
  const label = href.startsWith("/cases") ? "Clinical Cases" : href.startsWith("/lectures") ? "Lectures" : href.startsWith("/books") || href.startsWith("/library") ? "Book Library" : href.startsWith("/research") ? "Research" : href.startsWith("/pricing") ? "Membership" : href.includes("login") ? "Welcome back" : "Endodontics Hub";
  const active = navItem && (pathname === href || pathname.startsWith(`${href}/`));
  return <NextLink {...props} aria-current={active ? "page" : props["aria-current"]}>{children}<PendingScreen label={label}/></NextLink>;
}
