import { Suspense } from 'react';
import { Range } from '@/components/Range';
import { RangeSkeleton } from '@/components/RangeSkeleton';
import { Navigation } from '@/components/Navigation';
import styles from './page.module.css';

async function fetchRangeData() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8080');

  const res = await fetch(`${baseUrl}/api/range`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch range data: ${res.statusText}`);
  }

  return res.json();
}

async function RangeContainer() {
  const data = await fetchRangeData();

  return (
    <div className={styles.rangeContainer}>
      <Range mode="normal" min={data.min} max={data.max} />
    </div>
  );
}

export default function Exercise1Page() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Navigation currentPage="exercise1" />

        <header className={styles.header}>
          <h1 className={styles.title}>Exercise 1: Normal Range</h1>
          <p className={styles.description}>
            Drag the handles or click the labels to set values
          </p>
        </header>

        <Suspense
          fallback={
            <div className={styles.rangeContainer}>
              <RangeSkeleton />
            </div>
          }
        >
          <RangeContainer />
        </Suspense>
      </div>
    </main>
  );
}