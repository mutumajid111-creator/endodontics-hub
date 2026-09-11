"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lecture = { title: string; description: string | null; category: string | null; youtube_video_id: string };

export default function LecturePlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace(`/admin/login?next=/lectures/${slug}`); return; }
      const { data } = await supabase.from("lectures").select("title,description,category,youtube_video_id").eq("slug", slug).eq("status", "published").maybeSingle();
      setLecture(data);
      setLoading(false);
    }
    void load();
  }, [router, slug]);

  if (loading) return <main className="shell section"><p>Loading lecture...</p></main>;
  if (!lecture) return <main className="shell section"><h1>Lecture not found</h1><Link href="/lectures">Back to lectures</Link></main>;

  return (
    <main>
      <header className="header"><div className="shell nav"><Link href="/lectures" className="logo"><span className="mark">E</span><span><strong>ENDODONTICS</strong><small>LECTURE PLAYER</small></span></Link><Link href="/lectures" className="navcta">All Lectures</Link></div></header>
      <section className="pageHero shell"><p className="eyebrow">{lecture.category || "LECTURE"}</p><h1>{lecture.title}</h1><p>{lecture.description}</p></section>
      <section className="shell" style={{paddingBottom:"80px"}}>
        <div style={{position:"relative",paddingTop:"56.25%",background:"#071c1d",borderRadius:"18px",overflow:"hidden"}}>
          <iframe title={lecture.title} src={`https://www.youtube-nocookie.com/embed/${lecture.youtube_video_id}?rel=0&modestbranding=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" style={{position:"absolute",inset:0,width:"100%",height:"100%",border:0}} />
        </div>
        <p style={{marginTop:"16px",opacity:.7}}>This lecture is provided through the protected member area. Please do not share course access.</p>
      </section>
    </main>
  );
}
