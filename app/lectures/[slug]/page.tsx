"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import { supabase } from "@/lib/supabase";
import { ensureThisDevice, isCurrentDevice } from "@/lib/device-session";

type Catalog={title:string;description:string|null;category:string|null;access_level:"free"|"subscriber"};
type Lecture=Catalog&{youtube_video_id:string};

const watermarkPositions=[
 {top:"10%",left:"8%"},{top:"14%",left:"62%"},{top:"42%",left:"12%"},{top:"48%",left:"64%"},{top:"73%",left:"18%"},{top:"76%",left:"60%"}
];

export default function LecturePlayerPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=use(params); const router=useRouter(); const [catalog,setCatalog]=useState<Catalog|null>(null); const [lecture,setLecture]=useState<Lecture|null>(null); const [loading,setLoading]=useState(true); const [locked,setLocked]=useState(false); const [watermark,setWatermark]=useState(""); const [watermarkIndex,setWatermarkIndex]=useState(0);
 useEffect(()=>{let timer:ReturnType<typeof setInterval>|undefined;let watermarkTimer:ReturnType<typeof setInterval>|undefined;async function kick(){await supabase.auth.signOut();router.replace(`/member/login?next=${encodeURIComponent(`/lectures/${slug}`)}`);router.refresh();}async function load(){
   const {data:meta}=await supabase.from("lecture_catalog").select("title,description,category,access_level").eq("slug",slug).maybeSingle();
   if(!meta){setLoading(false);return;} setCatalog(meta as Catalog);
   const {data:{user}}=await supabase.auth.getUser();
   if(user){
     const {data:profile}=await supabase.from("profiles").select("full_name").eq("user_id",user.id).maybeSingle();
     const label=(profile?.full_name?.trim()||user.email||"Member");
     setWatermark(`${label} • ${user.id.slice(0,8)}`);
     watermarkTimer=setInterval(()=>setWatermarkIndex(i=>(i+1)%watermarkPositions.length),9000);
   }
   if(meta.access_level==="subscriber"){
     if(!user){router.replace(`/member/login?next=${encodeURIComponent(`/lectures/${slug}`)}`);return;}
     if(!(await ensureThisDevice())){await kick();return;}
     timer=setInterval(async()=>{if(!(await isCurrentDevice()))await kick();},30000);
   }
   const {data}=await supabase.from("lectures").select("title,description,category,access_level,youtube_video_id").eq("slug",slug).eq("status","published").maybeSingle();
   if(!data){setLocked(meta.access_level==="subscriber");setLoading(false);return;}
   setLecture(data as Lecture); setLoading(false);
 }void load();return()=>{if(timer)clearInterval(timer);if(watermarkTimer)clearInterval(watermarkTimer);};},[router,slug]);

 if(loading)return <main className="memberLoading">Loading lecture...</main>;
 if(!catalog)return <main className="memberLoading"><div><h1>Lecture not found</h1><Link href="/lectures">Back to lectures</Link></div></main>;
 if(locked||!lecture)return <main className="memberPage"><header className="memberHeader"><div className="shell memberNav"><Brand/><Link href="/lectures" className="navcta">All Lectures</Link></div></header><section className="memberHero shell"><p className="eyebrow">SUBSCRIBER LECTURE</p><h1>{catalog.title}</h1><p>{catalog.description}</p></section><section className="shell" style={{padding:"42px 0 100px"}}><div className="emptyPremium"><h2>🔒 Active membership required</h2><p>This video is part of the private lecture library. Subscribe or check your account if you already submitted a Qi payment.</p><div className="memberActions"><Link href="/pricing" className="btn primary">View membership</Link><Link href="/account" className="btn secondary">My account</Link></div></div></section></main>;

 const wmPos=watermarkPositions[watermarkIndex];
 return <main className="memberPage">
  <header className="memberHeader"><div className="shell memberNav"><Brand/><Link href="/lectures" className="navcta">All Lectures</Link></div></header>
  <section className="memberHero shell"><p className="eyebrow">{lecture.category||"LECTURE"}</p><h1>{lecture.title}</h1><p>{lecture.description}</p></section>
  <section className="shell" style={{padding:"42px 0 90px"}}><div style={{position:"relative",paddingTop:"56.25%",background:"#02070d",borderRadius:"20px",overflow:"hidden",border:"1px solid #1c3854",boxShadow:"0 30px 80px #0008"}}>
   <iframe title={lecture.title} src={`https://www.youtube-nocookie.com/embed/${lecture.youtube_video_id}?rel=0&modestbranding=1&fs=0&playsinline=1`} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" style={{position:"absolute",inset:0,width:"100%",height:"100%",border:0}}/>
   {watermark&&<div aria-hidden="true" style={{position:"absolute",top:wmPos.top,left:wmPos.left,zIndex:5,pointerEvents:"none",userSelect:"none",padding:"7px 11px",borderRadius:10,background:"rgba(0,0,0,.34)",border:"1px solid rgba(255,255,255,.18)",color:"rgba(255,255,255,.72)",fontSize:"clamp(10px,1.2vw,14px)",fontWeight:700,letterSpacing:".03em",textShadow:"0 1px 4px #000",transition:"top .8s ease,left .8s ease",maxWidth:"42%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{watermark}</div>}
  </div><p className="formHint" style={{marginTop:14}}>Protected member content • One active device per account • Personalized moving watermark enabled.</p></section>
 </main>;
}
