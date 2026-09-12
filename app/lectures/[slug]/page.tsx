"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import { supabase } from "@/lib/supabase";
import { ensureThisDevice, isCurrentDevice } from "@/lib/device-session";

type Catalog={title:string;description:string|null;category:string|null;access_level:"free"|"subscriber"};
type Lecture=Catalog&{youtube_video_id:string};

export default function LecturePlayerPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=use(params); const router=useRouter(); const [catalog,setCatalog]=useState<Catalog|null>(null); const [lecture,setLecture]=useState<Lecture|null>(null); const [loading,setLoading]=useState(true); const [locked,setLocked]=useState(false);
 useEffect(()=>{let timer:ReturnType<typeof setInterval>|undefined;async function kick(){await supabase.auth.signOut();router.replace(`/member/login?next=${encodeURIComponent(`/lectures/${slug}`)}`);router.refresh();}async function load(){
   const {data:meta}=await supabase.from("lecture_catalog").select("title,description,category,access_level").eq("slug",slug).maybeSingle();
   if(!meta){setLoading(false);return;} setCatalog(meta as Catalog);
   const {data:{user}}=await supabase.auth.getUser();
   if(meta.access_level==="subscriber"){
     if(!user){router.replace(`/member/login?next=${encodeURIComponent(`/lectures/${slug}`)}`);return;}
     if(!(await ensureThisDevice())){await kick();return;}
     timer=setInterval(async()=>{if(!(await isCurrentDevice()))await kick();},30000);
   }
   const {data}=await supabase.from("lectures").select("title,description,category,access_level,youtube_video_id").eq("slug",slug).eq("status","published").maybeSingle();
   if(!data){setLocked(meta.access_level==="subscriber");setLoading(false);return;}
   setLecture(data as Lecture); setLoading(false);
 }void load();return()=>{if(timer)clearInterval(timer);};},[router,slug]);

 if(loading)return <main className="memberLoading">Loading lecture...</main>;
 if(!catalog)return <main className="memberLoading"><div><h1>Lecture not found</h1><Link href="/lectures">Back to lectures</Link></div></main>;
 if(locked||!lecture)return <main className="memberPage"><header className="memberHeader"><div className="shell memberNav"><Brand/><Link href="/lectures" className="navcta">All Lectures</Link></div></header><section className="memberHero shell"><p className="eyebrow">SUBSCRIBER LECTURE</p><h1>{catalog.title}</h1><p>{catalog.description}</p></section><section className="shell" style={{padding:"42px 0 100px"}}><div className="emptyPremium"><h2>🔒 Active membership required</h2><p>This video is part of the private lecture library. Subscribe or check your account if you already submitted a Qi payment.</p><div className="memberActions"><Link href="/pricing" className="btn primary">View membership</Link><Link href="/account" className="btn secondary">My account</Link></div></div></section></main>;

 return <main className="memberPage">
  <header className="memberHeader"><div className="shell memberNav"><Brand/><Link href="/lectures" className="navcta">All Lectures</Link></div></header>
  <section className="memberHero shell"><p className="eyebrow">{lecture.category||"LECTURE"}</p><h1>{lecture.title}</h1><p>{lecture.description}</p></section>
  <section className="shell" style={{padding:"42px 0 90px"}}><div style={{position:"relative",paddingTop:"56.25%",background:"#02070d",borderRadius:"20px",overflow:"hidden",border:"1px solid #1c3854",boxShadow:"0 30px 80px #0008"}}><iframe title={lecture.title} src={`https://www.youtube-nocookie.com/embed/${lecture.youtube_video_id}?rel=0&modestbranding=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" style={{position:"absolute",inset:0,width:"100%",height:"100%",border:0}}/></div><p className="formHint" style={{marginTop:14}}>Private member content. One active device per account.</p></section>
 </main>;
}
