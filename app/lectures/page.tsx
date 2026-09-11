"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lecture = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  sort_order: number;
};

export default function LecturesPage() {
  const router = useRouter();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login?next=/lectures");
        return;
      }
      const { data } = await supabase.from("lectures").select("id,title,slug,description,category,sort_order").eq("status", "published").order("sort_order").order("created_at");
      setLectures(data || []);
      setLoading(false);
    }
    void load();
  }, [router]);

  return (
    <main>
      <header className="header"><div className="shell nav"><Link href="/" className="logo"><span className="mark">E</span><span><strong>ENDODONTICS</strong><small>LECTURE LIBRARY</small></span></Link><Link href="/" className="navcta">Home</Link></div></header>
      <section className="pageHero shell"><p className="eyebrow">MEMBERS ONLY</p><h1>Endodontic Lectures</h1><p>Private educational videos available only after signing in.</p></section>
      <section className="shell researchList">
        {loading ? <p>Loading lectures...</p> : lectures.length ? lectures.map((lecture, i) => (
          <article key={lecture.id}><span>{String(i + 1).padStart(2,"0")}</span><div><small>{lecture.category || "LECTURE"}</small><h2>{lecture.title}</h2><p>{lecture.description}</p></div><Link href={`/lectures/${lecture.slug}`}>Watch →</Link></article>
        )) : <p>No lectures published yet.</p>}
      </section>
    </main>
  );
}
