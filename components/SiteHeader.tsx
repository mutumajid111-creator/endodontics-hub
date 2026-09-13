import Link from "@/components/ExperienceLink";
import Brand from "@/components/Brand";
import styles from "./SiteHeader.module.css";

export default function SiteHeader(){
  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <Brand/>
        <nav className={styles.links} aria-label="Main navigation">
          <Link href="/cases" navItem>Cases</Link>
          <Link href="/lectures" navItem>Lectures</Link>
          <Link href="/books" navItem>Books</Link>
          <Link href="/research" navItem>Research</Link>
        </nav>
        <div className={styles.actions}>
          <Link href="/pricing" className={styles.subscribe}>Subscribe <span aria-hidden="true">↗</span></Link>
          <Link href="/member/login" className={styles.login}>Login</Link>
        </div>
      </div>
    </header>
  );
}
