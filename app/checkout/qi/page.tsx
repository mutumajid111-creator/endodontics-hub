"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Plan={id:string;code:string;name:string;interval:string;price_amount:number|null;currency:string};

export default function QiCheckoutPage(){
 const router=useRouter(); const [plan,setPlan]=useState<Plan|null>(null); const [loading,setLoading]=useState(true); const [message,setMessage]=useState("");
 useEffect(()=>{async function load(){const code=new URLSearchParams(window.location.search).get("plan")||"monthly"; const {data:{user}}=await supabase.auth.getUser(); if(!user){router.replace(`/member/login?next=${encodeURIComponent(`/checkout/qi?plan=${code}`)}`);return;} const {data}=await supabase.from("subscription_plans").select("id,code,name,interval,price_amount,currency").eq("code",code).eq("active",true).maybeSingle(); setPlan((data as Plan|null)||null); setLoading(false);} void load();},[router]);
 async function begin(){if(!plan)return; setMessage(""); const {data:{user}}=await supabase.auth.getUser(); if(!user)return; const {error}=await supabase.from("payment_transactions").insert({user_id:user.id,plan_id:plan.id,provider:"qicard",amount:plan.price_amount,currency:plan.currency,status:"pending"}); if(error){setMessage(error.message);return;} setMessage("Qi Card checkout is prepared. The live payment button will be enabled as soon as your Qi merchant credentials are issued.");}
 if(loading)return <main className="shell section"><p>Loading checkout...</p></main>;
 if(!plan)return <main className="shell section"><h1>Plan not found</h1><Link href="/pricing">Back to pricing</Link></main>;
 return <main><header className="header"><div className="shell nav"><Link href="/pricing" className="logo"><span className="mark">Qi</span><span><strong>QI CARD CHECKOUT</strong><small>ENDODONTICS MEMBERSHIP</small></span></Link><Link href="/pricing" className="navcta">Back</Link></div></header>
 <section className="pageHero shell"><p className="eyebrow">SECURE CHECKOUT</p><h1>{plan.name}</h1><p>{plan.price_amount==null?"Membership price has not been set yet.":`${Number(plan.price_amount).toLocaleString()} ${plan.currency}`}</p></section>
 <section className="shell" style={{padding:"40px 0 100px",maxWidth:760}}><article style={{background:"#fff",border:"1px solid #d8dfdb",padding:30,borderRadius:16}}><h2 style={{font:"30px Georgia,serif"}}>Pay with Qi Card</h2><p>Your payment will be processed through Qi's online payment gateway. Card details will not be stored by this website.</p><button className="btn primary" onClick={begin} disabled={plan.price_amount==null}>Continue with Qi Card</button>{plan.price_amount==null&&<p style={{marginTop:15}}>Set the membership price from Admin → Membership first.</p>}{message&&<p style={{marginTop:18}}>{message}</p>}</article></section></main>;
}
