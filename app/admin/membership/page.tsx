"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Plan={id:string;code:string;name:string;interval:string;price_amount:number|null;currency:string;active:boolean};

export default function AdminMembershipPage(){
 const router=useRouter(); const [plans,setPlans]=useState<Plan[]>([]); const [message,setMessage]=useState("");
 async function refresh(){const {data}=await supabase.from("subscription_plans").select("id,code,name,interval,price_amount,currency,active").order("created_at");setPlans((data||[]) as Plan[]);}
 useEffect(()=>{async function boot(){const {data:{user}}=await supabase.auth.getUser();if(!user){router.replace("/admin/login");return;}const {data:p}=await supabase.from("profiles").select("role").eq("user_id",user.id).maybeSingle();if(p?.role!=="admin"){router.replace("/");return;}await refresh();}void boot();},[router]);
 async function savePlan(e:FormEvent<HTMLFormElement>,plan:Plan){e.preventDefault();const f=new FormData(e.currentTarget);const price=Number(f.get("price")||0);const currency=String(f.get("currency")||"IQD");const {error}=await supabase.from("subscription_plans").update({price_amount:price>0?price:null,currency}).eq("id",plan.id);setMessage(error?error.message:"Plan updated.");await refresh();}
 async function activate(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);const email=String(f.get("email")||"");const plan=String(f.get("plan")||"monthly");const {error}=await supabase.rpc("admin_activate_subscription",{target_email:email,target_plan_code:plan});setMessage(error?error.message:"Subscription activated.");if(!error)e.currentTarget.reset();}
 return <main className="shell section"><div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"center",flexWrap:"wrap"}}><div><p className="eyebrow">ADMIN</p><h1>Membership</h1></div><Link href="/admin" className="btn secondary">Back to Admin</Link></div>
 {message&&<div style={{margin:"20px 0",padding:14,background:"#fff",border:"1px solid #d8dfdb"}}>{message}</div>}
 <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20,marginTop:30}}>{plans.map(plan=><form key={plan.id} onSubmit={e=>savePlan(e,plan)} style={{background:"#fff",padding:24,border:"1px solid #d8dfdb",borderRadius:14}}><p className="eyebrow">{plan.interval.toUpperCase()}</p><h2>{plan.name}</h2><label style={{display:"grid",gap:7,marginTop:14}}>Price<input name="price" type="number" min="0" step="1" defaultValue={plan.price_amount??""}/></label><label style={{display:"grid",gap:7,marginTop:14}}>Currency<select name="currency" defaultValue={plan.currency}><option value="IQD">IQD</option><option value="USD">USD</option></select></label><button className="btn primary" type="submit" style={{marginTop:18}}>Save Plan</button></form>)}</section>
 <section style={{marginTop:40,background:"#fff",padding:26,border:"1px solid #d8dfdb",borderRadius:14,maxWidth:700}}><p className="eyebrow">MANUAL ACCESS</p><h2>Activate a member manually</h2><p>Useful while Qi Card merchant activation is pending or for complimentary access.</p><form onSubmit={activate} style={{display:"grid",gap:12,marginTop:18}}><input name="email" type="email" placeholder="Member email" required/><select name="plan"><option value="monthly">Monthly Membership</option><option value="annual">Annual Membership</option></select><button className="btn primary" type="submit">Activate Subscription</button></form></section>
 </main>;
}
