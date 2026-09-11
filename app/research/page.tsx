import Link from "next/link";
import { researchNotes } from "@/lib/content";

export const metadata = { title: "Research & Notes | Endodontics Hub" };

export default function ResearchPage() {
  return (
    <main>
      <header className="header"><div className="shell nav"><Link href="/" className="logo"><span className="mark">E</span><span><strong>ENDODONTICS</strong><small>HUB · DR. MUTHANNA MAJID</small></span></Link><nav className="navlinks"><Link href="/cases">Cases</Link><Link href="/research">Research</Link><Link href="/admin">Admin</Link></nav><Link href="/" className="navcta">Home</Link></div></header>
      <section className="pageHero shell"><p className="eyebrow">RESEARCH & CLINICAL NOTES</p><h1>Evidence for everyday endodontics.</h1><p>Short, practical notes designed to connect literature with clinical decision-making.</p></section>
      <section className="shell researchList">{researchNotes.map((item, i) => <article key={item.slug}><span>{String(i+1).padStart(2,"0")}</span><div><small>{item.tag}</small><h2>{item.title}</h2><p>{item.excerpt}</p></div><b>Coming soon</b></article>)}</section>
    </main>
  );
}
