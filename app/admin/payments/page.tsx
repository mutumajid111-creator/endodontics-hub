"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import { supabase } from "@/lib/supabase";

type Plan={name:string;interval:string};
type Payment={
 id:string; user_id:string; amount:number|null; currency:string; status:string; payer_reference:string|null; proof_path:string|null; created_at:string; review_note:string|null;
 subscription_plans:Plan|Plan[]|null;
};

function firstRelation<T>(value:T|T[]|null|undefined):T|null{return Array.isArray(value)?value[0]??null:value??null;}

export default function AdminPaymentsPage(){
 const router=useRouter(); const [items,setItems]=useState<Payment[]>([]); const [message,setMessage]=useState(""); const [loading,setLoading]=useState(true);
 async function refresh(){
  const {data}=await supabase.from("payment_transactions").select("id,user_id,amount,currency,status,payer_reference,proof_path,created_at,review_note,subscription_plans(name,interval)").order("created_at",{ascending:false});
  setItems((data||[]) as Payment[]); setLoading(false);
 }
 useEffect(()=>{async function boot(){const {data:{user}}=await supabase.auth.getUser();if(!user){router.replace("/admin/login");return;}const {data:p}=await supabase.from("profiles").select("role").eq("user_id",user.id).maybeSingle();if(p?.role!=="admin"){router.replace("/");return;}await refresh();}void boot();},[router]);
 async function approve(id:string){setMessage("");const note=window.prompt("Optional approval note")||null;const {error}=await supabase.rpc("approve_payment_transaction",{p_payment_id:id,p_note:note});setMessage(error?error.message:"Payment approved and membership activated.");await refresh();}
 async function reject(id:string){const note=window.prompt("Reason for rejection")||null;const {error}=await supabase.rpc("reject_payment_transaction",{p_payment_id:id,p_note:note});setMessage(error?error.message:"Payment rejected.");await refresh();}
 async function proof(path:string){const {data,error}=await supabase.storage.from("payment-proofs").createSignedUrl(path,120);if(error){setMessage(error.message);return;}window.open(data.signedUrl,"_blank","noopener,noreferrer");}
 return <main className="adminPremiumPage">
  <header className="memberHeader"><div className="shell memberNav"><Brand href="/admin" compact/><Link href="/admin" className="navcta">Admin home</Link></div></header>
  <section className="shell adminPremiumHero"><p className="eyebrow">ADMIN · QI CARD</p><h1>Payment approvals</h1><p>Review Qi Scan To Pay submissions and activate memberships with one click.</p></section>
  <section className="shell adminPaymentsList">
   {message&&<div className="formNotice">{message}</div>}
   {loading?<p>Loading payments...</p>:items.length===0?<div className="emptyPremium"><h2>No payment requests yet.</h2><p>New Qi submissions will appear here automatically.</p></div>:items.map(item=>{const plan=firstRelation(item.subscription_plans);return <article className="paymentAdminCard" key={item.id}>
    <div className="paymentAdminMain"><div className="paymentStatusRow"><span className={`premiumStatus ${item.status}`}>{item.status}</span><small>{new Date(item.created_at).toLocaleString()}</small></div><h2>{plan?.name||"Membership"}</h2><div className="paymentFacts"><span><small>AMOUNT</small><b>{item.amount==null?"—":`${Number(item.amount).toLocaleString()} ${item.currency}`}</b></span><span><small>REFERENCE</small><b>{item.payer_reference||"Not entered"}</b></span></div>{item.review_note&&<p className="reviewNote">{item.review_note}</p>}</div>
    <div className="paymentAdminActions">{item.proof_path&&<button className="btn secondary" onClick={()=>proof(item.proof_path!)}>View proof</button>}{item.status==="pending"&&<><button className="btn primary" onClick={()=>approve(item.id)}>Approve + Activate</button><button className="btn danger" onClick={()=>reject(item.id)}>Reject</button></>}</div>
   </article>} )}
  </section>
 </main>;
}
