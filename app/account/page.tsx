"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type SubRow={status:string;starts_at:string|null;ends_at:string|null;subscription_plans:{name:string;interval:string}|null};

export default function AccountPage(){
 const router=useRouter(); const [email,setEmail]=useState(""); const [sub,setSub]=useState<SubRow|null>(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{async function load(){const {data:{user}}=await supabase.auth.getUser(); if(!user){router.replace("/member/login?next=/account");return;} setEmail(user.email||""); const {data}=await supabase.from("subscriptions").select("status,starts_at,ends_at,subscription_plans(name,interval)").eq("user_id",user.id).order("created_at",{ascending:false}).limit(1).maybeSingle(); setSub((data as SubRow|null)||null); setLoading(false);} void load();},[router]);
 async function logout(){await supabase.auth.signOut();router.replace("/");router.refresh();}
 if(loading)return <main className="shell section"><p>Loading account...</p></main>;
 return <main><header className="header"><div className="shell nav"><Link href="/" className="logo"><span className="mark">M</span><span><strong>DR. MUTHANNA MAJID</strong><small>MEMBER ACCOUNT</small></span></Link><button onClick={logout} className="navcta">Sign out</button></div></header>
 <section className="pageHero shell"><p className="eyebrow">MY ACCOUNT</p><h1>Your membership.</h1><p>{email}</p></section>
 <section className="shell" style={{padding:"40px 0 100px",display:"grid",gap:20,maxWidth:900}}>
  <article style={{background:"#fff",border:"1px solid #d8dfdb",padding:28,borderRadius:14}}><p className="eyebrow">STATUS</p><h2 style={{font:"30px Georgia,serif"}}>{sub?.status==="active"?"Active Membership":"No active membership"}</h2>{sub?.subscription_plans&&<p>{sub.subscription_plans.name}</p>}{sub?.ends_at&&<p>Access until: {new Date(sub.ends_at).toLocaleDateString()}</p>}<div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:20}}><Link href="/pricing" className="btn primary">{sub?.status==="active"?"Change / Renew Plan":"Choose a Plan"}</Link><Link href="/lectures" className="btn secondary">Lectures</Link><Link href="/cases" className="btn secondary">Clinical Cases</Link></div></article>
 </section></main>;
}
