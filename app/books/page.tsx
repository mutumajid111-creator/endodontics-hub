import SiteHeader from "@/components/SiteHeader";

export const metadata={title:"Books | Dr. Muthanna Majid"};

export default function BooksPage(){
  return <main>
    <SiteHeader/>
    <section className="pageHero shell">
      <p className="eyebrow">BOOK LIBRARY</p>
      <h1>Endodontic books and practical references.</h1>
      <p>Curated books, practical manuals and future original publications for Endodontics education.</p>
    </section>
    <section className="shell section"><div className="emptyPremium"><h2>Books coming soon.</h2><p>This section is ready and will be populated from the admin area next.</p></div></section>
  </main>;
}
