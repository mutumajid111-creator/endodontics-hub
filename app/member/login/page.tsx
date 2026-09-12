"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { claimThisDevice } from "@/lib/device-session";

export default function MemberLoginPage(){
  const router=useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setLoading(true); setError("");
    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error){setError(error.message);setLoading(false);return;}

    const claimed=await claimThisDevice();
    if(!claimed){await supabase.auth.signOut();setError("Unable to secure this device. Please try again.");setLoading(false);return;}

    const user=data.user;
    const {data:profile}=await supabase.from("profiles").select("role").eq("user_id",user.id).maybeSingle();
    if(profile?.role==="admin"){
      router.replace("/admin");
      router.refresh();
      return;
    }

    const next=new URLSearchParams(window.location.search).get("next") || "/account";
    router.replace(next.startsWith("/")?next:"/account");
    router.refresh();
  }

  return <main className="adminLoginPage"><form className="adminLoginCard" onSubmit={submit}>
    <p className="eyebrow">LOGIN</p><h1>Sign in</h1><p>Enter your email and password to continue. For security, one account can be active on one device at a time.</p>
    <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
    <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
    {error && <div className="adminLoginError">{error}</div>}
    <button type="submit" disabled={loading}>{loading?"Signing in...":"Login"}</button>
    <p style={{marginTop:18}}>New member? <Link href="/register">Create account</Link></p>
  </form></main>;
}
