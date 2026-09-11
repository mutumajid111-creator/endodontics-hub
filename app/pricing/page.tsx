"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Plan={id:string;code:string;name:string;interval:string;price_amount:number|null;currency:string};

export default function PricingPage(){
 const [plans,setPlans]=useState<Plan[]>([]);
 useEffect(()=>{void supabase.from("subscription_plans").select("id,code,name,interval,price_amount,currency").eq("active",true).then(({data})=>setPlans((data||[]) as Plan[]));},[]);
 return <main>
  <header className="header"><div className="shell nav"><Link href="/" className="logo"><span className="mark">M</span><span><strong>DR. MUTHANNA MAJID</strong><small>ENDODONTICS MEMBERSHIP</small></span></Link><nav className="navlinks"><Link href="/cases">Cases</Link><Link href="/lectures">Lectures</Link><Link href="/research">Research</Link></nav><Link href="/member/login" className="navcta">Sign in</Link></div></header>
  <section className="pageHero shell"><p className="eyebrow">MEMBERSHIP</p><h1>Unlock the complete Endodontics library.</h1><p>Access subscriber-only clinical cases, lectures, videos and future premium educational content.</p></section>
  <section className="shell" style={{padding:"40px 0 110px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
   {plans.map(plan=><article key={plan.id} style={{background:"#fff",border:"1px solid #d9e0dc",padding:32,borderRadius:16}}><p className="eyebrow">{plan.interval.toUpperCase()}</p><h2 style={{font:"32px Georgia,serif"}}>{plan.name}</h2><div style={{font:"42px Georgia,serif",margin:"20px 0"}}>{plan.price_amount==null?"Price set by admin":`${Number(plan.price_amount).toLocaleString()} ${plan.currency}`}</div><p>Full access to subscriber cases, lecture videos, research notes and new premium releases.</p><Link href={`/checkout/qi?plan=${plan.code}`} className="btn primary" style={{marginTop:18}}>Subscribe with Qi Card</Link></article>)}
  </section>
 </main>;
}
