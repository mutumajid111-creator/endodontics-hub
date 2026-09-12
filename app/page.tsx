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

  const latestLecture = lectureRows?.[0];
  const latestCase = caseRows?.[0];
  const latestBook = bookRows?.[0];

  return (
    <main className="hubHome">
      <SiteHeader/>

      <section className="hubHero">
        <div className="shell hubHeroGrid">
          <div className="hubHeroCopy">
            <p className="hubKicker">MODERN ENDODONTICS</p>
            <h1>Preserve the tooth.<br/><em>Advance with evidence.</em></h1>
            <p className="hubLead">A focused platform for endodontic education, real clinical cases, scientific knowledge and practical insights designed for dentists who want to go further.</p>
            <div className="hubHeroActions">
              <Link href="/lectures" className="hubPrimary">Start Learning <span>→</span></Link>
              <Link href="/cases" className="hubSecondary">Explore Cases</Link>
            </div>
            <div className="hubStats">
              <div><span className="hubStatIcon">▰</span><strong>{lectureCount ?? 0}</strong><small>Lectures</small></div>
              <div><span className="hubStatIcon">◉</span><strong>{caseCount ?? 0}</strong><small>Clinical Cases</small></div>
              <div><span className="hubStatIcon">▤</span><strong>{bookCount ?? 0}</strong><small>Books</small></div>
            </div>
          </div>

          <div className="hubVisual" aria-label="Modern endodontic learning visual">
            <div className="hubVisualGlow"></div>
            <div className="hubVisualGrid"></div>
            <svg className="hubTooth" viewBox="0 0 420 500" role="img" aria-label="Stylized tooth with root canal instrument">
              <defs>
                <linearGradient id="enamel" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#fffef9"/><stop offset="1" stopColor="#c7d3e7"/></linearGradient>
                <linearGradient id="dentin" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f3d4a7"/><stop offset="1" stopColor="#bc7d4d"/></linearGradient>
                <linearGradient id="pulp" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8f2f2f"/><stop offset="1" stopColor="#451414"/></linearGradient>
              </defs>
              <path d="M87 126C91 55 156 36 211 62c43-27 113-6 123 63 8 55-26 91-45 130-16 32-18 76-26 130-7 47-27 83-47 83-18 0-20-39-24-87-3-42-8-85-21-85-13 0-20 43-24 85-5 48-9 87-26 87-20 0-38-36-45-83-8-54-12-99-29-132-20-39-38-74-30-127Z" fill="url(#enamel)" stroke="#ffffff" strokeWidth="5"/>
              <path d="M118 142c5-43 43-61 86-40 36-20 82-2 87 42 4 33-19 62-33 92-14 29-19 65-25 112-4 31-12 56-21 56-8 0-10-34-13-72-4-55-12-92-29-92-17 0-27 39-32 92-4 38-7 72-16 72-10 0-18-26-22-57-6-47-10-81-24-110-14-31-19-62-14-95Z" fill="url(#dentin)" opacity=".94"/>
              <path d="M158 160c20-17 49-14 62 5 12 17 9 40-5 60-11 15-17 35-20 63-3 27-5 67-10 95-2 12-8 22-13 22-7 0-8-13-9-28-2-39 2-83-4-113-4-22-10-34-21-50-13-19-10-39 20-54Z" fill="url(#pulp)" opacity=".9"/>
              <g transform="rotate(11 210 242)">
                <rect x="201" y="20" width="18" height="130" rx="7" fill="#b88b34"/>
                <rect x="194" y="57" width="32" height="37" rx="8" fill="#1f64a7"/>
                <rect x="204" y="91" width="12" height="285" rx="6" fill="#c9d2dc"/>
                {Array.from({length:19}).map((_,i)=><line key={i} x1="202" y1={112+i*13} x2="218" y2={121+i*13} stroke="#667586" strokeWidth="2"/>)}
              </g>
            </svg>
            <div className="hubVisualWords"><span>SCIENCE</span><span>SKILL</span><span>BETTER OUTCOMES</span></div>
            <img className="hubVisualSignature" src="/signature-logo.webp" alt="Muthanna Majid" />
          </div>
        </div>
      </section>

      <section className="hubLibrary shell">
        <div className="hubCards">
          <article className="hubCard">
            <div className="hubCardVisual lectureVisual">
              <span className="hubRoundIcon">▶</span>
              <div className="miniLectureRows"><i></i><i></i><i></i><i></i></div>
            </div>
            <div className="hubCardBody">
              <h2>Lectures</h2>
              <p>Focused, high-quality teaching covering the practical spectrum of modern endodontics.</p>
              <div className="hubThumbStrip lectureStrip"><i></i><i></i><i></i><i></i></div>
              <div className="hubCardFoot"><Link href="/lectures">Explore Lectures →</Link><span>{latestLecture?.title || "Video learning library"}</span></div>
            </div>
          </article>

          <article className="hubCard">
            <div className="hubCardVisual caseVisualNew">
              <span className="hubRoundIcon">◉</span>
              <div className="xraySet"><b></b><b></b><b></b></div>
            </div>
            <div className="hubCardBody">
              <h2>Clinical Cases</h2>
              <p>Step-by-step real cases with diagnosis, treatment planning, technical notes and outcomes.</p>
              <div className="hubThumbStrip caseStrip"><i></i><i></i><i></i><i></i></div>
              <div className="hubCardFoot"><Link href="/cases">Explore Cases →</Link><span>{latestCase?.title || "Clinical case library"}</span></div>
            </div>
          </article>

          <article className="hubCard">
            <div className="hubCardVisual bookVisual">
              <span className="hubRoundIcon">▤</span>
              <div className="bookStack"><i></i><i></i><i></i></div>
            </div>
            <div className="hubCardBody">
              <h2>Books</h2>
              <p>Essential books and clinical references for evidence-based endodontic practice.</p>
              <div className="hubThumbStrip bookStrip"><i></i><i></i><i></i><i></i></div>
              <div className="hubCardFoot"><Link href="/books">Explore Books →</Link><span>{latestBook?.title || "Reference library"}</span></div>
            </div>
          </article>
        </div>
        <div className="hubDivider"><span>EDUCATION</span><i></i><span>EVIDENCE</span><i></i><span>CLINICAL EXCELLENCE</span></div>
      </section>

      <footer className="hubFooter"><div className="shell footerInner"><Brand compact/><span>Dr. Muthanna Majid Shayal · Maysan, Iraq</span><span>© 2026</span></div></footer>

      <style>{`
        .hubHome{background:#fbfaf7;min-height:100vh;color:#12224f}
        .hubHero{background:linear-gradient(90deg,#fbfaf7 0%,#fbfaf7 46%,#edf1f6 60%,#07182d 100%);border-bottom:1px solid #e3ddd0}
        .hubHeroGrid{display:grid;grid-template-columns:1.02fr .98fr;min-height:600px;align-items:stretch}
        .hubHeroCopy{padding:70px 56px 52px 0;display:flex;flex-direction:column;justify-content:center}
        .hubKicker{font:700 11px 'Manrope',sans-serif;letter-spacing:4px;color:#b78216;margin:0 0 16px}
        .hubHero h1{font:600 clamp(54px,5.6vw,86px)/.98 'Playfair Display',serif;letter-spacing:-2.7px;margin:0;color:#12224f}
        .hubHero h1 em{display:inline-block;color:#bd8615;font-weight:600;margin-top:6px}
        .hubLead{font-size:15px;line-height:1.9;color:#66728b;max-width:650px;margin:26px 0 0}
        .hubHeroActions{display:flex;gap:18px;align-items:center;margin-top:30px}
        .hubPrimary,.hubSecondary{display:inline-flex;align-items:center;gap:18px;text-decoration:none;border-radius:999px;padding:14px 24px;font:700 11px 'Manrope',sans-serif}
        .hubPrimary{background:#12245b;color:white;box-shadow:0 15px 36px #12245b24}.hubPrimary span{font-size:16px}
        .hubSecondary{border:1px solid #cbbf9f;color:#12224f;background:#fffdf9}
        .hubStats{display:flex;gap:0;margin-top:38px;border-top:1px solid #ded7c8;padding-top:24px}
        .hubStats>div{display:grid;grid-template-columns:auto auto;grid-template-rows:auto auto;column-gap:11px;align-items:center;padding-right:34px;margin-right:34px;border-right:1px solid #e1dacd}.hubStats>div:last-child{border-right:0;margin-right:0;padding-right:0}
        .hubStatIcon{grid-row:1/3;color:#c18b19;font-size:21px}.hubStats strong{font:700 17px 'Manrope';color:#12224f}.hubStats small{font-size:10px;color:#768095}
        .hubVisual{position:relative;overflow:hidden;background:radial-gradient(circle at 34% 40%,#31517d 0%,#122b4e 48%,#07182d 78%)}
        .hubVisualGlow{position:absolute;inset:-10% 35% -10% -15%;background:radial-gradient(circle,#f5efe05c,transparent 60%);filter:blur(14px)}
        .hubVisualGrid{position:absolute;inset:0;background-image:linear-gradient(#ffffff0a 1px,transparent 1px),linear-gradient(90deg,#ffffff0a 1px,transparent 1px);background-size:46px 46px}
        .hubTooth{position:absolute;left:3%;bottom:-7%;width:64%;height:auto;filter:drop-shadow(0 30px 40px #0008)}
        .hubVisualWords{position:absolute;right:8%;top:33%;display:flex;flex-direction:column;gap:11px;color:#e5edf7;font:500 11px 'Manrope';letter-spacing:4px}
        .hubVisualWords:after{content:"";width:58px;height:2px;background:#c28b17;margin-top:12px}
        .hubVisualSignature{position:absolute;right:5%;bottom:8%;width:43%;filter:brightness(0) invert(1);opacity:.82}
        .hubLibrary{padding:22px 0 54px}
        .hubCards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:-1px}
        .hubCard{background:white;border:1px solid #e2dbce;border-radius:10px;overflow:hidden;box-shadow:0 16px 45px #1b25430b}
        .hubCardVisual{height:155px;position:relative;overflow:hidden;background:#e9edf4}
        .hubRoundIcon{position:absolute;left:22px;top:20px;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:#c49320;color:#fff;font-weight:800;z-index:4}
        .lectureVisual{background:linear-gradient(90deg,#f8f8f6 0%,#eef1f4 40%,#183360 100%)}
        .miniLectureRows{position:absolute;right:0;top:0;width:62%;height:100%;display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:28px 18px}.miniLectureRows i{background:linear-gradient(180deg,#203b69,#0c1b39);border:1px solid #ffffff1f;border-radius:4px}.miniLectureRows i:nth-child(2){transform:translateY(9px)}.miniLectureRows i:nth-child(3){transform:translateY(-6px)}
        .caseVisualNew{background:linear-gradient(90deg,#f8f8f6 0%,#dfe5ea 38%,#0d2446 100%)}
        .xraySet{position:absolute;right:6%;top:15%;width:56%;height:74%;display:flex;justify-content:center;align-items:center;gap:9px;filter:drop-shadow(0 8px 14px #0005)}.xraySet b{width:34px;height:105px;border-radius:44% 44% 7px 7px;background:linear-gradient(180deg,#f6f8fb,#71819a);opacity:.92;transform:rotate(7deg)}.xraySet b:nth-child(2){height:126px;transform:none}.xraySet b:nth-child(3){transform:rotate(-7deg)}
        .bookVisual{background:linear-gradient(90deg,#f8f8f6 0%,#ece8de 46%,#18284d 100%)}
        .bookStack{position:absolute;right:7%;bottom:18px;width:55%;height:105px}.bookStack i{position:absolute;left:8%;right:2%;height:34px;border-radius:4px;background:#12224f;border-left:5px solid #c49320;box-shadow:0 8px 14px #0003}.bookStack i:nth-child(1){bottom:0;transform:rotate(-2deg)}.bookStack i:nth-child(2){bottom:31px;left:14%;background:#20345e;transform:rotate(2deg)}.bookStack i:nth-child(3){bottom:62px;left:21%;background:#0c1937;transform:rotate(-1deg)}
        .hubCardBody{padding:22px 24px 20px}.hubCardBody h2{font:600 30px 'Playfair Display',serif;margin:0 0 8px;color:#12224f}.hubCardBody p{font-size:12px;line-height:1.65;color:#69748a;min-height:58px;margin:0 0 15px}
        .hubThumbStrip{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;height:50px;margin-bottom:17px}.hubThumbStrip i{border-radius:3px;overflow:hidden;position:relative}
        .lectureStrip i{background:linear-gradient(145deg,#162b55,#2f4f80)}.lectureStrip i:after{content:"";position:absolute;inset:7px;border:1px solid #ffffff50;border-radius:2px}.lectureStrip i:nth-child(3){background:linear-gradient(145deg,#eceae2,#b8c1ca)}
        .caseStrip i{background:radial-gradient(circle at 50% 35%,#eef2f5,#75869d 55%,#1c3355)}.caseStrip i:nth-child(2){background:radial-gradient(circle at 50% 50%,#d2c0a5,#2f6876)}.caseStrip i:nth-child(4){background:radial-gradient(circle at 50% 50%,#b98b76,#294e70)}
        .bookStrip i{background:linear-gradient(145deg,#0f234b,#234a78);border-left:3px solid #c49320}.bookStrip i:nth-child(2){background:linear-gradient(145deg,#182646,#36415e)}.bookStrip i:nth-child(3){background:linear-gradient(145deg,#112c53,#0b182e)}.bookStrip i:nth-child(4){background:linear-gradient(145deg,#e8e1d4,#8ca2b9)}
        .hubCardFoot{display:flex;justify-content:space-between;gap:12px;align-items:center;border-top:1px solid #ece5d9;padding-top:15px}.hubCardFoot a{font:700 10px 'Manrope';color:#b27b0d;text-decoration:none;white-space:nowrap}.hubCardFoot span{font-size:9px;color:#7a8495;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:right;max-width:55%}
        .hubDivider{display:flex;align-items:center;justify-content:center;gap:18px;margin-top:38px;color:#69748b;font:600 8px 'Manrope';letter-spacing:3px}.hubDivider i{width:5px;height:5px;border-radius:50%;background:#c49320}
        .hubFooter{background:#fbfaf7}
        @media(max-width:900px){.hubHero{background:#fbfaf7}.hubHeroGrid{grid-template-columns:1fr}.hubHeroCopy{padding:58px 0 34px}.hubVisual{min-height:430px;border-radius:12px;margin-bottom:24px}.hubCards{grid-template-columns:1fr}.hubStats{flex-wrap:wrap;gap:16px}.hubStats>div{border-right:0;margin-right:0;padding-right:18px}.hubVisualSignature{width:36%}}
        @media(max-width:560px){.hubHero h1{font-size:48px}.hubHeroActions{align-items:stretch;flex-direction:column}.hubPrimary,.hubSecondary{justify-content:center}.hubStats{display:grid;grid-template-columns:repeat(3,1fr)}.hubStats>div{display:flex;flex-direction:column;align-items:flex-start;padding:0}.hubStatIcon{font-size:17px}.hubVisual{min-height:350px}.hubTooth{width:78%;left:-9%}.hubVisualWords{right:4%;font-size:9px;letter-spacing:2px}.hubVisualSignature{right:2%;width:44%}.hubDivider{font-size:7px;gap:10px;letter-spacing:1.5px}}
      `}</style>
    </main>
  );
}
