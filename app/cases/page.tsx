import Link from "next/link";
import { clinicalCases } from "@/lib/content";

export const metadata = { title: "Clinical Cases | Endodontics Hub" };

export default function CasesPage() {
  return (
    <main>
      <header className="header">
        <div className="shell nav">
          <Link href="/" className="logo"><span className="mark">E</span><span><strong>ENDODONTICS</strong><small>HUB · DR. MUTHANNA MAJID</small></span></Link>
          <nav className="navlinks"><Link href="/cases">Cases</Link><Link href="/research">Research</Link><Link href="/admin">Admin</Link></nav>
          <Link href="/" className="navcta">Home</Link>
        </div>
      </header>

      <section className="pageHero shell">
        <p className="eyebrow">CLINICAL CASE LIBRARY</p>
        <h1>Documented endodontic cases.</h1>
        <p>Each case is structured around diagnosis, treatment sequence, technical decisions and outcome.</p>
      </section>

      <section className="shell caseArchive">
        {clinicalCases.map((c, i) => (
          <article className="archiveCard" key={c.slug}>
            <div className="archiveVisual"><span>{String(i + 1).padStart(2, "0")}</span><div className="xrayTooth"><b></b><b></b><b></b></div></div>
            <div className="archiveBody"><div className="caseMeta darkText"><span>{c.category}</span><span>{c.tooth}</span></div><h2>{c.title}</h2><p>{c.summary}</p><Link href={`/cases/${c.slug}`}>Open full case →</Link></div>
          </article>
        ))}
      </section>
    </main>
  );
}
