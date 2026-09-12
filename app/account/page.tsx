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
 const router=useRouter();
 const [email,setEmail]=useState("");
 const [name,setName]=useState("");
 const [sub,setSub]=useState<SubRow|null>(null);
 const [payments,setPayments]=useState<PaymentRow[]>([]);
 const [loading,setLoading]=useState(true);

 useEffect(()=>{let timer:ReturnType<typeof setInterval>|undefined;
  async function kickToLogin(){await supabase.auth.signOut();router.replace("/member/login?next=/account");router.refresh();}
  async function load(){
   const {data:{user}}=await supabase.auth.getUser();
   if(!user){router.replace("/member/login?next=/account");return;}
   const ok=await ensureThisDevice();
   if(!ok){await kickToLogin();return;}
   setEmail(user.email||"");
   const [{data:profile},{data:s},{data:p}]=await Promise.all([
    supabase.from("profiles").select("full_name").eq("user_id",user.id).maybeSingle(),
    supabase.from("subscriptions").select("status,starts_at,ends_at,subscription_plans(name,interval)").eq("user_id",user.id).order("created_at",{ascending:false}).limit(1).maybeSingle(),
    supabase.from("payment_transactions").select("id,status,amount,currency,created_at,payer_reference,subscription_plans(name)").eq("user_id",user.id).order("created_at",{ascending:false}).limit(8)
   ]);
   setName(profile?.full_name?.trim()||"");
   setSub((s as SubRow|null)||null);
   setPayments((p||[]) as PaymentRow[]);
   setLoading(false);
   timer=setInterval(async()=>{if(!(await isCurrentDevice()))await kickToLogin();},60000);
  }
  void load();return()=>{if(timer)clearInterval(timer);};
 },[router]);

 async function logout(){await supabase.auth.signOut();router.replace("/");router.refresh();}
 if(loading)return <main className="memberLoading">Loading your member dashboard...</main>;

 const active=sub?.status==="active" && (!sub.ends_at || new Date(sub.ends_at)>new Date());
 const activePlan=firstRelation(sub?.subscription_plans);
 const latestPayment=payments[0];
 const firstName=name?name.split(" ")[0]:"Doctor";
 const accessUntil=sub?.ends_at?new Date(sub.ends_at).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}):"No expiry";

 return <main className="memberPage">
  <header className="memberHeader"><div className="shell memberNav"><Brand/><div style={{display:"flex",gap:10,alignItems:"center"}}><Link href="/lectures" className="subscribeLink">Learning Library</Link><button onClick={logout} className="navcta">Sign out</button></div></div></header>

  <section className="memberDashboardHero">
   <div className="shell memberDashboardHeroInner">
    <div><p className="eyebrow">MEMBER DASHBOARD</p><h1>Welcome back, {firstName}.</h1><p>Your private Endodontics learning space — lectures, clinical cases, research and premium resources in one place.</p></div>
    <div className="memberHeroBadge"><span>{active?"ACCESS STATUS":"MEMBERSHIP STATUS"}</span><strong>{active?"Active Member":sub?.status||"Not Active"}</strong></div>
   </div>
  </section>

  <section className="shell memberDashboard">
   <div className="memberQuickGrid">
    <Link href="/lectures" className="memberQuickCard"><span className="memberQuickIcon">▶</span><strong>Lectures</strong><small>Watch protected Endodontic video lectures.</small><span className="memberQuickArrow">Open library →</span></Link>
    <Link href="/cases" className="memberQuickCard"><span className="memberQuickIcon">◉</span><strong>Clinical Cases</strong><small>Explore documented cases, diagnosis and treatment steps.</small><span className="memberQuickArrow">Browse cases →</span></Link>
    <Link href="/research" className="memberQuickCard"><span className="memberQuickIcon">⌁</span><strong>Research</strong><small>Read selected papers and academic material.</small><span className="memberQuickArrow">View research →</span></Link>
    <Link href="/books" className="memberQuickCard"><span className="memberQuickIcon">▤</span><strong>Books</strong><small>Open the subscriber reading library.</small><span className="memberQuickArrow">Open books →</span></Link>
   </div>

   <div className="memberContentGrid">
    <article className="memberPanel">
     <div className="memberPanelHead"><div><span className="eyebrow">YOUR MEMBERSHIP</span><h2>{active?activePlan?.name||"Active Membership":"Membership access"}</h2><p>{email}</p></div><span className={`memberPill ${active?"active":sub?.status||""}`}>{active?"● Active":sub?.status||"Inactive"}</span></div>
     <div className="membershipFeature">
      <h3>{active?"Full premium access unlocked":"Unlock the complete platform"}</h3>
      <p>{active?"Your membership gives you access to subscriber lectures, private clinical cases, research and books.":"Choose a monthly or annual membership to unlock all premium content."}</p>
      <div className="membershipMeta"><div><small>Plan</small><strong>{activePlan?.name||"No active plan"}</strong></div><div><small>Access until</small><strong>{active?accessUntil:"—"}</strong></div></div>
      <div className="memberActions"><Link href="/pricing" className="btn primary">{active?"Renew membership":"Choose a plan"}</Link>{active&&<Link href="/lectures" className="btn secondary">Continue learning</Link>}</div>
     </div>
    </article>

    <article className="memberPanel">
     <div className="memberPanelHead"><div><span className="eyebrow">ACCOUNT SECURITY</span><h2>Protected access</h2></div><span className="memberPill active">● Secured</span></div>
     <div className="memberSecurity"><span className="memberSecurityIcon">✓</span><div><h3>One device at a time</h3><p>You stay signed in on this device until you sign out. If your account is used to sign in on another device, this device will be signed out automatically.</p></div></div>
     {latestPayment&&<div style={{marginTop:18}}><small style={{color:"#8a90a0"}}>LATEST PAYMENT REQUEST</small><div className="memberPaymentItem"><div><b>{firstRelation(latestPayment.subscription_plans)?.name||"Membership"}</b><small>{new Date(latestPayment.created_at).toLocaleDateString()} · {latestPayment.payer_reference||"No reference"}</small></div><span className={`memberPill ${latestPayment.status}`}>{latestPayment.status}</span></div></div>}
    </article>

    <article className="memberPanel" style={{gridColumn:"1 / -1"}}>
     <div className="memberPanelHead"><div><span className="eyebrow">QI CARD</span><h2>Payment history</h2><p>Your most recent subscription requests and their approval status.</p></div><Link href="/pricing" className="btn secondary">New request</Link></div>
     <div className="memberPaymentList">{payments.length?payments.map(p=>{const plan=firstRelation(p.subscription_plans);return <div className="memberPaymentItem" key={p.id}><div><b>{plan?.name||"Membership"}</b><small>{new Date(p.created_at).toLocaleDateString()} · {p.payer_reference||"No reference"}{p.amount?` · ${Number(p.amount).toLocaleString()} ${p.currency}`:""}</small></div><span className={`memberPill ${p.status}`}>{p.status}</span></div>}):<p style={{color:"#7c8496"}}>No payment requests yet.</p>}</div>
    </article>
   </div>
  </section>
 </main>;
}
