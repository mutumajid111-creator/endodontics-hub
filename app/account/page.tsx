"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import { supabase } from "@/lib/supabase";
import { ensureThisDevice, isCurrentDevice } from "@/lib/device-session";

type PlanName={name:string};
type SubPlan={name:string;interval:string};
type SubRow={status:string;starts_at:string|null;ends_at:string|null;subscription_plans:SubPlan|SubPlan[]|null};
type PaymentRow={id:string;status:string;amount:number|null;currency:string;created_at:string;payer_reference:string|null;subscription_plans:PlanName|PlanName[]|null};

function firstRelation<T>(value:T|T[]|null|undefined):T|null{return Array.isArray(value)?value[0]??null:value??null;}

export default function AccountPage(){
 const router=useRouter(); const [email,setEmail]=useState(""); const [sub,setSub]=useState<SubRow|null>(null); const [payments,setPayments]=useState<PaymentRow[]>([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{let timer:ReturnType<typeof setInterval>|undefined;async function kickToLogin(){await supabase.auth.signOut();router.replace("/member/login?next=/account");router.refresh();}async function load(){const {data:{user}}=await supabase.auth.getUser(); if(!user){router.replace("/member/login?next=/account");return;} const ok=await ensureThisDevice();if(!ok){await kickToLogin();return;} setEmail(user.email||""); const [{data:s},{data:p}]=await Promise.all([supabase.from("subscriptions").select("status,starts_at,ends_at,subscription_plans(name,interval)").eq("user_id",user.id).order("created_at",{ascending:false}).limit(1).maybeSingle(),supabase.from("payment_transactions").select("id,status,amount,currency,created_at,payer_reference,subscription_plans(name)").eq("user_id",user.id).order("created_at",{ascending:false}).limit(8)]); setSub((s as SubRow|null)||null); setPayments((p||[]) as PaymentRow[]); setLoading(false); timer=setInterval(async()=>{if(!(await isCurrentDevice()))await kickToLogin();},30000);} void load();return()=>{if(timer)clearInterval(timer);};},[router]);
 async function logout(){await supabase.auth.signOut();router.replace("/");router.refresh();}
 if(loading)return <main className="memberLoading">Loading account...</main>;
 const active=sub?.status==="active" && (!sub.ends_at || new Date(sub.ends_at)>new Date());
 const activePlan=firstRelation(sub?.subscription_plans);
 return <main className="memberPage">
  <header className="memberHeader"><div className="shell memberNav"><Brand/><button onClick={logout} className="navcta">Sign out</button></div></header>
  <section className="memberHero shell"><p className="eyebrow">MY ACCOUNT</p><h1>Your Endodontics membership.</h1><p>{email}</p></section>
  <section className="shell accountGrid">
   <article className="accountCard"><span className="accountStatus">{active?"ACTIVE MEMBER":"MEMBERSHIP"}</span><h2>{active?activePlan?.name||"Active Membership":"No active membership"}</h2>{sub?.ends_at&&<p>Access until <strong>{new Date(sub.ends_at).toLocaleDateString()}</strong></p>}<div className="memberActions"><Link href="/pricing" className="btn primary">{active?"Renew membership":"Choose a plan"}</Link>{active&&<><Link href="/lectures" className="btn secondary">Lectures</Link><Link href="/cases" className="btn secondary">Cases</Link></>}</div></article>
   <article className="accountCard"><span className="accountStatus">SECURITY</span><h2>One-device access</h2><p>This account can be active on one device at a time. Signing in on another device automatically replaces the previous device session.</p></article>
   <article className="accountCard"><span className="accountStatus">QI CARD</span><h2>Payment requests</h2><div className="accountPayments">{payments.length?payments.map(p=>{const plan=firstRelation(p.subscription_plans);return <div className="accountPaymentRow" key={p.id}><div><b>{plan?.name||"Membership"}</b><small>{new Date(p.created_at).toLocaleDateString()} · {p.payer_reference||"No reference"}</small></div><span className={`premiumStatus ${p.status}`}>{p.status}</span></div>}):<p>No payment requests yet.</p>}</div></article>
  </section>
 </main>;
}
