'use client';

import { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import styles from './error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Exercise 2 error:', error);
  }, [error]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Navigation currentPage="exercise2" />

        <div className={styles.errorContent}>
          <h1 className={styles.title}>Something went wrong!</h1>
          <p className={styles.message}>
            Failed to load the fixed range data. Please try again.
          </p>
          <p className={styles.errorDetails}>{error.message}</p>
          <button onClick={reset} className={styles.button}>
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
