import Link from "next/link";
import Brand from "@/components/Brand";

export default function SiteHeader(){
  return (
    <header className="header">
      <div className="shell nav">
        <Brand/>
        <nav className="navlinks" aria-label="Main navigation">
          <Link href="/cases">Cases</Link>
          <Link href="/lectures">Lectures</Link>
          <Link href="/books">Books</Link>
          <Link href="/research">Research</Link>
        </nav>
        <div className="navActions">
          <Link href="/pricing" className="subscribeLink">Subscribe</Link>
          <Link href="/member/login" className="navcta">Login</Link>
        </div>
      </div>
    </header>
  );
}
