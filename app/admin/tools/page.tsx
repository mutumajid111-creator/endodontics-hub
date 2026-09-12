"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import { supabase } from "@/lib/supabase";

const tools=[
 {href:"/admin",title:"Clinical Cases",text:"Create, edit, publish and upload case images."},
 {href:"/admin/lectures",title:"Lectures & Media",text:"Add YouTube videos, educational media and full lectures.",content:true},
 {href:"/admin/books",title:"Books",text:"Add and manage endodontic books and educational references.",content:true},
 {href:"/admin/research",title:"Research",text:"Add research papers, clinical notes and evidence summaries.",content:true},
 {href:"/admin/membership",title:"Membership Plans",text:"Set monthly and annual prices or activate access manually."},
 {href:"/admin/payments",title:"Qi Payments",text:"Review payment proofs, approve requests and activate subscriptions."},
];

export default function AdminToolsPage(){
 const router=useRouter();
 const [loading,setLoading]=useState(true);
 const [showAdd,setShowAdd]=useState(false);

 useEffect(()=>{async function boot(){
   const {data:{user}}=await supabase.auth.getUser();
   if(!user){router.replace("/admin/login");return;}
   const {data:p}=await supabase.from("profiles").select("role").eq("user_id",user.id).maybeSingle();
   if(p?.role!=="admin"){router.replace("/");return;}
   setLoading(false);
 }void boot();},[router]);

 if(loading)return <main className="memberLoading">Loading admin...</main>;

 return <main className="adminPremiumPage">
   <header className="memberHeader"><div className="shell memberNav"><Brand href="/admin/tools"/><Link href="/" className="navcta">View website</Link></div></header>

   <section className="shell adminPremiumHero">
     <p className="eyebrow">ADMIN CONTROL CENTER</p>
     <h1>Manage the platform.</h1>
     <p>Cases, lectures, books, research, memberships and payments are separated into focused tools.</p>
   </section>

   <section className="shell pricingGrid">
     {tools.map(tool=><article className="pricingCard" key={tool.href}>
       <p className="eyebrow">ADMIN TOOL</p>
       <h2>{tool.title}</h2>
       <p style={{color:"#8ea4ba",lineHeight:1.7}}>{tool.text}</p>
       {tool.content
         ? <button type="button" className="btn primary" onClick={()=>setShowAdd(true)}>Add content</button>
         : <Link href={tool.href} className="btn primary">Open {tool.title}</Link>}
     </article>)}
   </section>

   {showAdd&&<div className="adminAddOverlay" onClick={()=>setShowAdd(false)}>
     <div className="adminAddModal" onClick={e=>e.stopPropagation()}>
       <button className="adminAddClose" onClick={()=>setShowAdd(false)} aria-label="Close">×</button>
       <p className="eyebrow">ADD CONTENT</p>
       <h2>What do you want to add?</h2>
       <p className="adminAddLead">Choose the type and I’ll take you directly to its upload form.</p>
       <div className="adminAddChoices">
         <Link href="/admin/lectures" className="adminAddChoice"><span>▶</span><div><strong>Video / Lecture</strong><small>YouTube educational video or full lecture</small></div></Link>
         <Link href="/admin/books" className="adminAddChoice"><span>▤</span><div><strong>Book</strong><small>Book, reference or educational PDF</small></div></Link>
         <Link href="/admin/research" className="adminAddChoice"><span>⌕</span><div><strong>Research</strong><small>Research paper, article or clinical note</small></div></Link>
       </div>
     </div>
   </div>}
 </main>;
}
