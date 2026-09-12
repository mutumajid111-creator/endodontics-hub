import Link from "next/link";
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
            <div className="visualShade"></div>
            <div className="visualGrid"></div>
            <svg className="heroTooth" viewBox="0 0 520 600" aria-hidden="true">
              <defs>
                <linearGradient id="outerTooth" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fffdfa"/>
                  <stop offset=".52" stopColor="#e8dfd2"/>
                  <stop offset="1" stopColor="#9bb0c8"/>
                </linearGradient>
                <linearGradient id="innerDentin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f6d7a4"/>
                  <stop offset="1" stopColor="#c18457"/>
                </linearGradient>
                <linearGradient id="pulpCore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#aa3e35"/>
                  <stop offset="1" stopColor="#5b181d"/>
                </linearGradient>
                <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="24" stdDeviation="18" floodColor="#001022" floodOpacity=".55"/>
                </filter>
              </defs>
              <g filter="url(#softShadow)">
                <path d="M108 142C116 63 180 36 254 73c67-38 147-9 158 69 8 57-28 104-54 153-24 45-26 93-34 158-7 61-28 109-56 109-28 0-31-55-34-114-4-61-13-109-33-109-20 0-30 47-36 109-6 60-12 114-40 114-29 0-48-48-55-109-8-64-13-112-37-158-26-49-34-97-25-153Z" fill="url(#outerTooth)" stroke="#ffffff" strokeWidth="7"/>
                <path d="M144 158c6-48 48-69 100-44 42-24 96-3 102 46 5 37-21 68-39 104-16 33-21 76-28 129-5 36-14 64-25 64-11 0-13-39-16-83-4-63-14-106-34-106-21 0-32 45-37 106-4 44-8 83-19 83-12 0-22-29-27-65-7-53-13-95-29-128-18-37-24-71-18-106Z" fill="url(#innerDentin)" opacity=".94"/>
                <path d="M190 177c26-19 61-14 78 10 15 22 12 50-6 75-15 20-22 44-26 78-4 31-8 76-14 108-3 16-11 29-18 29-8 0-10-17-11-36-3-46 2-96-6-131-6-27-15-42-30-60-17-21-12-48 33-73Z" fill="url(#pulpCore)" opacity=".93"/>
              </g>
              <g transform="rotate(10 282 260)">
                <rect x="274" y="26" width="22" height="125" rx="7" fill="#d5a13b"/>
                <rect x="264" y="66" width="42" height="44" rx="10" fill="#1b67ad"/>
                <rect x="278" y="104" width="14" height="340" rx="7" fill="#d7dde5"/>
                <path d="M278 128L292 138M278 145L292 155M278 162L292 172M278 179L292 189M278 196L292 206M278 213L292 223M278 230L292 240M278 247L292 257M278 264L292 274M278 281L292 291M278 298L292 308M278 315L292 325M278 332L292 342M278 349L292 359M278 366L292 376M278 383L292 393M278 400L292 410" stroke="#6b7785" strokeWidth="2.6"/>
              </g>
            </svg>
            <div className="visualWords"><span>SCIENCE</span><span>SKILL</span><span>BETTER OUTCOMES</span><i></i></div>
            <div className="visualSignature"><img src="/signature-logo.webp" alt="Muthanna Majid signature"/></div>
          </div>
        </div>
      </section>

      <section className="resourceSection shell">
        <div className="resourceGrid">
          <article className="resourceCard">
            <div className="resourceMedia lectureMedia">
              <span className="resourceIcon">▶</span>
              <div className="screen"><b>Knowledge<br/>to Practice</b></div>
            </div>
            <div className="resourceBody">
              <h2>Lectures</h2>
              <p>High-quality lectures covering the full spectrum of modern endodontics.</p>
              <div className="miniThumbRow lectureThumbs"><i></i><i></i><i></i><i></i></div>
              <div className="resourceFoot"><Link href="/lectures">Explore Lectures →</Link><span>{latestLecture}</span></div>
            </div>
          </article>

          <article className="resourceCard">
            <div className="resourceMedia caseMedia">
              <span className="resourceIcon">●</span>
              <div className="miniXrays"><i></i><i></i><i></i></div>
            </div>
            <div className="resourceBody">
              <h2>Clinical Cases</h2>
              <p>Step-by-step real cases with clear diagnosis, treatment planning and outcomes.</p>
              <div className="miniThumbRow caseThumbs"><i></i><i></i><i></i><i></i></div>
              <div className="resourceFoot"><Link href="/cases">Explore Cases →</Link><span>{latestCase}</span></div>
            </div>
          </article>

          <article className="resourceCard">
            <div className="resourceMedia bookMedia">
              <span className="resourceIcon">▤</span>
              <div className="booksPile"><i></i><i></i><i></i></div>
            </div>
            <div className="resourceBody">
              <h2>Books</h2>
              <p>Essential books and references for evidence-based endodontic practice.</p>
              <div className="miniThumbRow bookThumbs"><i></i><i></i><i></i><i></i></div>
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
        .conceptCopy{padding:58px 54px 34px 0;display:flex;flex-direction:column;justify-content:center}
        .conceptKicker{margin:0 0 16px;color:#b98314;font:700 10px 'Manrope',sans-serif;letter-spacing:4px}
        .conceptCopy h1{margin:0;color:#10234f;font:600 clamp(46px,4.8vw,72px)/.98 'Playfair Display',serif;letter-spacing:-2px}
        .conceptCopy h1 em{display:inline-block;color:#c08b19;font-weight:600;margin-top:6px}
        .conceptLead{max-width:610px;margin:23px 0 0;color:#66728a;font-size:14px;line-height:1.85}
        .conceptActions{display:flex;align-items:center;gap:28px;margin-top:27px}
        .conceptPrimary{display:inline-flex;align-items:center;gap:34px;background:#11275d;color:white;padding:14px 26px;border-radius:999px;text-decoration:none;font:700 11px 'Manrope';box-shadow:0 12px 30px #11275d1f}.conceptPrimary span{font-size:17px}
        .conceptIntro{display:flex;align-items:center;gap:11px;text-decoration:none;color:#142653}.conceptIntro>b{width:39px;height:39px;border:1px solid #142653;border-radius:50%;display:grid;place-items:center;font-size:11px}.conceptIntro>span{display:flex;flex-direction:column;font:700 10px 'Manrope'}.conceptIntro small{margin-top:3px;color:#8c94a4;font-weight:500}
        .conceptStats{display:flex;margin-top:31px;padding-top:21px;border-top:1px solid #e3dccf}.conceptStats>div{min-width:142px;padding-right:24px;margin-right:24px;border-right:1px solid #e4ddd1;display:grid;grid-template-columns:27px auto;grid-template-rows:auto auto;align-items:center}.conceptStats>div:last-child{border-right:0}.conceptStats>div>span{grid-row:1/3;color:#c08b19;font-size:21px}.conceptStats strong{font:700 16px 'Manrope';color:#142653}.conceptStats small{font-size:9px;color:#798398}
        .conceptVisual{position:relative;overflow:hidden;background:radial-gradient(circle at 28% 46%,#45658b 0%,#1c3b5c 35%,#0b1f38 72%,#061529 100%)}
        .visualShade{position:absolute;left:-15%;top:-20%;width:60%;height:140%;background:radial-gradient(circle,#fff8e46b 0%,#fff2d31a 45%,transparent 72%);filter:blur(10px)}
        .visualGrid{position:absolute;inset:0;background-image:linear-gradient(#ffffff09 1px,transparent 1px),linear-gradient(90deg,#ffffff09 1px,transparent 1px);background-size:48px 48px}
        .heroTooth{position:absolute;left:-1%;bottom:-10%;width:68%;height:auto}
        .visualWords{position:absolute;right:8%;top:31%;display:flex;flex-direction:column;gap:9px;color:#e8edf5;font:500 10px 'Manrope';letter-spacing:4px}.visualWords i{width:54px;height:2px;background:#c79524;margin-top:10px}
        .visualSignature{position:absolute;right:4%;bottom:8%;width:42%;opacity:.88}.visualSignature img{width:100%;display:block;filter:brightness(0) invert(1)}
        .resourceSection{padding:18px 0 50px}
        .resourceGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .resourceCard{overflow:hidden;border:1px solid #e4ded2;border-radius:9px;background:#fff;box-shadow:0 16px 40px #17244b0a}
        .resourceMedia{height:145px;position:relative;overflow:hidden}.resourceIcon{position:absolute;z-index:4;left:18px;top:18px;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#c08b19;color:white;font-weight:800}
        .lectureMedia{background:linear-gradient(90deg,#f7f7f4 0%,#e8edf3 48%,#1c385f 100%)}.screen{position:absolute;right:9%;top:24px;width:48%;height:92px;border:5px solid #2b3547;background:linear-gradient(180deg,#265083,#17345d);display:grid;place-items:center;color:white;text-align:center;font:600 16px/1.15 'Playfair Display';box-shadow:0 12px 22px #0003}
        .caseMedia{background:linear-gradient(90deg,#faf9f6 0%,#e4e8ec 42%,#172c4b 100%)}.miniXrays{position:absolute;right:8%;top:18px;width:52%;height:106px;display:flex;gap:8px;align-items:center;justify-content:center}.miniXrays i{display:block;width:34px;height:90px;background:linear-gradient(180deg,#f4f7fb,#8595aa);border-radius:50% 50% 8px 8px;opacity:.9;transform:rotate(7deg)}.miniXrays i:nth-child(2){height:108px;transform:none}.miniXrays i:nth-child(3){transform:rotate(-7deg)}
        .bookMedia{background:linear-gradient(90deg,#faf9f6 0%,#ece8df 46%,#263b60 100%)}.booksPile{position:absolute;right:7%;bottom:16px;width:55%;height:103px}.booksPile i{position:absolute;right:0;width:86%;height:30px;border-radius:4px;background:#14284e;box-shadow:0 7px 13px #0003}.booksPile i:nth-child(1){bottom:0;transform:rotate(1deg)}.booksPile i:nth-child(2){bottom:30px;right:8%;background:#21365e;transform:rotate(-4deg)}.booksPile i:nth-child(3){bottom:61px;right:2%;background:#0e2245;transform:rotate(5deg)}
        .resourceBody{padding:18px 20px 20px}.resourceBody h2{margin:0;color:#142653;font:600 28px 'Playfair Display'}.resourceBody p{min-height:44px;margin:8px 0 13px;color:#68738a;font-size:12px;line-height:1.55}
        .miniThumbRow{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:5px 0 16px}.miniThumbRow i{display:block;height:42px;border-radius:3px;border:1px solid #dfe2e8}.lectureThumbs i{background:linear-gradient(145deg,#0f2449,#294e79)}.lectureThumbs i:nth-child(3){background:linear-gradient(145deg,#f4f4ef,#b9c7d4)}.caseThumbs i{background:linear-gradient(145deg,#d8dde2,#71839d)}.caseThumbs i:nth-child(2){background:radial-gradient(circle,#d8c5a4,#4e7892)}.bookThumbs i{background:linear-gradient(145deg,#112852,#24446d)}.bookThumbs i:nth-child(4){background:linear-gradient(145deg,#e8e5dc,#99aabb)}
        .resourceFoot{display:flex;align-items:center;justify-content:space-between;gap:14px}.resourceFoot a{color:#b77f0d;text-decoration:none;font:700 10px 'Manrope'}.resourceFoot span{max-width:48%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#8a92a3;font-size:9px}
        .conceptDivider{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:28px;color:#7b8599;font:600 8px 'Manrope';letter-spacing:2.5px}.conceptDivider i{width:80px;height:1px;background:#d8cda9}.conceptDivider b{color:#b88b23}
        .homeFooter{background:#fbfaf7}
        @media(max-width:900px){.conceptHero{background:#fbfaf7}.conceptGrid{grid-template-columns:1fr}.conceptCopy{padding:50px 0 38px}.conceptVisual{min-height:430px}.resourceGrid{grid-template-columns:1fr}.conceptStats{overflow:auto}.conceptStats>div{min-width:140px}.conceptHero h1{font-size:54px}}
        @media(max-width:560px){.conceptCopy h1{font-size:42px}.conceptActions{align-items:flex-start;flex-direction:column}.conceptVisual{min-height:360px}.heroTooth{width:80%;left:-6%}.visualWords{right:4%;font-size:8px}.visualSignature{width:48%}.conceptDivider i{display:none}}
      `}</style>
    </main>
  );
}
