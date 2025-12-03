import styles from './RangeSkeleton.module.css';

interface RangeSkeletonProps {
  /** Show available values section (for exercise2) */
  showValues?: boolean;
}

export function RangeSkeleton({ showValues = false }: RangeSkeletonProps) {
  return (
    <div className={styles.wrapper}>
      {/* Available values section (exercise2 only) */}
      {showValues && (
        <div className={styles.valuesInfo}>
          <div className={styles.infoLabelSkeleton} />
          <div className={styles.valuesDisplaySkeleton} />
        </div>
      )}

      {/* Skeleton for Range component - matches exact layout */}
      <div className={styles.rangeContainer}>
        {/* Min Label - with wrapper to match real structure */}
        <div className={styles.labelWrapper}>
          <div className={styles.labelSkeleton} />
        </div>

        {/* Track */}
        <div className={styles.track}>
          <div className={styles.trackActive} />
          <div className={styles.handle} style={{ left: '0%' }} />
          <div className={styles.handle} style={{ left: '100%' }} />
        </div>

        {/* Max Label - with wrapper to match real structure */}
        <div className={styles.labelWrapper}>
          <div className={styles.labelSkeleton} />
        </div>
      </div>
    </div>
  );
}
