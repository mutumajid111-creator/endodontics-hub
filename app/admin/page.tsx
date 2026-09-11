"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type CaseRow = {
  id: string;
  title: string;
  category: string | null;
  tooth: string | null;
  status: "draft" | "published";
};

type ArticleRow = {
  id: string;
  title: string;
  category: string | null;
  status: "draft" | "published";
};

export default function AdminPage() {
  const router = useRouter();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const [{ data: caseData }, { data: articleData }] = await Promise.all([
        supabase.from("cases").select("id,title,category,tooth,status").order("created_at", { ascending: false }),
        supabase.from("articles").select("id,title,category,status").order("created_at", { ascending: false }),
      ]);

      if (!active) return;
      setCases((caseData || []) as CaseRow[]);
      setArticles((articleData || []) as ArticleRow[]);
      setLoading(false);
    }

    loadDashboard();
    return () => { active = false; };
  }, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (loading) {
    return <main className="adminLoading">Loading dashboard...</main>;
  }

  return (
    <main className="adminPage">
      <aside className="adminSidebar">
        <Link href="/" className="adminBrand">ENDODONTICS HUB</Link>
        <nav>
          <a className="active" href="#overview">Overview</a>
          <a href="#cases">Cases</a>
          <a href="#research">Research</a>
          <a href="#media">Media</a>
        </nav>
        <div className="adminSideActions">
          <Link href="/" className="adminBack">← View website</Link>
          <button onClick={signOut}>Sign out</button>
        </div>
      </aside>

      <section className="adminMain">
        <div className="adminTop">
          <div><p className="eyebrow">ADMIN DASHBOARD</p><h1>Content control center.</h1></div>
          <button disabled>+ New Case</button>
        </div>

        <div id="overview" className="adminStats">
          <article><span>Clinical cases</span><strong>{cases.length}</strong></article>
          <article><span>Research notes</span><strong>{articles.length}</strong></article>
          <article><span>Database</span><strong>LIVE</strong></article>
        </div>

        <section id="cases" className="adminPanel">
          <div className="panelHead"><h2>Clinical Cases</h2><span>Connected to Supabase</span></div>
          {cases.length === 0 ? <p className="adminEmpty">No cases added yet.</p> : cases.map((item) => (
            <div className="adminRow" key={item.id}>
              <div><b>{item.title}</b><small>{item.category || "Uncategorized"} · {item.tooth || "Tooth not set"}</small></div>
              <span>{item.status}</span>
              <button disabled>Edit</button>
            </div>
          ))}
        </section>

        <section id="research" className="adminPanel">
          <div className="panelHead"><h2>Research & Notes</h2><span>Connected to Supabase</span></div>
          {articles.length === 0 ? <p className="adminEmpty">No research notes added yet.</p> : articles.map((item) => (
            <div className="adminRow" key={item.id}>
              <div><b>{item.title}</b><small>{item.category || "Uncategorized"}</small></div>
              <span>{item.status}</span>
              <button disabled>Edit</button>
            </div>
          ))}
        </section>

        <section id="media" className="adminPanel emptyPanel">
          <h2>Media Library</h2>
          <p>Supabase Storage is ready. Upload controls will be enabled in the next step.</p>
        </section>
      </section>
    </main>
  );
}
