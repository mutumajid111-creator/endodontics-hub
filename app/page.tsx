import Link from "next/link";
import Image from "next/image";
import Brand from "@/components/Brand";
import SiteHeader from "@/components/SiteHeader";
import { createPublicSupabaseClient } from "@/lib/supabase-public";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createPublicSupabaseClient();

  const [
    { data: lectureRows },
    { data: caseRows },
    { data: bookRows },
    { count: lectureCount },
    { count: caseCount },
    { count: bookCount },
  ] = await Promise.all([
    supabase.from("lecture_catalog").select("title,slug,published_at").order("published_at", { ascending: false, nullsFirst: false }).limit(1),
    supabase.from("case_catalog").select("title,slug,published_at").order("published_at", { ascending: false, nullsFirst: false }).limit(1),
    supabase.from("article_catalog").select("title,slug,published_at").eq("category", "Book").order("published_at", { ascending: false, nullsFirst: false }).limit(1),
    supabase.from("lecture_catalog").select("id", { count: "exact", head: true }),
    supabase.from("case_catalog").select("id", { count: "exact", head: true }),
    supabase.from("article_catalog").select("id", { count: "exact", head: true }).eq("category", "Book"),
  ]);

  const latestLecture = lectureRows?.[0]?.title || "Video learning library";
  const latestCase = caseRows?.[0]?.title || "Clinical case library";
  const latestBook = bookRows?.[0]?.title || "Reference library";

  return (
    <main className="home2026">
      <SiteHeader/>

      <section className="conceptHero">
        <div className="shell conceptGrid">
          <div className="conceptCopy">
            <p className="conceptKicker">MODERN ENDODONTICS</p>
            <h1>Preserve the tooth.<br/><em>Advance with evidence.</em></h1>
            <p className="conceptLead">A comprehensive platform for endodontic education, real clinical cases, scientific knowledge and practical insights — designed for dentists who want to go further.</p>
            <div className="conceptActions">
              <Link href="/lectures" className="conceptPrimary">Start Learning <span>→</span></Link>
              <Link href="/cases" className="conceptIntro"><b>▶</b><span>Explore Cases<small>Clinical archive</small></span></Link>
            </div>
            <div className="conceptStats">
              <div><span>▱</span><strong>+{lectureCount ?? 0}</strong><small>Lectures</small></div>
              <div><span>♙</span><strong>+{caseCount ?? 0}</strong><small>Clinical Cases</small></div>
              <div><span>▤</span><strong>+{bookCount ?? 0}</strong><small>Books & Articles</small></div>
            </div>
          </div>

          <div className="conceptVisual">
            <Image className="heroMicroscope" src="/hero-microscope.webp" alt="Dental operating microscope with ivory optics and warm gold lighting in a navy clinical setting" fill sizes="(max-width: 900px) 92vw, 50vw" preload />
            <div className="visualShade" aria-hidden="true"></div>
            <div className="visualWords"><span>SCIENCE</span><span>SKILL</span><span>BETTER OUTCOMES</span><i></i></div>
            <div className="visualSignature"><img src="/signature-logo.webp" alt="Muthanna Majid signature"/></div>
          </div>
        </div>
      </section>

      <section className="resourceSection shell">
        <div className="resourceGrid">
          <article className="resourceCard">
            <div className="resourceMedia lectureMedia">
              <span className="resourceIcon" aria-hidden="true">▶</span>
              <Image src="/resource-lectures.webp" alt="Illustrative endodontic learning workspace with a laptop and reference notes" fill sizes="(max-width: 900px) 94vw, 33vw" className="resourcePhoto" />
            </div>
            <div className="resourceBody">
              <h2>Lectures</h2>
              <p>High-quality lectures covering the full spectrum of modern endodontics.</p>
              <div className="resourceFoot"><Link href="/lectures">Explore Lectures →</Link><span>{latestLecture}</span></div>
            </div>
          </article>

          <article className="resourceCard">
            <div className="resourceMedia caseMedia">
              <span className="resourceIcon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3H5v18h14V3h-4M9 2h6v4H9zM8 12h8M12 8v8"/></svg></span>
              <Image src="/resource-cases.webp" alt="Endodontic files and dental mirror arranged on a clinical instrument tray" fill sizes="(max-width: 900px) 94vw, 33vw" className="resourcePhoto" />
            </div>
            <div className="resourceBody">
              <h2>Clinical Cases</h2>
              <p>Step-by-step real cases with clear diagnosis, treatment planning and outcomes.</p>
              <div className="resourceFoot"><Link href="/cases">Explore Cases →</Link><span>{latestCase}</span></div>
            </div>
          </article>

          <article className="resourceCard">
            <div className="resourceMedia bookMedia">
              <span className="resourceIcon" aria-hidden="true">▤</span>
              <Image src="/resource-books.webp" alt="Navy reference books and an open volume under warm reading light" fill sizes="(max-width: 900px) 94vw, 33vw" className="resourcePhoto" />
            </div>
            <div className="resourceBody">
              <h2>Books</h2>
              <p>Essential books and references for evidence-based endodontic practice.</p>
              <div className="resourceFoot"><Link href="/books">Explore Books →</Link><span>{latestBook}</span></div>
            </div>
          </article>
        </div>
        <div className="conceptDivider"><i></i><span>EDUCATION</span><b>·</b><span>EVIDENCE</span><b>·</b><span>CLINICAL EXCELLENCE</span><i></i></div>
      </section>

      <footer className="homeFooter"><div className="shell footerInner"><Brand compact/><span>Dr. Muthanna Majid Shayal · Maysan, Iraq</span><span>© 2026</span></div></footer>

      <style>{`
        .home2026{background:#fbfaf7;color:#142653;min-height:100vh}
        .conceptHero{background:linear-gradient(90deg,#fbfaf7 0%,#fbfaf7 48%,#f2f1ee 48%,#0b1f38 100%);border-bottom:1px solid #e6dfd2}
        .conceptGrid{display:grid;grid-template-columns:1fr 1fr;min-height:500px}
        .conceptCopy{min-width:0;padding:58px 54px 34px 0;display:flex;flex-direction:column;justify-content:center}
        .conceptKicker{margin:0 0 16px;color:#b98314;font:700 10px 'Manrope',sans-serif;letter-spacing:4px}
        .conceptCopy h1{margin:0;color:#10234f;font:600 clamp(46px,4.8vw,72px)/.98 'Playfair Display',serif;letter-spacing:-2px}
        .conceptCopy h1 em{display:inline-block;color:#c08b19;font-weight:600;margin-top:6px}
        .conceptLead{max-width:610px;margin:23px 0 0;color:#66728a;font-size:14px;line-height:1.85}
        .conceptActions{display:flex;align-items:center;gap:28px;margin-top:27px}
        .conceptPrimary{display:inline-flex;align-items:center;gap:34px;background:#11275d;color:white;padding:14px 26px;border-radius:999px;text-decoration:none;font:700 11px 'Manrope';box-shadow:0 12px 30px #11275d1f}.conceptPrimary span{font-size:17px}
        .conceptIntro{display:flex;align-items:center;gap:11px;text-decoration:none;color:#142653}.conceptIntro>b{width:39px;height:39px;border:1px solid #142653;border-radius:50%;display:grid;place-items:center;font-size:11px}.conceptIntro>span{display:flex;flex-direction:column;font:700 10px 'Manrope'}.conceptIntro small{margin-top:3px;color:#8c94a4;font-weight:500}
        .conceptStats{display:flex;margin-top:31px;padding-top:21px;border-top:1px solid #e3dccf}.conceptStats>div{min-width:142px;padding-right:24px;margin-right:24px;border-right:1px solid #e4ddd1;display:grid;grid-template-columns:27px auto;grid-template-rows:auto auto;align-items:center}.conceptStats>div:last-child{border-right:0}.conceptStats>div>span{grid-row:1/3;color:#c08b19;font-size:21px}.conceptStats strong{font:700 16px 'Manrope';color:#142653}.conceptStats small{font-size:9px;color:#798398}
        .conceptVisual{position:relative;min-width:0;overflow:hidden;isolation:isolate;background:#071626}
        .visualShade{position:absolute;inset:0;background:linear-gradient(180deg,#06152940,transparent 27%,transparent 60%,#061529);pointer-events:none}
        .heroMicroscope{object-fit:cover;object-position:50% 42%}
        .visualWords{position:absolute;left:7%;bottom:9%;display:flex;flex-direction:column;gap:9px;color:#e8edf5;font:500 10px 'Manrope';letter-spacing:3px}.visualWords i{width:54px;height:2px;background:#c79524;margin-top:10px}
        .visualSignature{position:absolute;right:4%;bottom:8%;width:42%;opacity:.88}.visualSignature img{width:100%;display:block;filter:brightness(0) invert(1)}
        .resourceSection{padding:18px 0 50px}
        .resourceGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .resourceCard{overflow:hidden;border:1px solid #e4ded2;border-radius:9px;background:#fff;box-shadow:0 16px 40px #17244b0a}
        .resourceMedia{width:100%;aspect-ratio:2/1;max-height:300px;position:relative;overflow:hidden;background:#0b1f38}.resourcePhoto{object-fit:cover;object-position:50% 52%}.resourceMedia:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(135deg,#06152935,transparent 55%)}.resourceIcon{position:absolute;z-index:1;left:16px;top:16px;width:36px;height:36px;border:1px solid #d4af4b88;border-radius:50%;display:grid;place-items:center;background:#0b1f38db;color:#f1d58d;font-size:15px}
        .resourceBody{padding:18px 20px 20px}.resourceBody h2{margin:0;color:#142653;font:600 28px 'Playfair Display'}.resourceBody p{min-height:44px;margin:8px 0 13px;color:#68738a;font-size:12px;line-height:1.55}
        .resourceFoot{border-top:1px solid #eee8dc;margin-top:18px;padding-top:15px;display:flex;align-items:center;justify-content:space-between;gap:14px}.resourceFoot a{color:#b77f0d;text-decoration:none;font:700 10px 'Manrope'}.resourceFoot span{max-width:48%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#8a92a3;font-size:9px}
        .conceptDivider{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:28px;color:#7b8599;font:600 8px 'Manrope';letter-spacing:2.5px}.conceptDivider i{width:80px;height:1px;background:#d8cda9}.conceptDivider b{color:#b88b23}
        .homeFooter{background:#fbfaf7}
        @media(max-width:900px){.conceptHero{background:#fbfaf7}.conceptGrid{grid-template-columns:1fr}.conceptCopy{min-width:0;padding:50px 0 38px}.conceptVisual{min-height:430px;aspect-ratio:4/3}.heroMicroscope{object-position:50% 38%}.resourceGrid{grid-template-columns:1fr}.conceptStats{overflow:auto}.conceptStats>div{min-width:140px}.conceptHero h1{font-size:54px}}
        @media(max-width:560px){.conceptCopy h1{font-size:42px}.conceptActions{align-items:flex-start;flex-direction:column}.conceptVisual{min-height:360px;aspect-ratio:1}.heroMicroscope{object-position:50% 42%}.visualWords{left:7%;font-size:8px;letter-spacing:2px}.visualSignature{width:48%}.conceptDivider i{display:none}}
      `}</style>
    </main>
  );
}
