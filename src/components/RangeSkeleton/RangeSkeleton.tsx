import styles from './RangeSkeleton.module.css';

export function RangeSkeleton() {
  return (
    <div className={styles.wrapper}>
      {/* Skeleton for Range component - matches exact layout */}
      <div className={styles.rangeContainer}>
        {/* Min Label */}
        <div className={styles.labelSkeleton} />

        {/* Track */}
        <div className={styles.track}>
          <div className={styles.trackActive} />
          <div className={styles.handle} style={{ left: '0%' }} />
          <div className={styles.handle} style={{ left: '100%' }} />
        </div>

        {/* Max Label */}
        <div className={styles.labelSkeleton} />
      </div>
    </div>
  );
}
