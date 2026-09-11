"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Brand from "@/components/Brand";
import { supabase } from "@/lib/supabase";

type Plan={id:string;code:string;name:string;interval:string;price_amount:number|null;currency:string};

export default function PricingPage(){
 const [plans,setPlans]=useState<Plan[]>([]);
 useEffect(()=>{void supabase.from("subscription_plans").select("id,code,name,interval,price_amount,currency").eq("active",true).order("interval").then(({data})=>setPlans((data||[]) as Plan[]));},[]);
 return <main className="memberPage">
  <header className="memberHeader"><div className="shell memberNav"><Brand/><nav className="navlinks"><Link href="/cases">Cases</Link><Link href="/lectures">Lectures</Link><Link href="/research">Research</Link></nav><Link href="/member/login" className="navcta">Sign in</Link></div></header>
  <section className="memberHero shell"><p className="eyebrow">MEMBERSHIP</p><h1>One membership. The complete Endodontics library.</h1><p>Subscriber access includes premium clinical cases, private video lectures, research notes and all new membership content released while your plan is active.</p></section>
  <section className="shell pricingGrid">
   {plans.map((plan,index)=><article key={plan.id} className={`pricingCard ${plan.code==="annual"?"featured":""}`}>
    <p className="eyebrow">{plan.interval.toUpperCase()}</p><h2>{plan.name}</h2>
    <div className="priceValue">{plan.price_amount==null?"—":Number(plan.price_amount).toLocaleString()} <small>{plan.currency}{plan.price_amount!=null?` / ${plan.interval}`:""}</small></div>
    <ul className="pricingFeatures"><li>Subscriber clinical cases</li><li>Private Endodontics lectures</li><li>Research and clinical notes</li><li>New premium releases</li><li>Member account and access status</li></ul>
    <Link href={`/checkout/qi?plan=${plan.code}`} className="btn primary fullButton">Subscribe with Qi Card</Link>
    {plan.code==="annual"&&<p className="formHint" style={{marginTop:12}}>Recommended for continuous access throughout the year.</p>}
   </article>)}
  </section>
 </main>;
}
