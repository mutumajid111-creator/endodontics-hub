import Link from "next/link";
import { createPublicSupabaseClient } from "@/lib/supabase-public";

export const metadata = { title: "Research & Notes | Endodontics Hub" };
export const dynamic = "force-dynamic";

type ResearchNote = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  published_at: string | null;
};

export default async function ResearchPage() {
  const supabase = createPublicSupabaseClient();
  const { data } = await supabase
    .from("articles")
    .select("id,slug,title,excerpt,category,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  const researchNotes = (data || []) as ResearchNote[];

  return (
    <main>
      <header className="header"><div className="shell nav"><Link href="/" className="logo"><span className="mark">E</span><span><strong>ENDODONTICS</strong><small>HUB · DR. MUTHANNA MAJID</small></span></Link><nav className="navlinks"><Link href="/cases">Cases</Link><Link href="/research">Research</Link><Link href="/admin">Admin</Link></nav><Link href="/" className="navcta">Home</Link></div></header>
      <section className="pageHero shell"><p className="eyebrow">RESEARCH & CLINICAL NOTES</p><h1>Evidence for everyday endodontics.</h1><p>Short, practical notes designed to connect literature with clinical decision-making.</p></section>
      <section className="shell researchList">
        {researchNotes.length === 0 ? (
          <article><span>01</span><div><small>RESEARCH</small><h2>No published notes yet.</h2><p>Published research notes will appear here automatically.</p></div><b>Coming soon</b></article>
        ) : researchNotes.map((item, i) => (
          <article key={item.id}><span>{String(i+1).padStart(2,"0")}</span><div><small>{item.category || "RESEARCH"}</small><h2>{item.title}</h2><p>{item.excerpt || "Clinical note"}</p></div><b>Published</b></article>
        ))}
      </section>
    </main>
  );
}
