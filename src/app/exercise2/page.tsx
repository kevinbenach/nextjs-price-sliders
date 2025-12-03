import { Suspense } from 'react';
import { RangeWrapper } from '@/components/RangeWrapper';
import { RangeSkeleton } from '@/components/RangeSkeleton';
import { Navigation } from '@/components/Navigation';
import styles from './page.module.css';

async function getFixedRangeData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:8080';

  const res = await fetch(`${baseUrl}/api/fixed-range`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch fixed range data: ${res.statusText}`);
  }

  return res.json();
}

async function RangeContainer() {
  const data = await getFixedRangeData();

  return (
    <div className={styles.rangeContainer}>
      <div className={styles.valuesInfo}>
        <p className={styles.infoLabel}>Available values:</p>
        <p className={styles.valuesDisplay}>
          {data.rangeValues.map((val: number, idx: number) => (
            <span key={idx}>
              {val.toFixed(2)}€{idx < data.rangeValues.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      </div>
      <RangeWrapper mode="fixed" values={data.rangeValues} />
    </div>
  );
}

export default function Exercise2Page() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Navigation currentPage="exercise2" />

        <header className={styles.header}>
          <h1 className={styles.title}>Exercise 2: Fixed Values Range</h1>
          <p className={styles.description}>
            Drag the handles to select from predefined price points
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