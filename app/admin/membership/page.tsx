"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import { supabase } from "@/lib/supabase";

type Plan={id:string;code:string;name:string;interval:string;price_amount:number|null;currency:string;active:boolean};

export default function AdminMembershipPage(){
 const router=useRouter(); const [plans,setPlans]=useState<Plan[]>([]); const [message,setMessage]=useState("");
 async function refresh(){const {data}=await supabase.from("subscription_plans").select("id,code,name,interval,price_amount,currency,active").order("created_at");setPlans((data||[]) as Plan[]);}
 useEffect(()=>{async function boot(){const {data:{user}}=await supabase.auth.getUser();if(!user){router.replace("/admin/login");return;}const {data:p}=await supabase.from("profiles").select("role").eq("user_id",user.id).maybeSingle();if(p?.role!=="admin"){router.replace("/");return;}await refresh();}void boot();},[router]);
 async function savePlan(e:FormEvent<HTMLFormElement>,plan:Plan){e.preventDefault();const f=new FormData(e.currentTarget);const price=Number(f.get("price")||0);const currency=String(f.get("currency")||"IQD");const {error}=await supabase.from("subscription_plans").update({price_amount:price>0?price:null,currency}).eq("id",plan.id);setMessage(error?error.message:"Plan updated.");await refresh();}
 async function activate(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);const email=String(f.get("email")||"");const plan=String(f.get("plan")||"monthly");const {error}=await supabase.rpc("admin_activate_subscription",{target_email:email,target_plan_code:plan});setMessage(error?error.message:"Subscription activated.");if(!error)e.currentTarget.reset();}
 return <main className="adminPremiumPage"><header className="memberHeader"><div className="shell memberNav"><Brand href="/admin/tools" compact/><Link href="/admin/tools" className="navcta">Admin tools</Link></div></header><section className="shell adminPremiumHero"><p className="eyebrow">ADMIN · MEMBERSHIP</p><h1>Plans & access</h1><p>Set monthly and annual prices in IQD or USD. Changes appear on the public pricing page automatically.</p></section><section className="shell" style={{padding:"36px 0 100px"}}>
 {message&&<div className="formNotice" style={{marginBottom:20}}>{message}</div>}
 <div className="pricingGrid" style={{padding:0}}>{plans.map(plan=><form key={plan.id} onSubmit={e=>savePlan(e,plan)} className={`pricingCard ${plan.code==="annual"?"featured":""}`}><p className="eyebrow">{plan.interval.toUpperCase()}</p><h2>{plan.name}</h2><div className="memberForm"><label>Price<input name="price" type="number" min="0" step="1" defaultValue={plan.price_amount??""} placeholder="Enter amount"/></label><label>Currency<select name="currency" defaultValue={plan.currency}><option value="IQD">IQD</option><option value="USD">USD</option></select></label><button className="btn primary" type="submit">Save Plan</button></div></form>)}</div>
 <article className="accountCard" style={{maxWidth:720,marginTop:28}}><p className="eyebrow">MANUAL ACCESS</p><h2>Activate a member manually</h2><p style={{color:"#8ea4ba"}}>For complimentary access or payments confirmed outside the Qi approval workflow.</p><form onSubmit={activate} className="memberForm"><label>Member email<input name="email" type="email" placeholder="dentist@example.com" required/></label><label>Plan<select name="plan"><option value="monthly">Monthly Membership</option><option value="annual">Annual Membership</option></select></label><button className="btn primary" type="submit">Activate Subscription</button></form></article>
 </section></main>;
}
