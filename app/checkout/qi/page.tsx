"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import QiQr, { QI_MERCHANT_URL } from "@/components/QiQr";
import { supabase } from "@/lib/supabase";
import { ensureThisDevice } from "@/lib/device-session";

type Plan={id:string;code:string;name:string;interval:string;price_amount:number|null;currency:string};

export default function QiCheckoutPage(){
 const router=useRouter();
 const [plan,setPlan]=useState<Plan|null>(null);
 const [loading,setLoading]=useState(true);
 const [saving,setSaving]=useState(false);
 const [reference,setReference]=useState("");
 const [proof,setProof]=useState<File|null>(null);
 const [message,setMessage]=useState("");
 const [done,setDone]=useState(false);

 useEffect(()=>{async function load(){
   const code=new URLSearchParams(window.location.search).get("plan")||"monthly";
   const next=`/checkout/qi?plan=${code}`;
   const {data:{user}}=await supabase.auth.getUser();
   if(!user){router.replace(`/member/login?next=${encodeURIComponent(next)}`);return;}
   const validDevice=await ensureThisDevice();
   if(!validDevice){await supabase.auth.signOut();router.replace(`/member/login?next=${encodeURIComponent(next)}`);return;}
   const {data}=await supabase.from("subscription_plans").select("id,code,name,interval,price_amount,currency").eq("code",code).eq("active",true).maybeSingle();
   setPlan((data as Plan|null)||null); setLoading(false);
 } void load();},[router]);

 async function submit(e:FormEvent<HTMLFormElement>){
   e.preventDefault(); if(!plan || plan.price_amount==null)return;
   if(!reference.trim() && !proof){setMessage("Enter the Qi transaction/reference number or upload a payment proof.");return;}
   setSaving(true); setMessage("");
   try{
     const {data:{user}}=await supabase.auth.getUser(); if(!user) throw new Error("Please sign in again.");
     const validDevice=await ensureThisDevice(); if(!validDevice) throw new Error("This account is active on another device. Please sign in again on this device.");
     const {data:tx,error:txError}=await supabase.from("payment_transactions").insert({user_id:user.id,plan_id:plan.id,provider:"qicard_qr",amount:plan.price_amount,currency:plan.currency,status:"pending",payer_reference:reference.trim()||null}).select("id").single();
     if(txError) throw txError;
     if(proof){
       const ext=proof.name.split(".").pop()?.toLowerCase()||"jpg";
       const path=`${user.id}/${tx.id}/proof.${ext}`;
       const {error:uploadError}=await supabase.storage.from("payment-proofs").upload(path,proof,{upsert:false,contentType:proof.type||undefined});
       if(uploadError) throw uploadError;
       const {error:updateError}=await supabase.from("payment_transactions").update({proof_path:path}).eq("id",tx.id);
       if(updateError) throw updateError;
     }
     setDone(true);
   }catch(err){setMessage(err instanceof Error?err.message:"Unable to submit payment.");}
   finally{setSaving(false);}
 }

 if(loading)return <main className="memberLoading">Loading checkout...</main>;
 if(!plan)return <main className="memberLoading"><div><h1>Plan not found</h1><Link href="/pricing">Back to pricing</Link></div></main>;

 return <main className="memberPage">
  <header className="memberHeader"><div className="shell memberNav"><Brand href="/" compact/><Link href="/pricing" className="navcta">Back to plans</Link></div></header>
  <section className="memberHero shell"><p className="eyebrow">QI CARD · SCAN TO PAY</p><h1>Complete your {plan.name.toLowerCase()}.</h1><p>Pay with the clinic Qi merchant QR, then send the transaction number or a payment screenshot. Access is activated after verification.</p></section>
  <section className="shell checkoutGrid">
    <article className="qiPaymentCard">
      <div className="qiTitle"><span>Qi</span><div><strong>Scan To Pay</strong><small>عيادة الدكتور مثنى ماجد شيال</small></div></div>
      <QiQr/>
      <div className="payAmount"><small>AMOUNT</small><strong>{plan.price_amount==null?"Set by admin":`${Number(plan.price_amount).toLocaleString()} ${plan.currency}`}</strong></div>
      <a className="qiOpenButton" href={QI_MERCHANT_URL} target="_blank" rel="noreferrer">Open Qi payment link</a>
    </article>

    <article className="paymentProofCard">
      {done ? <div className="paymentSuccess"><span>✓</span><h2>Payment sent for review</h2><p>Your request is now pending. When the payment is confirmed, the membership will activate automatically.</p><div className="memberActions"><Link href="/account" className="btn primary">View my account</Link><Link href="/" className="btn secondary">Home</Link></div></div> : <>
        <p className="eyebrow">STEP 2</p><h2>Confirm your payment</h2><p>After paying, enter the transaction/reference number. You can also upload a screenshot or PDF as proof.</p>
        <form className="memberForm" onSubmit={submit}>
          <label>Transaction / reference number<input value={reference} onChange={e=>setReference(e.target.value)} placeholder="Example: Qi transaction number"/></label>
          <label>Payment proof<input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={e=>setProof(e.target.files?.[0]||null)}/><small>JPG, PNG, WebP or PDF · max 10 MB</small></label>
          {message&&<div className="formNotice error">{message}</div>}
          <button className="btn primary fullButton" type="submit" disabled={saving||plan.price_amount==null}>{saving?"Submitting...":"I paid — send for approval"}</button>
          {plan.price_amount==null&&<p className="formHint">The membership price must be set by the administrator before payment can be submitted.</p>}
        </form>
      </>}
    </article>
  </section>
 </main>;
}
