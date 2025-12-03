'use client';

import { ErrorDisplay } from '@/components/ErrorDisplay';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      error={error}
      reset={reset}
      currentPage="exercise1"
      message="Failed to load the range data. Please try again."
    />
  );
}
