'use client';

import { Navigation } from '@/components/Navigation';
import styles from './ErrorDisplay.module.css';

interface ErrorDisplayProps {
  error: Error & { digest?: string };
  reset: () => void;
  currentPage: 'exercise1' | 'exercise2';
  title?: string;
  message?: string;
}

export function ErrorDisplay({
  error,
  reset,
  currentPage,
  title = 'Something went wrong!',
  message = 'Failed to load the data. Please try again.'
}: ErrorDisplayProps) {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Navigation currentPage={currentPage} />

        <div className={styles.errorContent}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.message}>{message}</p>
          <p className={styles.errorDetails}>{error.message}</p>
          <button onClick={reset} className={styles.button}>
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
