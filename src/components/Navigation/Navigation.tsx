import Link from 'next/link';
import styles from './Navigation.module.css';

interface NavigationProps {
  currentPage?: 'home' | 'exercise1' | 'exercise2';
}

export function Navigation({ currentPage }: NavigationProps) {
  return (
    <nav className={styles.nav}>
      {currentPage !== 'home' && (
        <Link href="/" className={styles.link}>
          ← Home
        </Link>
      )}
      {currentPage !== 'exercise1' && (
        <Link href="/exercise1" className={styles.link}>
          Exercise 1
        </Link>
      )}
      {currentPage !== 'exercise2' && (
        <Link href="/exercise2" className={styles.link}>
          Exercise 2
        </Link>
      )}
    </nav>
  );
}
