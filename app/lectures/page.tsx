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
  <section className="memberHero shell"><p className="eyebrow">VIDEO LIBRARY</p><h1>Endodontic lectures.</h1><p>Private educational videos are embedded inside the platform. Subscriber lectures unlock automatically with an active membership.</p></section>
  <section className="shell researchList">{loading?<p>Loading lectures...</p>:lectures.length?lectures.map((lecture,i)=><article key={lecture.id}><span>{String(i+1).padStart(2,"0")}</span><div><small>{lecture.category||"LECTURE"}</small><h2>{lecture.title}</h2><p>{lecture.description}</p></div><Link href={`/lectures/${lecture.slug}`}>{lecture.access_level==="subscriber"?"🔒 Watch":"Watch free"} →</Link></article>):<div className="emptyPremium"><h2>No lectures published yet.</h2></div>}</section>
 </main>;
}
