import { Suspense } from 'react';
import ClientWrapper from './client-wrapper';
import styles from './page.module.css';

async function getFixedRangeData() {
  // In production, use the deployment URL. In dev, construct localhost URL
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
      <ClientWrapper values={data.rangeValues} />
    </div>
  );
}

export default function Exercise2Page() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Exercise 2: Fixed Values Range</h1>
          <p className={styles.description}>
            Drag the handles to select from predefined price points
          </p>
        </header>

        <Suspense fallback={<div className={styles.loading}>Loading range data...</div>}>
          <RangeContainer />
        </Suspense>
      </div>
    </main>
  );
}