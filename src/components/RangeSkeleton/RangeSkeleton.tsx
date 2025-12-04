import styles from './RangeSkeleton.module.css';

interface RangeSkeletonProps {
  /** Show available values section (for exercise2) */
  showValues?: boolean;
}

export function RangeSkeleton({ showValues = false }: RangeSkeletonProps) {
  return (
    <div className={styles.wrapper}>
      {showValues && (
        <div className={styles.valuesInfo}>
          <div className={styles.infoLabelSkeleton} />
          <div className={styles.valuesDisplaySkeleton} />
        </div>
      )}

      <div className={styles.rangeContainer}>
        <div className={styles.labelWrapper}>
          <div className={styles.labelSkeleton} />
        </div>

        <div className={styles.track}>
          <div className={styles.trackActive} />
          <div className={styles.handle} style={{ left: '0%' }} />
          <div className={styles.handle} style={{ left: '100%' }} />
        </div>

        <div className={styles.labelWrapper}>
          <div className={styles.labelSkeleton} />
        </div>
      </div>
    </div>
  );
}
