"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import { supabase } from "@/lib/supabase";

type Catalog={title:string;excerpt:string|null;category:string|null;access_level:"free"|"subscriber"};
type Article=Catalog&{content:string|null};
function drivePreview(url:string){const m=url.match(/\/d\/([^/]+)/)||url.match(/[?&]id=([^&]+)/);return m?.[1]?`https://drive.google.com/file/d/${m[1]}/preview`:url;}

export default function LibraryViewer({params}:{params:Promise<{slug:string}>}){
 const {slug}=use(params);const router=useRouter();const [meta,setMeta]=useState<Catalog|null>(null);const [item,setItem]=useState<Article|null>(null);const [locked,setLocked]=useState(false);const [loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{const {data:catalog}=await supabase.from("article_catalog").select("title,excerpt,category,access_level").eq("slug",slug).maybeSingle();if(!catalog){setLoading(false);return;}setMeta(catalog as Catalog);const {data:{user}}=await supabase.auth.getUser();if(catalog.access_level==="subscriber"&&!user){router.replace(`/member/login?next=${encodeURIComponent(`/library/${slug}`)}`);return;}const {data}=await supabase.from("articles").select("title,excerpt,category,access_level,content").eq("slug",slug).eq("status","published").maybeSingle();if(!data){setLocked(catalog.access_level==="subscriber");setLoading(false);return;}setItem(data as Article);setLoading(false);})();},[router,slug]);
 if(loading)return <main className="memberLoading">Loading document...</main>;
 if(!meta)return <main className="memberLoading"><div><h1>Document not found</h1><Link href="/">Back</Link></div></main>;
 if(locked||!item)return <main className="memberPage"><header className="memberHeader"><div className="shell memberNav"><Brand/><Link href="/pricing" className="navcta">Membership</Link></div></header><section className="memberHero shell"><p className="eyebrow">MEMBER LIBRARY</p><h1>{meta.title}</h1><p>{meta.excerpt}</p></section><section className="shell" style={{padding:"42px 0 100px"}}><div className="emptyPremium"><h2>🔒 Active membership required</h2><p>This document is available to active subscribers.</p><div className="memberActions"><Link href="/pricing" className="btn primary">View membership</Link><Link href="/account" className="btn secondary">My account</Link></div></div></section></main>;
 const src=drivePreview(item.content||"");
 return <main className="memberPage"><header className="memberHeader"><div className="shell memberNav"><Brand/><Link href={item.category==="Book"?"/books":"/research"} className="navcta">Back to library</Link></div></header><section className="memberHero shell"><p className="eyebrow">{item.category||"LIBRARY"}</p><h1>{item.title}</h1><p>{item.excerpt}</p></section><section className="shell" style={{padding:"28px 0 90px"}}><div style={{background:"#fff",borderRadius:20,overflow:"hidden",border:"1px solid #d8d2c6",boxShadow:"0 24px 70px rgba(23,37,84,.12)"}}><iframe title={item.title} src={src} style={{display:"block",width:"100%",height:"78vh",border:0}} allow="autoplay"/></div><p className="formHint" style={{marginTop:12}}>Member library document · viewed inside Endodontics Hub.</p></section></main>;
}
