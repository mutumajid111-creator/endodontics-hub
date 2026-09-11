import Link from "next/link";
import Brand from "@/components/Brand";
import { createPublicSupabaseClient } from "@/lib/supabase-public";

export const metadata = { title: "Clinical Cases | Dr. Muthanna Majid" };
export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const supabase = createPublicSupabaseClient();
  const { data: cases } = await supabase.from("case_catalog").select("id,title,slug,summary,category,tooth,access_level,published_at").order("published_at", { ascending: false });

  return <main>
    <header className="header"><div className="shell nav"><Brand/><nav className="navlinks"><Link href="/cases">Cases</Link><Link href="/lectures">Lectures</Link><Link href="/research">Research</Link><Link href="/pricing">Membership</Link></nav><Link href="/account" className="navcta">My account</Link></div></header>
    <section className="pageHero shell"><p className="eyebrow">CLINICAL CASE LIBRARY</p><h1>Real cases. Clear reasoning.</h1><p>Published cases remain visible in the catalog. Subscriber cases are unlocked automatically when your membership is active.</p></section>
    <section className="shell caseArchive">
      {!cases?.length ? <div className="emptyPremium"><h2>No published cases yet.</h2><p>New cases will appear here automatically.</p></div> : cases.map((c,i)=><article className="archiveCard" key={c.id}>
        <div className="archiveVisual"><span>{String(i+1).padStart(2,"0")}</span><div className="xrayTooth"><b></b><b></b><b></b></div></div>
        <div className="archiveBody"><div className="caseMeta darkText"><span>{c.category||"Clinical Case"}</span><span>{c.tooth||"Endodontics"}</span></div><h2>{c.title}</h2><p>{c.summary}</p><div className="memberActions"><Link href={`/cases/${c.slug}`} className="btn secondary">{c.access_level==="subscriber"?"🔒 Open subscriber case":"Open free case"}</Link>{c.access_level==="subscriber"&&<Link href="/pricing" className="btn primary">Membership</Link>}</div></div>
      </article>)}
    </section>
  </main>;
}
