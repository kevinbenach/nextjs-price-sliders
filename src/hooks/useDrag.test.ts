import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDrag } from './useDrag';

describe('useDrag', () => {
  // Helper to create a mock track ref
  const createMockTrackRef = () => {
    const div = document.createElement('div');
    // Mock getBoundingClientRect
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

    // Track is at x=100, width=200
    // clientX=150 should be 25% ((150-100)/200)
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

    // Test below range (clientX < track.left)
    act(() => {
      result.current.minHandleProps.onMouseDown({
        clientX: 50, // Before track starts
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent);
    });
    expect(mockOnDrag).toHaveBeenCalledWith('min', 0);

    mockOnDrag.mockClear();

    // Test above range (clientX > track.right)
    act(() => {
      result.current.maxHandleProps.onMouseDown({
        clientX: 400, // After track ends
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

    // Start dragging
    act(() => {
      result.current.minHandleProps.onMouseDown({
        clientX: 150,
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent);
    });

    expect(result.current.isDragging).toBe('min');

    // Simulate mouse up (this happens via document listener)
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

    // Start dragging first
    act(() => {
      result.current.minHandleProps.onMouseDown({
        clientX: 150,
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent);
    });

    expect(result.current.isDragging).toBe('min');
    mockOnDrag.mockClear();

    // Now test mouse move during drag
    act(() => {
      const moveEvent = new MouseEvent('mousemove', { clientX: 250 });
      document.dispatchEvent(moveEvent);
    });

    // Track is at x=100, width=200
    // clientX=250 should be 75% ((250-100)/200)
    expect(mockOnDrag).toHaveBeenCalledWith('min', 0.75);
  });
});
