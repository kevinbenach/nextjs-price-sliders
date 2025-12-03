'use client';

import { useState } from 'react';
import { Range, RangeValues } from '@/components/Range';
import styles from './client-wrapper.module.css';

type Props = {
  values: number[];
};

export default function ClientWrapper({ values }: Props) {
  const [selectedRange, setSelectedRange] = useState<RangeValues>({
    min: values[0],
    max: values[values.length - 1],
  });

  return (
    <div className={styles.wrapper}>
      <Range
        mode="fixed"
        values={values}
        onChange={setSelectedRange}
      />

      <div className={styles.selectedValues}>
        <p className={styles.label}>Selected Range:</p>
        <p className={styles.values}>
          <span className={styles.value}>{selectedRange.min.toFixed(2)}€</span>
          <span className={styles.separator}>-</span>
          <span className={styles.value}>{selectedRange.max.toFixed(2)}€</span>
        </p>
      </div>
    </div>
  );
}