import Link from "next/link";
import { clinicalCases, researchNotes } from "@/lib/content";

export const metadata = { title: "Admin | Endodontics Hub" };

export default function AdminPage() {
  return (
    <main className="adminPage">
      <aside className="adminSidebar">
        <Link href="/" className="adminBrand">ENDODONTICS HUB</Link>
        <nav><a className="active" href="#overview">Overview</a><a href="#cases">Cases</a><a href="#research">Research</a><a href="#media">Media</a><a href="#settings">Settings</a></nav>
        <Link href="/" className="adminBack">← View website</Link>
      </aside>
      <section className="adminMain">
        <div className="adminTop"><div><p className="eyebrow">ADMIN DASHBOARD</p><h1>Content control center.</h1></div><button disabled>+ New Case</button></div>
        <div id="overview" className="adminStats"><article><span>Clinical cases</span><strong>{clinicalCases.length}</strong></article><article><span>Research notes</span><strong>{researchNotes.length}</strong></article><article><span>Media files</span><strong>0</strong></article></div>
        <section id="cases" className="adminPanel"><div className="panelHead"><h2>Clinical Cases</h2><span>Supabase connection pending</span></div>{clinicalCases.map((item) => <div className="adminRow" key={item.slug}><div><b>{item.title}</b><small>{item.category} · {item.tooth}</small></div><span>Published</span><button disabled>Edit</button></div>)}</section>
        <section id="research" className="adminPanel"><div className="panelHead"><h2>Research & Notes</h2><span>Supabase connection pending</span></div>{researchNotes.map((item) => <div className="adminRow" key={item.slug}><div><b>{item.title}</b><small>{item.tag}</small></div><span>Draft</span><button disabled>Edit</button></div>)}</section>
        <section id="media" className="adminPanel emptyPanel"><h2>Media Library</h2><p>Image upload will be enabled after connecting a dedicated Supabase Storage bucket.</p></section>
      </section>
    </main>
  );
}
