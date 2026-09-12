"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import { supabase } from "@/lib/supabase";

type Plan={id:string;code:string;name:string;interval:string;price_amount:number|null;currency:string};

export default function PricingPage(){
 const router=useRouter();
 const [plans,setPlans]=useState<Plan[]>([]);
 const [loading,setLoading]=useState(true);
 const [email,setEmail]=useState("");

 useEffect(()=>{async function load(){
   const {data:{user}}=await supabase.auth.getUser();
   if(!user){
     router.replace(`/member/login?next=${encodeURIComponent("/pricing")}`);
     return;
   }
   setEmail(user.email||"");
   const {data}=await supabase.from("subscription_plans").select("id,code,name,interval,price_amount,currency").eq("active",true).order("interval");
   setPlans((data||[]) as Plan[]);
   setLoading(false);
 } void load();},[router]);

 if(loading)return <main className="memberLoading">Checking your account...</main>;

 return <main className="memberPage">
  <header className="memberHeader"><div className="shell memberNav"><Brand/><nav className="navlinks"><Link href="/cases">Cases</Link><Link href="/lectures">Lectures</Link><Link href="/research">Research</Link><Link href="/books">Books</Link></nav><Link href="/account" className="navcta">My account</Link></div></header>
  <section className="memberHero shell"><p className="eyebrow">MEMBERSHIP</p><h1>Choose your membership plan.</h1><p>You are signed in as <strong>{email}</strong>. Select a plan below to continue to Qi Card payment.</p></section>
  <section className="shell pricingGrid">
   {plans.map(plan=><article key={plan.id} className={`pricingCard ${plan.code==="annual"?"featured":""}`}>
    <p className="eyebrow">{plan.interval.toUpperCase()}</p><h2>{plan.name}</h2>
    <div className="priceValue">{plan.price_amount==null?"—":Number(plan.price_amount).toLocaleString()} <small>{plan.currency}{plan.price_amount!=null?` / ${plan.interval}`:""}</small></div>
    <ul className="pricingFeatures"><li>Subscriber clinical cases</li><li>Private Endodontics lectures</li><li>Books and research library</li><li>New premium releases</li><li>Member account and access status</li></ul>
    <Link href={`/checkout/qi?plan=${plan.code}`} className="btn primary fullButton">Continue to subscription</Link>
    {plan.code==="annual"&&<p className="formHint" style={{marginTop:12}}>Recommended for continuous access throughout the year.</p>}
   </article>)}
  </section>
 </main>;
}
