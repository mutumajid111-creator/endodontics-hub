import Link from "next/link";

export default function Brand({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className={`brand ${compact ? "brandCompact" : ""}`} aria-label="Dr. Muthanna Majid home">
      <span className="brandEmblem" aria-hidden="true">
        <svg viewBox="0 0 72 72" role="img">
          <path d="M16 16C22 7 32 6 36 15C40 6 50 7 56 16C62 27 58 42 51 56C47 64 43 66 40 55L36 42L32 55C29 66 25 64 21 56C14 42 10 27 16 16Z" fill="none" stroke="currentColor" strokeWidth="3"/>
          <path d="M24 43V22L36 38L48 22V43" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M47 50L61 36" stroke="#d6a938" strokeWidth="3" strokeLinecap="round"/>
          <path d="M58 34L63 39M55 37L60 42" stroke="#d6a938" strokeWidth="2"/>
        </svg>
      </span>
      <span className="brandText"><strong>Muthanna Majid</strong><small>ENDODONTICS · EDUCATION · CLINICAL CASES</small></span>
    </Link>
  );
}
