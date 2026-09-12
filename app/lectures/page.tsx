"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase";

type Lecture={id:string;title:string;slug:string;description:string|null;category:string|null;sort_order:number;access_level:"free"|"subscriber"};

export default function LecturesPage(){
 const [lectures,setLectures]=useState<Lecture[]>([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{async function load(){const {data}=await supabase.from("lecture_catalog").select("id,title,slug,description,category,sort_order,access_level").order("sort_order").order("published_at",{ascending:false});setLectures((data||[]) as Lecture[]);setLoading(false);}void load();},[]);
 return <main className="memberPage">
  <SiteHeader/>
  <section className="memberLectureHero"><div className="shell"><p className="eyebrow">VIDEO LEARNING LIBRARY</p><h1>Master Endodontics,<br/>one clinical lesson at a time.</h1><p style={{maxWidth:680,color:"#70798c",lineHeight:1.8}}>Focused lectures designed for serious clinical learning. Subscriber videos are protected inside the platform and unlock automatically with an active membership.</p></div></section>
  <section className="shell lectureCardGrid">
   {loading?<div className="memberLoading" style={{gridColumn:"1 / -1"}}>Loading lectures...</div>:lectures.length?lectures.map((lecture,i)=><Link href={`/lectures/${lecture.slug}`} className="lectureCard" key={lecture.id}>
    <div className="lectureCardTop"><span>{lecture.category||`LECTURE ${String(i+1).padStart(2,"0")}`}</span><span className="lectureLock">{lecture.access_level==="subscriber"?"MEMBER":"FREE"}</span></div>
    <h2>{lecture.title}</h2>
    <p>{lecture.description||"A focused Endodontic lecture with practical clinical concepts and decision-making."}</p>
    <div className="lectureCardFoot"><span>{lecture.access_level==="subscriber"?"Protected lecture":"Open lecture"}</span><span>Watch now →</span></div>
   </Link>):<div className="emptyPremium" style={{gridColumn:"1 / -1"}}><h2>No lectures published yet.</h2></div>}
  </section>
 </main>;
}
