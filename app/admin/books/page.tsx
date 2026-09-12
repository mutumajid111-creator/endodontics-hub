"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import { supabase } from "@/lib/supabase";

function slugify(v:string){return v.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
function drivePreview(url:string){const m=url.match(/\/d\/([^/]+)/)||url.match(/[?&]id=([^&]+)/);return m?.[1]?`https://drive.google.com/file/d/${m[1]}/preview`:url;}

export default function AdminBooksPage(){
 const router=useRouter();const [message,setMessage]=useState("");const [preview,setPreview]=useState("");
 useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user){router.replace("/admin/login");return;}const {data:p}=await supabase.from("profiles").select("role").eq("user_id",user.id).maybeSingle();if(p?.role!=="admin")router.replace("/");})();},[router]);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);const title=String(f.get("title")||"").trim();const url=String(f.get("drive")||"").trim();const excerpt=String(f.get("description")||"").trim();const status=String(f.get("status")||"draft");if(!title||!url){setMessage("Enter the book title and Google Drive link.");return;}const {error}=await supabase.from("articles").insert({title,slug:slugify(title),excerpt,content:url,category:"Book",status,access_level:"subscriber",published_at:status==="published"?new Date().toISOString():null});if(error){setMessage(error.message);return;}setMessage("Book saved.");setPreview(drivePreview(url));e.currentTarget.reset();}
 return <main className="adminPremiumPage"><header className="memberHeader"><div className="shell memberNav"><Brand href="/admin" compact/><Link href="/admin" className="navcta">Admin dashboard</Link></div></header><section className="shell adminPremiumHero"><p className="eyebrow">ADMIN · BOOKS</p><h1>Add Google Drive books</h1><p>Store the PDF in Google Drive, paste the sharing link here, and subscribers will read it inside the website viewer.</p></section><section className="shell" style={{padding:"36px 0 100px"}}>{message&&<div className="formNotice" style={{marginBottom:18}}>{message}</div>}<article className="accountCard" style={{maxWidth:820}}><form className="memberForm" onSubmit={submit}><label>Book title<input name="title" required placeholder="Book title"/></label><label>Description<textarea name="description" rows={4} placeholder="Short description"/></label><label>Google Drive PDF link<input name="drive" required placeholder="https://drive.google.com/file/d/.../view" onChange={e=>setPreview(drivePreview(e.target.value))}/><small>Set the Drive file to Anyone with the link → Viewer.</small></label><label>Status<select name="status" defaultValue="published"><option value="draft">Draft</option><option value="published">Published</option></select></label><button className="btn primary" type="submit">Save Book</button></form></article>{preview&&<article className="accountCard" style={{marginTop:24}}><h2>Preview</h2><iframe src={preview} style={{width:"100%",height:"70vh",border:0,borderRadius:16}} allow="autoplay"/></article>}</section></main>;
}
