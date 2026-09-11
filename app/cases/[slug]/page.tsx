import Link from "next/link";
import { notFound } from "next/navigation";
import { createPublicSupabaseClient } from "@/lib/supabase-public";
import styles from "./case.module.css";

export const dynamic = "force-dynamic";

type CaseImage = {
  id: string;
  image_path: string;
  image_type: string;
  caption: string | null;
  sort_order: number;
};

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createPublicSupabaseClient();

  const { data: item } = await supabase
    .from("cases")
    .select("id,title,slug,summary,diagnosis,treatment,outcome,category,tooth")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!item) notFound();

  const { data: images } = await supabase
    .from("case_images")
    .select("id,image_path,image_type,caption,sort_order")
    .eq("case_id", item.id)
    .order("sort_order", { ascending: true });

  const treatmentSteps = String(item.treatment || "")
    .split("\n")
    .map((step: string) => step.trim())
    .filter(Boolean);

  const media = ((images || []) as CaseImage[]).map((image: CaseImage) => ({
    ...image,
    url: supabase.storage.from("case-images").getPublicUrl(image.image_path).data.publicUrl,
  }));

  return (
    <main className={styles.root}>
      <header className="header"><div className="shell nav"><Link href="/" className="logo"><span className="mark">E</span><span><strong>ENDODONTICS</strong><small>HUB · DR. MUTHANNA MAJID</small></span></Link><Link href="/cases" className="navcta">All Cases</Link></div></header>
      <section className="caseDetailHero shell"><p className="eyebrow">{item.category || "Clinical Case"}</p><h1>{item.title}</h1><div className="detailMeta"><span>{item.tooth || "Endodontics"}</span><span>Clinical Case</span></div><p>{item.summary}</p></section>
      <section className="shell detailGrid">
        <aside className="detailRail"><div><span>01</span><b>Diagnosis</b></div><div><span>02</span><b>Treatment</b></div><div><span>03</span><b>Outcome</b></div><div><span>04</span><b>Images</b></div></aside>
        <div className="detailContent">
          <section><h2>Diagnosis</h2><p>{item.diagnosis || "Clinical details will be added soon."}</p></section>
          <section><h2>Treatment sequence</h2>{treatmentSteps.length ? <ol>{treatmentSteps.map((step: string) => <li key={step}>{step}</li>)}</ol> : <p>Treatment sequence will be added soon.</p>}</section>
          <section><h2>Outcome</h2><p>{item.outcome || "Outcome documentation will be added soon."}</p></section>
          <section><h2>Clinical images & radiographs</h2>{media.length ? <div className="caseMediaGrid">{media.map((image) => <figure key={image.id}><img src={image.url} alt={image.caption || `${item.title} ${image.image_type}`} /><figcaption><span>{image.image_type}</span>{image.caption ? <p>{image.caption}</p> : null}</figcaption></figure>)}</div> : <div className="imagePlaceholder"><span>No images uploaded yet</span><p>Images added from the admin dashboard will appear here automatically.</p></div>}</section>
        </div>
      </section>
    </main>
  );
}
