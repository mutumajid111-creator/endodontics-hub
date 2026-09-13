import Image from "next/image";
import Link from "@/components/ExperienceLink";
import SiteHeader from "@/components/SiteHeader";
import { createPublicSupabaseClient } from "@/lib/supabase-public";

export const metadata={title:"Books | Dr. Muthanna Majid"};
export const dynamic="force-dynamic";
type Book={id:string;slug:string;title:string;excerpt:string|null;published_at:string|null;access_level:"free"|"subscriber"};
export default async function BooksPage(){
 const supabase=createPublicSupabaseClient();
 const {data}=await supabase.from("article_catalog").select("id,slug,title,excerpt,published_at,access_level").eq("category","Book").order("published_at",{ascending:false,nullsFirst:false});
 const books=(data||[]) as Book[];
 return <main className="bookExperience"><SiteHeader/>
  <section className="bookLibraryHero shell"><div><Link href="/" className="experienceBack">← Endodontics Hub</Link><p className="experienceEyebrow">THE READING ROOM</p><h1>Endodontic books<br/><em>and practical references.</em></h1><p className="experienceLead">Essential knowledge, thoughtfully collected. Explore the references behind evidence-based endodontic practice.</p><div className="bookLibraryCount"><strong>{String(books.length).padStart(2,"0")}</strong><span>VOLUMES IN THE LIBRARY</span></div></div><div className="bookLibraryPhoto"><Image src="/resource-books.webp" alt="Academic reference books in a warmly lit reading room" fill sizes="(max-width: 760px) 94vw, 42vw" preload/><span>READ · REFLECT · APPLY</span></div></section>
  <section className="shell experienceCollection" aria-labelledby="books-collection"><div className="collectionHeading"><div><p className="experienceEyebrow">YOUR REFERENCE SHELF</p><h2 id="books-collection">The collection</h2></div><span>Books & practical references</span></div>
   {books.length===0 ? <div className="experienceEmpty"><span aria-hidden="true">▤</span><h2>No books published yet.</h2><p>New references will appear on this shelf when they are published.</p><Link href="/">Return to the hub →</Link></div> : <div className="bookShelf">{books.map((item,i)=><article className="bookVolume" key={item.id}><Link href={`/library/${item.slug}`} className="bookCover" aria-label={`Read ${item.title}`}><span className="bookCoverTop">ENDODONTICS / REFERENCE</span><span className="bookCoverTitle">{item.title}</span><span className="bookCoverBottom"><span>VOLUME {String(i+1).padStart(2,"0")}</span><b aria-hidden="true">↗</b></span></Link><div className="bookVolumeInfo"><span className="experienceAccess">{item.access_level==="subscriber"?"MEMBER BOOK":"OPEN ACCESS"}</span><h3>{item.title}</h3><p>{item.excerpt||"An endodontic reference for your clinical reading."}</p><Link href={`/library/${item.slug}`} className="experienceTextLink">{item.access_level==="subscriber"?"Open member reader":"Start reading"}<span aria-hidden="true">→</span></Link></div></article>)}</div>}
  </section></main>;
}
