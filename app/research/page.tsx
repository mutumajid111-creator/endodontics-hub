import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createPublicSupabaseClient } from "@/lib/supabase-public";

export const metadata={title:"Research & Clinical Notes | Dr. Muthanna Majid"};
export const dynamic="force-dynamic";

type ResearchNote={id:string;slug:string;title:string;excerpt:string|null;category:string|null;published_at:string|null;access_level:"free"|"subscriber"};

export default async function ResearchPage(){
 const supabase=createPublicSupabaseClient();
 const {data}=await supabase.from("article_catalog").select("id,slug,title,excerpt,category,published_at,access_level").order("published_at",{ascending:false,nullsFirst:false});
 const notes=(data||[]) as ResearchNote[];
 return <main>
  <SiteHeader/>
  <section className="pageHero shell"><p className="eyebrow">RESEARCH & CLINICAL NOTES</p><h1>Evidence for everyday Endodontics.</h1><p>Practical notes that connect published evidence with chairside clinical decisions.</p></section>
  <section className="shell researchList">{notes.length===0?<div className="emptyPremium"><h2>No published notes yet.</h2><p>New research and clinical notes will appear here.</p></div>:notes.map((item,i)=><article key={item.id}><span>{String(i+1).padStart(2,"0")}</span><div><small>{item.category||"RESEARCH"}</small><h2>{item.title}</h2><p>{item.excerpt||"Clinical note"}</p></div>{item.access_level==="subscriber"?<Link href="/pricing">🔒 Member</Link>:<b>Free</b>}</article>)}</section>
 </main>;
}
