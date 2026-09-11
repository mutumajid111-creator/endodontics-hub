"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage(){
  const router=useRouter();
  const [fullName,setFullName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setLoading(true); setMessage("");
    const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName}}});
    if(error){setMessage(error.message);setLoading(false);return;}
    if(data.session){router.replace("/pricing"); router.refresh(); return;}
    setMessage("Account created. Check your email if confirmation is required, then sign in."); setLoading(false);
  }

  return <main className="adminLoginPage"><form className="adminLoginCard" onSubmit={submit}>
    <p className="eyebrow">ENDODONTICS MEMBERSHIP</p><h1>Create account</h1><p>Register once, then choose a monthly or annual membership.</p>
    <label>Full name<input value={fullName} onChange={e=>setFullName(e.target.value)} required /></label>
    <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
    <label>Password<input type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required /></label>
    {message && <div className="adminLoginError">{message}</div>}
    <button type="submit" disabled={loading}>{loading?"Creating account...":"Create Account"}</button>
    <p style={{marginTop:18}}>Already registered? <Link href="/member/login">Sign in</Link></p>
  </form></main>;
}
