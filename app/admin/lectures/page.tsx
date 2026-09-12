"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/Brand";
import { supabase } from "@/lib/supabase";

type Lecture={id:string;title:string;slug:string;youtube_video_id:string;category:string|null;status:string;access_level:"free"|"subscriber"};

function videoId(value:string){
 const v=value.trim();
 if(/^[A-Za-z0-9_-]{11}$/.test(v))return v;
 try{
  const u=new URL(v);
  const host=u.hostname.replace(/^www\./,"");
  if(host==="youtu.be")return u.pathname.split("/").filter(Boolean)[0]||"";
  if(host.endsWith("youtube.com")){
   const fromQuery=u.searchParams.get("v");
   if(fromQuery)return fromQuery;
   const parts=u.pathname.split("/").filter(Boolean);
   if(["embed","shorts","live"].includes(parts[0]))return parts[1]||"";
  }
  return "";
 }catch{return "";}
}
function slugify(v:string){return v.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}

export default function AdminLecturesPage(){
 const router=useRouter(); const [items,setItems]=useState<Lecture[]>([]); const [message,setMessage]=useState(""); const [youtubeLink,setYoutubeLink]=useState("");
 async function refresh(){const {data}=await supabase.from("lectures").select("id,title,slug,youtube_video_id,category,status,access_level").order("created_at",{ascending:false});setItems((data||[]) as Lecture[]);}
 useEffect(()=>{async function boot(){const {data:{session}}=await supabase.auth.getSession();if(!session){router.replace("/admin/login");return;}const {data:p}=await supabase.from("profiles").select("role").eq("user_id",session.user.id).maybeSingle();if(p?.role!=="admin"){router.replace("/");return;}await refresh();}void boot();},[router]);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  const f=new FormData(e.currentTarget);
  const title=String(f.get("title")||"");
  const id=videoId(String(f.get("youtube")||""));
  if(!title||!id){setMessage("Enter a lecture title and a valid YouTube link.");return;}
  const status=String(f.get("status")||"draft");
  const access=String(f.get("access")||"subscriber");
  const {error}=await supabase.from("lectures").insert({title,slug:slugify(title),description:String(f.get("description")||""),category:String(f.get("category")||""),youtube_video_id:id,status,access_level:access,published_at:status==="published"?new Date().toISOString():null});
  if(error){setMessage(error.message);return;}
  e.currentTarget.reset();setYoutubeLink("");setMessage("Lecture saved successfully.");await refresh();
 }
 async function remove(id:string){if(!confirm("Delete this lecture?"))return;await supabase.from("lectures").delete().eq("id",id);await refresh();}
 const detectedId=videoId(youtubeLink);
 return <main className="adminPremiumPage"><header className="memberHeader"><div className="shell memberNav"><Brand href="/admin/tools" compact/><Link href="/admin/tools" className="navcta">Admin tools</Link></div></header><section className="shell adminPremiumHero"><p className="eyebrow">ADMIN · LECTURES</p><h1>Private video library</h1><p>Paste the full YouTube link. The platform extracts the video ID automatically. YouTube Unlisted is recommended for member-only lectures.</p></section><section className="shell" style={{padding:"36px 0 100px"}}>
 {message&&<div className="formNotice" style={{marginBottom:18}}>{message}</div>}
 <article className="accountCard" style={{maxWidth:820}}><form onSubmit={submit} className="memberForm"><label>Lecture title<input name="title" placeholder="Obturation — Warm Vertical Compaction" required/></label><label>Category<input name="category" placeholder="Obturation, Shaping, Retreatment..."/></label><label>Description<textarea name="description" placeholder="Short description" rows={4}/></label><label>YouTube video link<input name="youtube" value={youtubeLink} onChange={e=>setYoutubeLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..." required/></label>{youtubeLink&&<div className="formNotice" style={{marginTop:-6,marginBottom:14}}>{detectedId?<>Video detected ✓ &nbsp; <strong>{detectedId}</strong></>:<>Link not recognized yet. Paste a normal YouTube, youtu.be, Shorts, Live or Embed link.</>}</div>}<div className="formGrid"><label>Status<select name="status" defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option></select></label><label>Access<select name="access" defaultValue="subscriber"><option value="subscriber">Subscriber only</option><option value="free">Free</option></select></label></div><button className="btn primary" type="submit">Save Lecture</button></form></article>
 <div className="adminPaymentsList" style={{paddingBottom:0}}>{items.map(x=><article className="paymentAdminCard" key={x.id}><div><span className={`premiumStatus ${x.status}`}>{x.status}</span><h2 style={{font:"26px Georgia,serif"}}>{x.title}</h2><p style={{color:"#8ea4ba"}}>{x.category||"Lecture"} · {x.access_level==="subscriber"?"Subscriber only":"Free"}</p></div><div className="paymentAdminActions">{x.status==="published"&&<Link href={`/lectures/${x.slug}`} className="btn secondary">Watch</Link>}<button className="btn danger" onClick={()=>remove(x.id)}>Delete</button></div></article>)}</div>
 </section></main>;
}
