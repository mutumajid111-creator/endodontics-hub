import Link from "next/link";
import { notFound } from "next/navigation";
import { clinicalCases } from "@/lib/content";

export function generateStaticParams() {
  return clinicalCases.map((item) => ({ slug: item.slug }));
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = clinicalCases.find((c) => c.slug === slug);
  if (!item) notFound();

  return (
    <main>
      <header className="header"><div className="shell nav"><Link href="/" className="logo"><span className="mark">E</span><span><strong>ENDODONTICS</strong><small>HUB · DR. MUTHANNA MAJID</small></span></Link><Link href="/cases" className="navcta">All Cases</Link></div></header>
      <section className="caseDetailHero shell"><p className="eyebrow">{item.category}</p><h1>{item.title}</h1><div className="detailMeta"><span>{item.tooth}</span><span>Clinical Case</span></div><p>{item.summary}</p></section>
      <section className="shell detailGrid">
        <aside className="detailRail"><div><span>01</span><b>Diagnosis</b></div><div><span>02</span><b>Treatment</b></div><div><span>03</span><b>Outcome</b></div></aside>
        <div className="detailContent">
          <section><h2>Diagnosis</h2><p>{item.diagnosis}</p></section>
          <section><h2>Treatment sequence</h2><ol>{item.treatment.map((step) => <li key={step}>{step}</li>)}</ol></section>
          <section><h2>Outcome</h2><p>{item.outcome}</p></section>
          <section className="imagePlaceholder"><span>Clinical images & radiographs</span><p>This area will be connected to Supabase Storage so you can upload pre-op, working length, obturation and follow-up images from the admin panel.</p></section>
        </div>
      </section>
    </main>
  );
}
