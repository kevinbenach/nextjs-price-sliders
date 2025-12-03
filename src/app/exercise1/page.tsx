import { Range } from '@/components/Range';
  import ClientWrapper from './client-wrapper';

  async function fetchRangeData() {
    const res = await fetch('http://localhost:8080/api/range', {
      cache: 'no-store' // or use Next.js 15 caching strategies
    });

    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  }

  export default async function Exercise1Page() {
    const data = await fetchRangeData();

    return (
      <main>
        <header>
          <h1>Exercise 1: Normal Range</h1>
          <p>From {data.min} to {data.max}</p>
        </header>

        {/* Wrap client component for onChange handler */}
        <ClientWrapper min={data.min} max={data.max} />
      </main>
    );
  }