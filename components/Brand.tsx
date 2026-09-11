import Link from "next/link";

export default function Brand({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className={`brand ${compact ? "brandCompact" : ""}`} aria-label="Dr. Muthanna Majid home">
      <span className="brandEmblem brandEmblemImage" aria-hidden="true">
        <img src="/muthanna-logo.webp" alt="" />
      </span>
      <span className="brandText"><strong>Muthanna Majid</strong><small>ENDODONTICS · EDUCATION · CLINICAL CASES</small></span>
    </Link>
  );
}
