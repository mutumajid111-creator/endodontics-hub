"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function MemberLoginPage(){
  const router=useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setLoading(true); setError("");
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error){setError(error.message);setLoading(false);return;}
    const next=new URLSearchParams(window.location.search).get("next") || "/account";
    router.replace(next.startsWith("/")?next:"/account");
    router.refresh();
  }

  return <main className="adminLoginPage"><form className="adminLoginCard" onSubmit={submit}>
    <p className="eyebrow">MEMBER ACCESS</p><h1>Sign in</h1><p>Access lectures, subscriber cases and premium clinical content.</p>
    <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
    <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
    {error && <div className="adminLoginError">{error}</div>}
    <button type="submit" disabled={loading}>{loading?"Signing in...":"Sign In"}</button>
    <p style={{marginTop:18}}>New member? <Link href="/register">Create account</Link></p>
  </form></main>;
}
