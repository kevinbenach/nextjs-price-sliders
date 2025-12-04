'use client';

import { usePathname } from 'next/navigation';
import { ErrorDisplay } from '@/components/ErrorDisplay';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();

  const currentPage = pathname.includes('exercise1')
    ? 'exercise1'
    : pathname.includes('exercise2')
    ? 'exercise2'
    : 'exercise1';

  const message = pathname.includes('exercise1')
    ? 'Failed to load the range data. Please try again.'
    : pathname.includes('exercise2')
    ? 'Failed to load the fixed range data. Please try again.'
    : 'Failed to load the data. Please try again.';

  return (
    <ErrorDisplay
      error={error}
      reset={reset}
      currentPage={currentPage}
      message={message}
    />
  );
}
