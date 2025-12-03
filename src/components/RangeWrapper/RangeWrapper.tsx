'use client';

import { useState } from 'react';
import { Range } from '@/components/Range';
import type { RangeProps, RangeValues } from '@/components/Range/Range.types';
import styles from './RangeWrapper.module.css';

type RangeWrapperProps = RangeProps;

export function RangeWrapper(props: RangeWrapperProps) {
  const initialValues: RangeValues =
    props.mode === 'normal'
      ? { min: props.min, max: props.max }
      : { min: props.values[0], max: props.values[props.values.length - 1] };

  const [selectedRange, setSelectedRange] = useState<RangeValues>(initialValues);

  return (
    <div className={styles.wrapper}>
      <Range {...props} onChange={setSelectedRange} />

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
