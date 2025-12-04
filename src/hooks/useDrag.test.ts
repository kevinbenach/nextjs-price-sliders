import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDrag } from './useDrag';

describe('useDrag', () => {
  const createMockTrackRef = () => {
    const div = document.createElement('div');
    div.getBoundingClientRect = vi.fn(() => ({
      left: 100,
      right: 300,
      top: 0,
      bottom: 0,
      width: 200,
      height: 20,
      x: 100,
      y: 0,
      toJSON: () => {},
    }));
    return { current: div };
  };

  it('should return correct initial structure', () => {
    const mockTrackRef = createMockTrackRef();
    const mockOnDrag = vi.fn();

    const { result } = renderHook(() =>
      useDrag({
        trackRef: mockTrackRef,
        onDrag: mockOnDrag,
      })
    );

    expect(result.current).toHaveProperty('isDragging');
    expect(result.current).toHaveProperty('minHandleProps');
    expect(result.current).toHaveProperty('maxHandleProps');
    expect(result.current.isDragging).toBe(null);
    expect(typeof result.current.minHandleProps.onMouseDown).toBe('function');
    expect(typeof result.current.minHandleProps.onTouchStart).toBe('function');
    expect(typeof result.current.maxHandleProps.onMouseDown).toBe('function');
    expect(typeof result.current.maxHandleProps.onTouchStart).toBe('function');
  });

  it('should calculate percentage from clientX correctly', () => {
    const mockTrackRef = createMockTrackRef();
    const mockOnDrag = vi.fn();

    const { result } = renderHook(() =>
      useDrag({
        trackRef: mockTrackRef,
        onDrag: mockOnDrag,
      })
    );

    const mouseEvent = {
      clientX: 150,
      preventDefault: vi.fn(),
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.minHandleProps.onMouseDown(mouseEvent);
    });

    expect(mockOnDrag).toHaveBeenCalledWith('min', 0.25);
  });

  it('should clamp percentage to 0-1 range', () => {
    const mockTrackRef = createMockTrackRef();
    const mockOnDrag = vi.fn();

    const { result } = renderHook(() =>
      useDrag({
        trackRef: mockTrackRef,
        onDrag: mockOnDrag,
      })
    );

    act(() => {
      result.current.minHandleProps.onMouseDown({
        clientX: 50,
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent);
    });
    expect(mockOnDrag).toHaveBeenCalledWith('min', 0);

    mockOnDrag.mockClear();

    act(() => {
      result.current.maxHandleProps.onMouseDown({
        clientX: 400,
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent);
    });
    expect(mockOnDrag).toHaveBeenCalledWith('max', 1);
  });

  it('should set isDragging when handle is pressed', () => {
    const mockTrackRef = createMockTrackRef();
    const mockOnDrag = vi.fn();

    const { result } = renderHook(() =>
      useDrag({
        trackRef: mockTrackRef,
        onDrag: mockOnDrag,
      })
    );

    expect(result.current.isDragging).toBe(null);

    act(() => {
      result.current.minHandleProps.onMouseDown({
        clientX: 150,
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent);
    });

    expect(result.current.isDragging).toBe('min');
  });

  it('should handle touch events', () => {
    const mockTrackRef = createMockTrackRef();
    const mockOnDrag = vi.fn();

    const { result } = renderHook(() =>
      useDrag({
        trackRef: mockTrackRef,
        onDrag: mockOnDrag,
      })
    );

    const touchEvent = {
      touches: [{ clientX: 150 }],
    } as unknown as React.TouchEvent;

    act(() => {
      result.current.minHandleProps.onTouchStart(touchEvent);
    });

    expect(mockOnDrag).toHaveBeenCalledWith('min', 0.25);
    expect(result.current.isDragging).toBe('min');
  });

  it('should call onDragEnd when provided', () => {
    const mockTrackRef = createMockTrackRef();
    const mockOnDrag = vi.fn();
    const mockOnDragEnd = vi.fn();

    const { result } = renderHook(() =>
      useDrag({
        trackRef: mockTrackRef,
        onDrag: mockOnDrag,
        onDragEnd: mockOnDragEnd,
      })
    );

    act(() => {
      result.current.minHandleProps.onMouseDown({
        clientX: 150,
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent);
    });

    expect(result.current.isDragging).toBe('min');

    act(() => {
      const mouseUpEvent = new MouseEvent('mouseup');
      document.dispatchEvent(mouseUpEvent);
    });

    expect(result.current.isDragging).toBe(null);
    expect(mockOnDragEnd).toHaveBeenCalled();
  });

  it('should handle mouse move during drag', () => {
    const mockTrackRef = createMockTrackRef();
    const mockOnDrag = vi.fn();

    const { result } = renderHook(() =>
      useDrag({
        trackRef: mockTrackRef,
        onDrag: mockOnDrag,
      })
    );

    act(() => {
      result.current.minHandleProps.onMouseDown({
        clientX: 150,
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent);
    });

    expect(result.current.isDragging).toBe('min');
    mockOnDrag.mockClear();

    act(() => {
      const moveEvent = new MouseEvent('mousemove', { clientX: 250 });
      document.dispatchEvent(moveEvent);
    });

    expect(mockOnDrag).toHaveBeenCalledWith('min', 0.75);
  });
});
