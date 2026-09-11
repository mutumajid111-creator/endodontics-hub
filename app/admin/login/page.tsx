"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage(){
 const router=useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
 async function handleSubmit(event:FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setError("");const {data,error:signInError}=await supabase.auth.signInWithPassword({email,password});if(signInError||!data.user){setError(signInError?.message||"Unable to sign in.");setLoading(false);return;}const {data:profile,error:profileError}=await supabase.from("profiles").select("role").eq("user_id",data.user.id).maybeSingle();if(profileError||profile?.role!=="admin"){await supabase.auth.signOut();setError("This account does not have admin access.");setLoading(false);return;}router.replace("/admin/tools");router.refresh();}
 return <main className="adminLoginPage"><form className="adminLoginCard" onSubmit={handleSubmit}><div style={{marginBottom:20}}><Brand href="/" compact/></div><p className="eyebrow">ADMIN ACCESS</p><h1>Control center</h1><p>Manage cases, lectures, subscriptions and Qi Card payment approvals.</p><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label>{error&&<div className="adminLoginError">{error}</div>}<button type="submit" disabled={loading}>{loading?"Signing in...":"Sign In"}</button></form></main>;
}
