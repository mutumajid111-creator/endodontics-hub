"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lecture = { id:string; title:string; slug:string; youtube_video_id:string; category:string|null; status:string };

function videoId(value:string) {
  const v=value.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(v)) return v;
  try { const u=new URL(v); if(u.hostname.includes("youtu.be")) return u.pathname.split("/")[1] || ""; return u.searchParams.get("v") || u.pathname.split("/embed/")[1]?.split("?")[0] || ""; } catch { return ""; }
}
function slugify(v:string){ return v.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }

export default function AdminLecturesPage(){
 const router=useRouter(); const [items,setItems]=useState<Lecture[]>([]); const [message,setMessage]=useState("");
 async function refresh(){ const {data}=await supabase.from("lectures").select("id,title,slug,youtube_video_id,category,status").order("created_at",{ascending:false}); setItems(data||[]); }
 useEffect(()=>{ async function boot(){ const {data:{session}}=await supabase.auth.getSession(); if(!session){router.replace("/admin/login");return;} const {data:p}=await supabase.from("profiles").select("role").eq("user_id",session.user.id).maybeSingle(); if(p?.role!=="admin"){router.replace("/");return;} await refresh(); } void boot(); },[router]);
 async function submit(e:FormEvent<HTMLFormElement>){ e.preventDefault(); const f=new FormData(e.currentTarget); const title=String(f.get("title")||""); const id=videoId(String(f.get("youtube")||"")); if(!title||!id){setMessage("Enter a title and a valid YouTube URL.");return;} const status=String(f.get("status")||"draft"); const {error}=await supabase.from("lectures").insert({title,slug:slugify(title),description:String(f.get("description")||""),category:String(f.get("category")||""),youtube_video_id:id,status,published_at:status==="published"?new Date().toISOString():null}); if(error){setMessage(error.message);return;} e.currentTarget.reset(); setMessage("Lecture saved."); await refresh(); }
 async function remove(id:string){ if(!confirm("Delete this lecture?"))return; await supabase.from("lectures").delete().eq("id",id); await refresh(); }
 return <main className="shell section"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:20,flexWrap:"wrap"}}><div><p className="eyebrow">ADMIN</p><h1>Lecture Library</h1></div><Link href="/admin" className="btn secondary">Back to Admin</Link></div>
 <form onSubmit={submit} style={{display:"grid",gap:14,maxWidth:760,marginTop:30}}><input name="title" placeholder="Lecture title" required/><input name="category" placeholder="Category e.g. Obturation"/><textarea name="description" placeholder="Short description" rows={4}/><input name="youtube" placeholder="YouTube Unlisted URL" required/><select name="status" defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option></select><button className="btn primary" type="submit">Save Lecture</button>{message&&<p>{message}</p>}</form>
 <div style={{marginTop:50,display:"grid",gap:12}}>{items.map(x=><div key={x.id} style={{display:"flex",justifyContent:"space-between",gap:16,padding:"18px",border:"1px solid rgba(20,45,45,.15)",borderRadius:12}}><div><b>{x.title}</b><p>{x.category||"Lecture"} · {x.status}</p></div><div style={{display:"flex",gap:10}}>{x.status==="published"&&<Link href={`/lectures/${x.slug}`}>Watch</Link>}<button onClick={()=>remove(x.id)}>Delete</button></div></div>)}</div></main>;
}
