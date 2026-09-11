import Link from "next/link";
import Brand from "@/components/Brand";

const focusAreas = [
  ["01", "Complex Root Canal Treatment", "Diagnosis and conservative management of difficult canal anatomy."],
  ["02", "Retreatment", "Evidence-based management of persistent endodontic disease."],
  ["03", "Separated Instruments", "Microscope-assisted assessment, bypass and retrieval strategies."],
  ["04", "Calcified Canals", "Guided access, magnification and safe negotiation of challenging canals."],
  ["05", "Irrigation & Disinfection", "Modern protocols focused on biofilm reduction and tissue dissolution."],
  ["06", "Obturation", "Three-dimensional sealing with contemporary materials and techniques."],
];

const cases = [
  { slug: "separated-file-mesial-root", title: "Separated file in mesial root", tag: "Instrument Retrieval", status: "Case Study" },
  { slug: "molar-nonsurgical-retreatment", title: "Molar nonsurgical retreatment", tag: "Retreatment", status: "Case Study" },
  { slug: "calcified-anterior-canal", title: "Calcified anterior canal", tag: "Calcification", status: "Case Study" },
];

const articles = [
  ["CLINICAL NOTE", "How large should we prepare the apical third?"],
  ["TECHNIQUE", "Micro vs macro glide path: practical differences"],
  ["EVIDENCE", "Modern NiTi shaping: what actually matters clinically?"],
];

export default function Home() {
  return (
    <main>
      <header className="header"><div className="shell nav"><Brand/><nav className="navlinks"><Link href="/cases">Cases</Link><Link href="/lectures">Lectures</Link><Link href="/research">Research</Link><Link href="/pricing">Membership</Link></nav><Link href="/account" className="navcta">My account</Link></div></header>

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

      <section className="band"><div className="shell bandInner"><span>DIAGNOSIS</span><i></i><span>ACCESS</span><i></i><span>GLIDE PATH</span><i></i><span>SHAPING</span><i></i><span>DISINFECTION</span><i></i><span>OBTURATION</span></div></section>

      <section id="education" className="section shell"><div className="sectionIntro"><div><p className="eyebrow">CLINICAL FOCUS</p><h2>Endodontics, organized around real clinical decisions.</h2></div><p>From access to obturation, each topic is built around the steps that change treatment quality in daily practice.</p></div><div className="focusGrid">{focusAreas.map(([n,t,d]) => <article key={n} className="focusCard"><span>{n}</span><h3>{t}</h3><p>{d}</p><Link href="/research">Explore topic ↗</Link></article>)}</div></section>

      <section id="cases" className="dark"><div className="shell section"><div className="sectionIntro"><div><p className="eyebrow">CLINICAL CASE LIBRARY</p><h2>Real cases. Clear reasoning.</h2></div><p>Cases include diagnosis, treatment sequence, technical notes and outcome, with clinical imaging added through the admin workflow.</p></div><div className="caseGrid">{cases.map((c, i) => <article className="caseCard" key={c.title}><div className="caseVisual"><span>{String(i+1).padStart(2,"0")}</span><div className="xrayTooth"><b></b><b></b><b></b></div></div><div className="caseMeta"><span>{c.status}</span><span>{c.tag}</span></div><h3>{c.title}</h3><Link href={`/cases/${c.slug}`}>Open case →</Link></article>)}</div><div className="sectionAction"><Link href="/cases" className="btn secondary">View all clinical cases</Link></div></div></section>

      <section id="research" className="section shell"><div className="sectionIntro"><div><p className="eyebrow">RESEARCH & NOTES</p><h2>Evidence translated into clinical practice.</h2></div><p>Concise summaries and practical notes connecting current literature with chairside endodontics.</p></div><div className="articles">{articles.map(([tag,title],i)=><article key={title}><span>{tag}</span><h3>{title}</h3><div className="articleFoot"><b>0{i+1}</b><Link href="/research">Read note ↗</Link></div></article>)}</div></section>

      <section id="about" className="about"><div className="shell aboutGrid"><div><p className="eyebrow">ABOUT</p><h2>Dr. Muthanna<br/>Majid Shayal</h2></div><div className="aboutText"><p className="big">Dentist and clinical researcher focused on Endodontics, microscope-assisted treatment and digital dentistry.</p><p>This independent platform is designed to document clinical cases, organize practical endodontic knowledge and create a growing educational resource for dentists.</p><div className="chips"><span>Endodontics</span><span>Clinical Research</span><span>Digital Dentistry</span><span>Microscopy</span></div></div></div></section>

      <section id="contact" className="contact shell"><img className="signatureMark" src="/signature-logo.webp" alt="Muthanna Majid" /><p className="eyebrow">COLLABORATION · EDUCATION · CASE DISCUSSION</p><h2>Build better endodontics.</h2><p>For lectures, professional collaboration, clinical education and research.</p><Link href="/pricing" className="btn primary">Join the platform</Link></section>
      <footer><div className="shell footerInner"><Brand compact/><span>Dr. Muthanna Majid Shayal · Maysan, Iraq</span><span>© 2026</span></div></footer>
    </main>
  );
}
