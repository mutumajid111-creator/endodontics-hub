import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createPublicSupabaseClient } from "@/lib/supabase-public";

export const metadata={title:"Research & Clinical Notes | Dr. Muthanna Majid"};
export const dynamic="force-dynamic";

type ResearchNote={id:string;slug:string;title:string;excerpt:string|null;category:string|null;published_at:string|null;access_level:"free"|"subscriber"};

export default async function ResearchPage(){
 const supabase=createPublicSupabaseClient();
 const {data}=await supabase.from("article_catalog").select("id,slug,title,excerpt,category,published_at,access_level").neq("category","Book").order("published_at",{ascending:false,nullsFirst:false});
 const notes=(data||[]) as ResearchNote[];
 return <main><SiteHeader/><section className="pageHero shell"><p className="eyebrow">RESEARCH & CLINICAL NOTES</p><h1>Evidence for everyday Endodontics.</h1><p>Published research PDFs are opened inside Endodontics Hub for active subscribers.</p></section><section className="shell researchList">{notes.length===0?<div className="emptyPremium"><h2>No published research yet.</h2><p>Research added from the admin dashboard will appear here.</p></div>:notes.map((item,i)=><article key={item.id}><span>{String(i+1).padStart(2,"0")}</span><div><small>{item.category||"RESEARCH"}</small><h2>{item.title}</h2><p>{item.excerpt||"Research paper"}</p></div><Link href={`/library/${item.slug}`}>{item.access_level==="subscriber"?"🔒 Read":"Read"}</Link></article>)}</section></main>;
}
