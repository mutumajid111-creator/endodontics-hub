import Link from "next/link";
import { createPublicSupabaseClient } from "@/lib/supabase-public";

export const metadata = { title: "Clinical Cases | Endodontics Hub" };
export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const supabase = createPublicSupabaseClient();
  const { data: cases } = await supabase
    .from("cases")
    .select("id,title,slug,summary,category,tooth")
    .eq("status", "published")
    .order("published_at", { ascending: false });

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
        {!cases?.length ? <div className="archiveEmpty"><h2>No published cases yet.</h2><p>Published clinical cases will appear here automatically.</p></div> : cases.map((c, i) => (
          <article className="archiveCard" key={c.id}>
            <div className="archiveVisual"><span>{String(i + 1).padStart(2, "0")}</span><div className="xrayTooth"><b></b><b></b><b></b></div></div>
            <div className="archiveBody"><div className="caseMeta darkText"><span>{c.category || "Clinical Case"}</span><span>{c.tooth || "Endodontics"}</span></div><h2>{c.title}</h2><p>{c.summary}</p><Link href={`/cases/${c.slug}`}>Open full case →</Link></div>
          </article>
        ))}
      </section>
    </main>
  );
}
