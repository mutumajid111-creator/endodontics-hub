import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createPublicSupabaseClient } from "@/lib/supabase-public";

export const metadata={title:"Books | Dr. Muthanna Majid"};
export const dynamic="force-dynamic";

type Book={id:string;slug:string;title:string;excerpt:string|null;published_at:string|null;access_level:"free"|"subscriber"};

export default async function BooksPage(){
 const supabase=createPublicSupabaseClient();
 const {data}=await supabase.from("article_catalog").select("id,slug,title,excerpt,published_at,access_level").eq("category","Book").order("published_at",{ascending:false,nullsFirst:false});
 const books=(data||[]) as Book[];
 return <main><SiteHeader/><section className="pageHero shell"><p className="eyebrow">BOOK LIBRARY</p><h1>Endodontic books and practical references.</h1><p>Subscriber books are stored in Google Drive and opened inside the Endodontics Hub reader.</p></section><section className="shell researchList">{books.length===0?<div className="emptyPremium"><h2>No books published yet.</h2><p>Books added from the admin dashboard will appear here.</p></div>:books.map((item,i)=><article key={item.id}><span>{String(i+1).padStart(2,"0")}</span><div><small>BOOK</small><h2>{item.title}</h2><p>{item.excerpt||"Member book"}</p></div><Link href={`/library/${item.slug}`}>{item.access_level==="subscriber"?"🔒 Read":"Read"}</Link></article>)}</section></main>;
}
