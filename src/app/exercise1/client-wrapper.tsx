'use client';

  import { useState } from 'react';
  import { Range, RangeValues } from '@/components/Range';

  type Props = {
    min: number;
    max: number;
  };

  export default function ClientWrapper({ min, max }: Props) {
    const [selectedRange, setSelectedRange] = useState<RangeValues | null>(null);

    return (
      <>
        <Range
          mode="normal"
          min={min}
          max={max}
          onChange={setSelectedRange}
        />

        {selectedRange && (
          <p>Selected: {selectedRange.min}€ - {selectedRange.max}€</p>
        )}
      </>
    );
  }