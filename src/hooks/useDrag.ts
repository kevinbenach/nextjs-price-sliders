import { useCallback, useEffect, useRef, useState } from 'react';
import type { DraggingHandle } from '@/components/Range/Range.types';

interface UseDragOptions {
  /** Reference to the track element for position calculations */
  trackRef: React.RefObject<HTMLDivElement | null>;
  /** Callback when drag position changes (0-1 percentage) */
  onDrag: (handle: DraggingHandle, percent: number) => void;
  /** Callback when drag ends */
  onDragEnd?: () => void;
}

interface UseDragReturn {
  /** Which handle is currently being dragged */
  isDragging: DraggingHandle;
  /** Handlers to attach to the min handle */
  minHandleProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  };
  /** Handlers to attach to the max handle */
  maxHandleProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  };
}

/**
 * Custom hook for handling drag interactions on the Range component.
 * 
 * Why a custom hook?
 * - Separates interaction logic from rendering
 * - Makes the logic testable in isolation
 * - Could be reused for other draggable components
 * 
 * Key implementation details:
 * - Listeners are attached to document, not the handle, so dragging works
 *   even when the cursor moves faster than the UI updates
 * - Uses refs to avoid stale closures in event handlers
 * - Supports both mouse and touch events
 */
export function useDrag({ trackRef, onDrag, onDragEnd }: UseDragOptions): UseDragReturn {
  const [isDragging, setIsDragging] = useState<DraggingHandle>(null);

  // Store callbacks and dragging state in refs to avoid stale closures
  const onDragRef = useRef(onDrag);
  const onDragEndRef = useRef(onDragEnd);
  const isDraggingRef = useRef<DraggingHandle>(null);

  useEffect(() => {
    onDragRef.current = onDrag;
    onDragEndRef.current = onDragEnd;
  }, [onDrag, onDragEnd]);

  // Keep isDraggingRef in sync with isDragging state
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  /**
   * Converts a client X position to a percentage (0-1) along the track
   */
  const getPercentFromClientX = useCallback((clientX: number): number => {
    const track = trackRef.current;
    if (!track) return 0;

    const rect = track.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;

    // Clamp between 0 and 1
    return Math.max(0, Math.min(1, percent));
  }, [trackRef]);

  /**
   * Handles end of drag interaction
   */
  const handleEnd = useCallback(() => {
    setIsDragging(null);
    onDragEndRef.current?.();
  }, []);

  // Attach document-level listeners once, not on every isDragging change
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Check ref instead of closure variable to avoid stale closures
      if (!isDraggingRef.current) return;

      e.preventDefault();
      const percent = getPercentFromClientX(e.clientX);
      onDragRef.current(isDraggingRef.current, percent);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length === 0) return;

      const percent = getPercentFromClientX(e.touches[0].clientX);
      onDragRef.current(isDraggingRef.current, percent);
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        handleEnd();
      }
    };

    const handleTouchEnd = () => {
      if (isDraggingRef.current) {
        handleEnd();
      }
    };

    // Add listeners to document for reliable drag tracking
    // These stay attached for the component lifetime, avoiding re-attachment overhead
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [getPercentFromClientX, handleEnd]);

  /**
   * Creates handlers for starting a drag on a specific handle
   */
  const createStartHandlers = (handle: 'min' | 'max') => ({
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(handle);
      // Immediately calculate position on mousedown
      const percent = getPercentFromClientX(e.clientX);
      onDragRef.current(handle, percent);
    },
    onTouchStart: (e: React.TouchEvent) => {
      if (e.touches.length > 0) {
        setIsDragging(handle);
        const percent = getPercentFromClientX(e.touches[0].clientX);
        onDragRef.current(handle, percent);
      }
    },
  });

  return {
    isDragging,
    minHandleProps: createStartHandlers('min'),
    maxHandleProps: createStartHandlers('max'),
  };
}
