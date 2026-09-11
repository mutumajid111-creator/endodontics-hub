import Link from "next/link";
import Brand from "@/components/Brand";
import { createPublicSupabaseClient } from "@/lib/supabase-public";

export const metadata = { title: "Clinical Cases | Dr. Muthanna Majid" };
export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const supabase = createPublicSupabaseClient();
  const { data: cases } = await supabase.from("case_catalog").select("id,title,slug,summary,category,tooth,access_level,published_at").order("published_at", { ascending: false });

  return <main className="casesExperience">
    <header className="header"><div className="shell nav"><Brand/><nav className="navlinks"><Link href="/cases">Cases</Link><Link href="/lectures">Lectures</Link><Link href="/research">Research</Link><Link href="/pricing">Membership</Link></nav><Link href="/account" className="navcta">My account</Link></div></header>
    <section className="casesHero shell"><div><p className="eyebrow">CASE ARCHIVE · DR. MUTHANNA MAJID</p><h1>Clinical endodontics,<br/><em>documented with purpose.</em></h1><p>Diagnosis, treatment sequence and clinical decisions presented as a clean visual archive for serious endodontic learning.</p></div><div className="casesHeroStat"><strong>{String(cases?.length||0).padStart(2,"0")}</strong><span>PUBLISHED<br/>CASES</span></div></section>
    <section className="shell casesEditorial">
      {!cases?.length ? <div className="emptyPremium"><h2>No published cases yet.</h2><p>New cases will appear here automatically.</p></div> : cases.map((c,i)=><article className="caseEditorialCard" key={c.id}>
        <div className="caseIndex">{String(i+1).padStart(2,"0")}</div>
        <div className="caseEditorialVisual"><div className="caseTooth"><i></i><i></i><i></i></div><span>CLINICAL RECORD</span></div>
        <div className="caseEditorialBody"><div className="caseTags"><span>{c.category||"Clinical Case"}</span><span>{c.tooth||"Endodontics"}</span>{c.access_level==="subscriber"&&<span className="premiumTag">MEMBER</span>}</div><h2>{c.title}</h2><p>{c.summary||"A documented clinical case with diagnosis, treatment sequence and practical endodontic notes."}</p><div className="caseEditorialActions"><Link href={`/cases/${c.slug}`} className="caseOpen">{c.access_level==="subscriber"?"View member case":"View case"}<b>↗</b></Link>{c.access_level==="subscriber"&&<Link href="/pricing" className="caseMembership">Membership</Link>}</div></div>
      </article>)}
    </section>
  </main>;
}
