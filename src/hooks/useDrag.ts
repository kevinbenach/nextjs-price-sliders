import { useCallback, useEffect, useRef, useState } from 'react';
import type { DraggingHandle } from '@/components/Range/Range.types';

interface UseDragOptions {
  trackRef: React.RefObject<HTMLDivElement | null>;
  onDrag: (handle: DraggingHandle, percent: number) => void;
  onDragEnd?: () => void;
}

interface UseDragReturn {
  isDragging: DraggingHandle;
  minHandleProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  };
  maxHandleProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  };
}

export function useDrag({ trackRef, onDrag, onDragEnd }: UseDragOptions): UseDragReturn {
  const [isDragging, setIsDragging] = useState<DraggingHandle>(null);

  const onDragRef = useRef(onDrag);
  const onDragEndRef = useRef(onDragEnd);
  const isDraggingRef = useRef<DraggingHandle>(null);

  useEffect(() => {
    onDragRef.current = onDrag;
    onDragEndRef.current = onDragEnd;
  }, [onDrag, onDragEnd]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  const getPercentFromClientX = useCallback((clientX: number): number => {
    const track = trackRef.current;
    if (!track) return 0;

    const rect = track.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;

    return Math.max(0, Math.min(1, percent));
  }, [trackRef]);

  const handleEnd = useCallback(() => {
    setIsDragging(null);
    onDragEndRef.current?.();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      e.preventDefault();
      const percent = getPercentFromClientX(e.clientX);
      onDragRef.current(isDraggingRef.current, percent);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length === 0) return;

      e.preventDefault();
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

  const createStartHandlers = (handle: 'min' | 'max') => ({
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(handle);
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
