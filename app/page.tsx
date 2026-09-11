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

const benefits = [
  ["Clinical Cases", "Step-by-step documentation of complex endodontic treatment and retreatment."],
  ["Private Lectures", "Subscriber-only video lectures embedded inside the platform."],
  ["Research Notes", "Evidence translated into practical clinical decisions."],
];

export default function Home() {
  return <main>
    <header className="header"><div className="shell nav"><Brand/><nav className="navlinks"><Link href="/cases">Cases</Link><Link href="/lectures">Lectures</Link><Link href="/research">Research</Link><Link href="/pricing">Membership</Link></nav><Link href="/member/login" className="navcta">Member sign in</Link></div></header>

    <section className="hero shell">
      <div className="heroCopy">
        <div className="kicker">DR. MUTHANNA MAJID · ENDODONTICS</div>
        <h1>Clinical endodontics.<br/><em>Built for dentists.</em></h1>
        <p className="lead">A premium educational platform for real cases, private lectures, clinical protocols and evidence-based decision making.</p>
        <div className="heroActions"><Link href="/pricing" className="btn primary">Join the membership</Link><Link href="/cases" className="btn secondary">Explore clinical cases</Link></div>
        <div className="metrics"><div><strong>Cases</strong><span>REAL CLINICAL WORK</span></div><div><strong>Lectures</strong><span>PRIVATE VIDEO LIBRARY</span></div><div><strong>Research</strong><span>EVIDENCE TO PRACTICE</span></div></div>
      </div>
      <div className="heroArt" aria-label="Root canal visual"><div className="gridlines"></div><div className="toothCard"><div className="toothCrown"></div><div className="root root1"><i></i></div><div className="root root2"><i></i></div><div className="root root3"><i></i></div></div><div className="microLabel"><b>M</b><span>PRECISION<br/>MICROSCOPY<br/>ENDODONTICS</span></div></div>
    </section>

    <section className="band"><div className="shell bandInner"><span>DIAGNOSIS</span><i></i><span>ACCESS</span><i></i><span>GLIDE PATH</span><i></i><span>SHAPING</span><i></i><span>DISINFECTION</span><i></i><span>OBTURATION</span></div></section>

    <section className="section shell"><div className="sectionIntro"><div><p className="eyebrow">MEMBERSHIP CONTENT</p><h2>Everything in one focused Endodontics platform.</h2></div><p>New premium material can be released continuously while your membership stays active.</p></div><div className="focusGrid">{benefits.map(([title,desc],i)=><article className="focusCard" key={title}><span>0{i+1}</span><h3>{title}</h3><p>{desc}</p><Link href={i===0?"/cases":i===1?"/lectures":"/research"}>Explore →</Link></article>)}</div></section>

    <section className="dark"><div className="shell section"><div className="sectionIntro"><div><p className="eyebrow gold">CLINICAL FOCUS</p><h2>Structured around the decisions that matter.</h2></div><p>From difficult anatomy to separated instruments, content is organized for daily chairside relevance.</p></div><div className="focusGrid">{focusAreas.map(([n,t,d])=><article className="focusCard" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><Link href="/pricing">Unlock full access →</Link></article>)}</div></div></section>

    <section className="about"><div className="shell aboutGrid"><div><p className="eyebrow gold">ABOUT THE PLATFORM</p><h2>Dr. Muthanna<br/>Majid Shayal</h2></div><div className="aboutText"><p className="big">Dentist and clinical researcher focused on Endodontics, microscope-assisted treatment and digital dentistry.</p><p>The platform combines real clinical documentation with structured education for dentists who want practical, modern Endodontics.</p><div className="chips"><span>Endodontics</span><span>Microscopy</span><span>Clinical Research</span><span>Digital Dentistry</span></div><div className="heroActions"><Link href="/pricing" className="btn primary">View membership plans</Link><Link href="/register" className="btn secondary">Create account</Link></div></div></div></section>

    <section className="contact shell"><p className="eyebrow">MONTHLY · ANNUAL · QI CARD</p><h2>Learn. Review. Apply.</h2><p>Join once and access subscriber clinical cases, lectures and future premium releases from your account.</p><Link href="/pricing" className="btn primary">Start membership</Link></section>
    <footer><div className="shell footerInner"><div>DR. MUTHANNA MAJID · ENDODONTICS</div><span>Clinical education platform · Iraq</span><span>© 2026</span></div></footer>
  </main>;
}
