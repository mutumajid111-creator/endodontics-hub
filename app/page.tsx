import Link from "next/link";
import Brand from "@/components/Brand";
import SiteHeader from "@/components/SiteHeader";
import { createPublicSupabaseClient } from "@/lib/supabase-public";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createPublicSupabaseClient();

  const [{ data: lectureRows }, { data: caseRows }, { data: bookRows }] = await Promise.all([
    supabase.from("lecture_catalog").select("title,slug,category,published_at").order("published_at", { ascending: false, nullsFirst: false }).limit(1),
    supabase.from("case_catalog").select("title,slug,category,published_at").order("published_at", { ascending: false, nullsFirst: false }).limit(1),
    supabase.from("article_catalog").select("title,slug,published_at").eq("category", "Book").order("published_at", { ascending: false, nullsFirst: false }).limit(1),
  ]);

  const latestLecture = lectureRows?.[0];
  const latestCase = caseRows?.[0];
  const latestBook = bookRows?.[0];

  const cards = [
    {
      key: "lectures",
      label: "VIDEO LECTURES",
      title: "Lectures",
      description: "Focused endodontic video lectures with practical clinical teaching.",
      href: "/lectures",
      action: "View lectures",
      latest: latestLecture?.title || "Endodontic video learning",
    },
    {
      key: "cases",
      label: "CLINICAL CASES",
      title: "Cases",
      description: "Real endodontic cases with diagnosis, treatment sequence and outcome.",
      href: "/cases",
      action: "View cases",
      latest: latestCase?.title || "Clinical endodontic cases",
    },
    {
      key: "books",
      label: "BOOK LIBRARY",
      title: "Books",
      description: "Endodontic books and practical references available inside the platform.",
      href: "/books",
      action: "View books",
      latest: latestBook?.title || "Endodontic books & references",
    },
  ];

  return (
    <main>
      <SiteHeader/>

      <section id="home" className="hero shell">
        <div className="heroCopy">
          <div className="kicker"><span></span> MODERN CLINICAL ENDODONTICS</div>
          <h1>Preserve the tooth.<br/><em>Understand the canal.</em></h1>
          <p className="lead">A focused platform for clinical cases, endodontic education, evidence-based protocols and practical decision-making.</p>
          <div className="heroActions"><Link href="/cases" className="btn primary">Explore Clinical Cases</Link><Link href="/pricing" className="btn secondary">Membership</Link></div>
          <div className="metrics"><div><strong>Microscope</strong><span>assisted workflow</span></div><div><strong>Evidence</strong><span>based protocols</span></div><div><strong>Digital</strong><span>clinical documentation</span></div></div>
        </div>
        <div className="heroArt" aria-label="Dr. Muthanna Majid signature identity"><div className="gridlines"></div><img className="signatureMark" src="/signature-logo.webp" alt="Muthanna Majid signature logo" /></div>
      </section>

      <section className="shell" style={{padding:"72px 0 96px"}}>
        <div style={{marginBottom:34}}>
          <p className="eyebrow">ENDODONTICS HUB</p>
          <h2 style={{font:"600 clamp(38px,4vw,58px)/1.05 'Playfair Display',serif",margin:"14px 0 0",color:"var(--ink)"}}>Learn. Review. Apply.</h2>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:18}} className="homeLibraryGrid">
          {cards.map((card) => (
            <Link key={card.key} href={card.href} style={{textDecoration:"none",display:"block",border:"1px solid var(--line)",background:"var(--white)",borderRadius:8,overflow:"hidden",boxShadow:"0 18px 55px #3c35250d"}}>
              <div style={{height:250,position:"relative",overflow:"hidden",background:card.key==="cases"?"#1d2e68":card.key==="lectures"?"#121a35":"#e8dfcf"}}>
                {card.key === "lectures" && <>
                  <div style={{position:"absolute",inset:22,border:"1px solid #ffffff2e",borderRadius:6,display:"grid",placeItems:"center",background:"radial-gradient(circle at 50% 40%,#334272,#121a35 68%)"}}>
                    <div style={{width:72,height:72,borderRadius:"50%",background:"#fff",display:"grid",placeItems:"center",boxShadow:"0 14px 40px #0005"}}><span style={{fontSize:27,color:"#17204b",marginLeft:5}}>▶</span></div>
                  </div>
                  <span style={{position:"absolute",left:34,bottom:31,color:"#fff",font:"700 9px 'Manrope'",letterSpacing:1.6}}>PRIVATE VIDEO LECTURE</span>
                </>}

                {card.key === "cases" && <>
                  <div className="xrayTooth" style={{position:"absolute",inset:0,transform:"scale(1.18)"}}><b></b><b></b><b></b></div>
                  <span style={{position:"absolute",left:28,bottom:24,color:"#fff",font:"700 9px 'Manrope'",letterSpacing:1.5}}>CLINICAL CASE</span>
                </>}

                {card.key === "books" && <>
                  <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%) rotate(-4deg)",width:150,height:190,background:"#16214f",borderRadius:"3px 8px 8px 3px",boxShadow:"18px 20px 35px #5a4b3630",padding:"22px 18px",borderLeft:"10px solid #b88b34"}}>
                    <small style={{color:"#d6ae58",font:"700 8px 'Manrope'",letterSpacing:1.5}}>ENDODONTICS</small>
                    <div style={{height:1,background:"#ffffff33",margin:"16px 0"}}></div>
                    <strong style={{display:"block",color:"white",font:"600 21px/1.15 'Playfair Display'"}}>Clinical<br/>Reference</strong>
                  </div>
                </>}
              </div>

              <div style={{padding:"24px 26px 28px"}}>
                <span style={{font:"700 9px 'Manrope'",letterSpacing:1.5,color:"var(--bronze)"}}>{card.label}</span>
                <h3 style={{font:"600 31px 'Playfair Display'",margin:"9px 0 10px",color:"var(--ink)"}}>{card.title}</h3>
                <p style={{margin:"0 0 18px",color:"var(--muted)",lineHeight:1.7,fontSize:13}}>{card.description}</p>
                <div style={{padding:"13px 0",borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)",fontSize:12,color:"#5f6875",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{card.latest}</div>
                <div style={{marginTop:20,color:"var(--bronze)",font:"700 10px 'Manrope'",letterSpacing:.4}}>{card.action} ↗</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="about" className="about"><div className="shell aboutGrid"><div><p className="eyebrow">ABOUT</p><h2>Dr. Muthanna<br/>Majid Shayal</h2></div><div className="aboutText"><p className="big">Dentist and clinical researcher focused on Endodontics, microscope-assisted treatment and digital dentistry.</p><p>This independent platform is designed to document clinical cases, organize practical endodontic knowledge and create a growing educational resource for dentists.</p><div className="chips"><span>Endodontics</span><span>Clinical Research</span><span>Digital Dentistry</span><span>Microscopy</span></div></div></div></section>

      <section id="contact" className="contact shell"><img className="signatureMark" src="/signature-logo.webp" alt="Muthanna Majid" /><p className="eyebrow">COLLABORATION · EDUCATION · CASE DISCUSSION</p><h2>Build better endodontics.</h2><p>For lectures, professional collaboration, clinical education and research.</p><Link href="/pricing" className="btn primary">Join the platform</Link></section>
      <footer><div className="shell footerInner"><Brand compact/><span>Dr. Muthanna Majid Shayal · Maysan, Iraq</span><span>© 2026</span></div></footer>

      <style>{`@media(max-width:820px){.homeLibraryGrid{grid-template-columns:1fr!important}}`}</style>
    </main>
  );
}
