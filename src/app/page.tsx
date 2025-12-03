import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>MANGO Range Component</h1>

        <p className={styles.description}>
          Custom Range component with two usage modes
        </p>

        <nav className={styles.nav}>
          <Link href="/exercise1" className={styles.link}>
            Exercise 1: Normal Range
          </Link>

          <Link href="/exercise2" className={styles.link}>
            Exercise 2: Fixed Range
          </Link>
        </nav>
      </div>
    </main>
  );
}

