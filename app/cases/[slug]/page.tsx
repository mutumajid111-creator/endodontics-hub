"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Brand from "@/components/Brand";
import { supabase } from "@/lib/supabase";
import styles from "./case.module.css";

type CatalogRow={id:string;title:string;slug:string;summary:string|null;category:string|null;tooth:string|null;access_level:"free"|"subscriber"};
type CaseRow=CatalogRow&{diagnosis:string|null;treatment:string|null;outcome:string|null};
type CaseImage={id:string;image_path:string;image_type:string;caption:string|null;sort_order:number;url?:string};

export default function CaseDetailPage(){
 const params=useParams<{slug:string}>(); const router=useRouter();
 const [catalog,setCatalog]=useState<CatalogRow|null>(null); const [item,setItem]=useState<CaseRow|null>(null); const [images,setImages]=useState<CaseImage[]>([]); const [loading,setLoading]=useState(true); const [locked,setLocked]=useState(false);
 useEffect(()=>{async function load(){
   const slug=String(params.slug||"");
   const {data:meta}=await supabase.from("case_catalog").select("id,title,slug,summary,category,tooth,access_level").eq("slug",slug).maybeSingle();
   if(!meta){setLoading(false);return;} setCatalog(meta as CatalogRow);
   const {data:{user}}=await supabase.auth.getUser();
   if(meta.access_level==="subscriber"&&!user){router.replace(`/member/login?next=${encodeURIComponent(`/cases/${slug}`)}`);return;}
   const {data:full}=await supabase.from("cases").select("id,title,slug,summary,diagnosis,treatment,outcome,category,tooth,access_level").eq("slug",slug).eq("status","published").maybeSingle();
   if(!full){setLocked(meta.access_level==="subscriber");setLoading(false);return;}
   setItem(full as CaseRow);
   const {data:media}=await supabase.from("case_images").select("id,image_path,image_type,caption,sort_order").eq("case_id",full.id).order("sort_order");
   const signed=await Promise.all(((media||[]) as CaseImage[]).map(async image=>{const {data}=await supabase.storage.from("case-images").createSignedUrl(image.image_path,3600);return {...image,url:data?.signedUrl};}));
   setImages(signed); setLoading(false);
 } void load();},[params.slug,router]);

 if(loading)return <main className="memberLoading">Loading clinical case...</main>;
 if(!catalog)return <main className="memberLoading"><div><h1>Case not found</h1><Link href="/cases">Back to cases</Link></div></main>;
 if(locked||!item)return <main className="memberPage"><header className="memberHeader"><div className="shell memberNav"><Brand/><Link href="/cases" className="navcta">All cases</Link></div></header><section className="memberHero shell"><p className="eyebrow">SUBSCRIBER CASE</p><h1>{catalog.title}</h1><p>{catalog.summary}</p></section><section className="shell" style={{padding:"42px 0 100px"}}><div className="emptyPremium"><h2>🔒 Active membership required</h2><p>This clinical case is part of the subscriber library. If you already submitted a Qi payment, check your account for approval status.</p><div className="memberActions"><Link href="/pricing" className="btn primary">View membership</Link><Link href="/account" className="btn secondary">My account</Link></div></div></section></main>;

 const treatmentSteps=String(item.treatment||"").split("\n").map((step:string)=>step.trim()).filter(Boolean);
 return <main className={styles.root}>
  <header className="header"><div className="shell nav"><Brand/><Link href="/cases" className="navcta">All Cases</Link></div></header>
  <section className="caseDetailHero shell"><p className="eyebrow">{item.category||"Clinical Case"}</p><h1>{item.title}</h1><div className="detailMeta"><span>{item.tooth||"Endodontics"}</span><span>{catalog.access_level==="subscriber"?"Member Case":"Free Case"}</span></div><p>{item.summary}</p></section>
  <section className="shell detailGrid"><aside className="detailRail"><div><span>01</span><b>Diagnosis</b></div><div><span>02</span><b>Treatment</b></div><div><span>03</span><b>Outcome</b></div><div><span>04</span><b>Images</b></div></aside><div className="detailContent">
    <section><h2>Diagnosis</h2><p>{item.diagnosis||"Clinical details will be added soon."}</p></section>
    <section><h2>Treatment sequence</h2>{treatmentSteps.length?<ol>{treatmentSteps.map((step:string)=><li key={step}>{step}</li>)}</ol>:<p>Treatment sequence will be added soon.</p>}</section>
    <section><h2>Outcome</h2><p>{item.outcome||"Outcome documentation will be added soon."}</p></section>
    <section><h2>Clinical images & radiographs</h2>{images.length?<div className="caseMediaGrid">{images.map(image=><figure key={image.id}>{image.url&&<img src={image.url} alt={image.caption||`${item.title} ${image.image_type}`}/>}<figcaption><span>{image.image_type}</span>{image.caption&&<p>{image.caption}</p>}</figcaption></figure>)}</div>:<div className="imagePlaceholder"><span>No images uploaded yet</span></div>}</section>
  </div></section>
 </main>;
}
