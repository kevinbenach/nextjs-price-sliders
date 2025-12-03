"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useDrag } from "@/hooks/useDrag";
import type {
  RangeProps,
  NormalRangeProps,
  FixedRangeProps,
  DraggingHandle,
  RangeValues,
} from "./Range.types";
import styles from "./Range.module.css";

/**
 * Type guard to check if props are for normal mode
 */
function isNormalMode(props: RangeProps): props is NormalRangeProps {
  return props.mode === "normal";
}

/**
 * Range Component
 *
 * A custom dual-handle range slider with two modes:
 * - Normal: Continuous values between min and max
 * - Fixed: Discrete values from a predefined array
 *
 * Features:
 * - Draggable handles with hover/drag states
 * - Editable labels (normal mode only)
 * - Handles cannot cross each other
 * - Touch support
 * - Accessible (keyboard support, ARIA labels)
 */
export function Range(props: RangeProps) {
  const { onChange, currency = "€" } = props;

  const trackRef = useRef<HTMLDivElement>(null);
  // Store onChange in a ref to avoid re-renders when it changes
  const onChangeRef = useRef(onChange);

  // Update ref when onChange changes without triggering re-renders
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Store props in a ref to avoid stale closures in callbacks
  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  // Initialize state based on mode
  const [state, setState] = useState(() => {
    if (isNormalMode(props)) {
      const minValue = props.initialMinValue ?? props.min;
      const maxValue = props.initialMaxValue ?? props.max;
      return {
        minValue,
        maxValue,
        // Calculate percentages
        minPercent: (minValue - props.min) / (props.max - props.min),
        maxPercent: (maxValue - props.min) / (props.max - props.min),
      };
    } else {
      const values = props.values;
      const minIndex = props.initialMinIndex ?? 0;
      const maxIndex = props.initialMaxIndex ?? values.length - 1;
      return {
        minValue: values[minIndex],
        maxValue: values[maxIndex],
        minPercent: minIndex / (values.length - 1),
        maxPercent: maxIndex / (values.length - 1),
      };
    }
  });

  // Editing state for labels (normal mode only)
  const [editingLabel, setEditingLabel] = useState<"min" | "max" | null>(null);
  const [editValue, setEditValue] = useState("");

  /**
   * Handles drag updates from the useDrag hook
   */
  const handleDrag = useCallback((handle: DraggingHandle, percent: number) => {
    if (!handle) return;

    setState((prev) => {
      let newMinPercent = prev.minPercent;
      let newMaxPercent = prev.maxPercent;
      let newMinValue = prev.minValue;
      let newMaxValue = prev.maxValue;

      const currentProps = propsRef.current;

      if (isNormalMode(currentProps)) {
        const { min, max, step = 1 } = currentProps;
        const range = max - min;

        if (handle === "min") {
          // Clamp so min doesn't exceed max
          newMinPercent = Math.min(percent, prev.maxPercent);
          const rawValue = min + newMinPercent * range;
          // Snap to step
          newMinValue = Math.round(rawValue / step) * step;
          // Recalculate percent based on snapped value
          newMinPercent = (newMinValue - min) / range;
        } else {
          // Clamp so max doesn't go below min
          newMaxPercent = Math.max(percent, prev.minPercent);
          const rawValue = min + newMaxPercent * range;
          newMaxValue = Math.round(rawValue / step) * step;
          newMaxPercent = (newMaxValue - min) / range;
        }
      } else {
        // Fixed mode - snap to nearest index
        const { values } = currentProps;
        const numSteps = values.length - 1;

        if (handle === "min") {
          const rawIndex = Math.round(percent * numSteps);
          // Clamp so min doesn't exceed max
          const maxIndex = Math.round(prev.maxPercent * numSteps);
          const clampedIndex = Math.min(rawIndex, maxIndex);
          newMinPercent = clampedIndex / numSteps;
          newMinValue = values[clampedIndex];
        } else {
          const rawIndex = Math.round(percent * numSteps);
          const minIndex = Math.round(prev.minPercent * numSteps);
          const clampedIndex = Math.max(rawIndex, minIndex);
          newMaxPercent = clampedIndex / numSteps;
          newMaxValue = values[clampedIndex];
        }
      }

      return {
        minValue: newMinValue,
        maxValue: newMaxValue,
        minPercent: newMinPercent,
        maxPercent: newMaxPercent,
      };
    });
  }, []);

  // Notify parent of changes using ref to avoid re-render issues
  useEffect(() => {
    onChangeRef.current?.({ min: state.minValue, max: state.maxValue });
  }, [state.minValue, state.maxValue]);

  const { isDragging, minHandleProps, maxHandleProps } = useDrag({
    trackRef,
    onDrag: handleDrag,
  });

  /**
   * Handles label editing (normal mode only)
   */
  const handleLabelClick = useCallback(
    (which: "min" | "max") => {
      const currentProps = propsRef.current;
      if (!isNormalMode(currentProps)) return;

      setEditingLabel(which);
      setEditValue(
        which === "min" ? state.minValue.toString() : state.maxValue.toString()
      );
    },
    [state.minValue, state.maxValue]
  );

  const handleLabelBlur = useCallback(() => {
    if (!editingLabel) return;

    const currentProps = propsRef.current;
    if (!isNormalMode(currentProps)) return;

    const numValue = parseFloat(editValue);

    if (!isNaN(numValue)) {
      const { min, max } = currentProps;

      setState((prev) => {
        if (editingLabel === "min") {
          // Clamp between min and current max value
          const clampedValue = Math.max(min, Math.min(numValue, prev.maxValue));
          return {
            ...prev,
            minValue: clampedValue,
            minPercent: (clampedValue - min) / (max - min),
          };
        } else {
          // Clamp between current min value and max
          const clampedValue = Math.max(prev.minValue, Math.min(numValue, max));
          return {
            ...prev,
            maxValue: clampedValue,
            maxPercent: (clampedValue - min) / (max - min),
          };
        }
      });
    }

    setEditingLabel(null);
    setEditValue("");
  }, [editingLabel, editValue]);

  const handleLabelKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleLabelBlur();
      } else if (e.key === "Escape") {
        setEditingLabel(null);
        setEditValue("");
      }
    },
    [handleLabelBlur]
  );

  /**
   * Formats value with currency for display
   */
  const formatValue = (value: number) => `${value.toFixed(2)}${currency}`;

  // Check if we're in normal mode (for label editing)
  const isInNormalMode = isNormalMode(props);

  /**
   * Render label (min or max) - Simple, no over-memoization
   */
  const renderLabel = (which: "min" | "max") => {
    const value = which === "min" ? state.minValue : state.maxValue;
    const isEditing = editingLabel === which;

    // Show input when editing (normal mode only)
    if (isInNormalMode && isEditing) {
      const currentProps = propsRef.current as NormalRangeProps;
      const min = which === "min" ? currentProps.min : state.minValue;
      const max = which === "min" ? state.maxValue : currentProps.max;

      return (
        <input
          type="number"
          className={styles.labelInput}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleLabelBlur}
          onKeyDown={handleLabelKeyDown}
          autoFocus
          min={min}
          max={max}
          step={currentProps.step ?? 1}
          aria-label={`${which === "min" ? "Minimum" : "Maximum"} value input`}
        />
      );
    }

    // Show label (clickable in normal mode)
    return (
      <span
        className={`${styles.label} ${isInNormalMode ? styles.labelEditable : ""}`}
        onClick={() => isInNormalMode && handleLabelClick(which)}
        role={isInNormalMode ? "button" : undefined}
        tabIndex={isInNormalMode ? 0 : undefined}
        onKeyDown={(e) => isInNormalMode && e.key === "Enter" && handleLabelClick(which)}
        aria-label={`${which === "min" ? "Minimum" : "Maximum"} value: ${formatValue(value)}`}
      >
        {formatValue(value)}
      </span>
    );
  };

  // Helper to get ARIA values based on mode
  const getAriaValues = () => {
    if (isInNormalMode) {
      const normalProps = props as NormalRangeProps;
      return { min: normalProps.min, max: normalProps.max };
    } else {
      const fixedProps = props as FixedRangeProps;
      return {
        min: fixedProps.values[0],
        max: fixedProps.values[fixedProps.values.length - 1],
      };
    }
  };

  const ariaValues = getAriaValues();

  return (
    <div className={styles.container} data-testid="range-container">
      {/* Min Label */}
      <div className={styles.labelWrapper}>{renderLabel("min")}</div>

      {/* Track */}
      <div ref={trackRef} className={styles.track} data-testid="range-track">
        {/* Active range highlight */}
        <div
          className={styles.trackActive}
          style={{
            left: `${state.minPercent * 100}%`,
            width: `${(state.maxPercent - state.minPercent) * 100}%`,
          }}
          data-testid="range-track-active"
        />

        {/* Min Handle */}
        <div
          className={`${styles.handle} ${isDragging === "min" ? styles.handleDragging : ""}`}
          style={{ left: `${state.minPercent * 100}%` }}
          {...minHandleProps}
          role="slider"
          aria-label="Minimum value handle"
          aria-valuemin={ariaValues.min}
          aria-valuemax={state.maxValue}
          aria-valuenow={state.minValue}
          tabIndex={0}
          data-testid="range-handle-min"
        />

        {/* Max Handle */}
        <div
          className={`${styles.handle} ${isDragging === "max" ? styles.handleDragging : ""}`}
          style={{ left: `${state.maxPercent * 100}%` }}
          {...maxHandleProps}
          role="slider"
          aria-label="Maximum value handle"
          aria-valuemin={state.minValue}
          aria-valuemax={ariaValues.max}
          aria-valuenow={state.maxValue}
          tabIndex={0}
          data-testid="range-handle-max"
        />
      </div>

      {/* Max Label */}
      <div className={styles.labelWrapper}>{renderLabel("max")}</div>
    </div>
  );
}
