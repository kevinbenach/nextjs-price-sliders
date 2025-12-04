"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useDrag } from "@/hooks/useDrag";
import type {
  RangeProps,
  NormalRangeProps,
  FixedRangeProps,
  DraggingHandle,
} from "./Range.types";
import styles from "./Range.module.css";

function isNormalMode(props: RangeProps): props is NormalRangeProps {
  return props.mode === "normal";
}

export function Range(props: RangeProps) {
  const { onChange, currency = "€" } = props;

  const trackRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const propsRef = useRef(props);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  const [state, setState] = useState(() => {
    if (isNormalMode(props)) {
      const minValue = props.initialMinValue ?? props.min;
      const maxValue = props.initialMaxValue ?? props.max;
      return {
        minValue,
        maxValue,
        minPercent: (minValue - props.min) / (props.max - props.min),
        maxPercent: (maxValue - props.min) / (props.max - props.min),
      };
    } else {
      const values = props.values;
      const minIndex = props.initialMinIndex ?? 0;
      const maxIndex = props.initialMaxIndex ?? values.length - 1;
      const minVal = values[minIndex];
      const maxVal = values[maxIndex];
      const rangeMin = values[0];
      const rangeMax = values[values.length - 1];
      const range = rangeMax - rangeMin;
      return {
        minValue: minVal,
        maxValue: maxVal,
        minPercent: (minVal - rangeMin) / range,
        maxPercent: (maxVal - rangeMin) / range,
      };
    }
  });

  const [editingLabel, setEditingLabel] = useState<"min" | "max" | null>(null);
  const [editValue, setEditValue] = useState("");

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
          const maxAllowedPercent = ((prev.maxValue - step) - min) / range;
          newMinPercent = Math.min(percent, maxAllowedPercent);
          const rawValue = min + newMinPercent * range;
          newMinValue = Math.round(rawValue / step) * step;
          newMinPercent = (newMinValue - min) / range;
        } else {
          const minAllowedPercent = ((prev.minValue + step) - min) / range;
          newMaxPercent = Math.max(percent, minAllowedPercent);
          const rawValue = min + newMaxPercent * range;
          newMaxValue = Math.round(rawValue / step) * step;
          newMaxPercent = (newMaxValue - min) / range;
        }
      } else {
        const { values } = currentProps;
        const rangeMin = values[0];
        const rangeMax = values[values.length - 1];
        const range = rangeMax - rangeMin;

        if (handle === "min") {
          const targetValue = rangeMin + (percent * range);

          let nearestValue = values[0];
          let minDistance = Infinity;

          for (const val of values) {
            if (val < prev.maxValue) {
              const distance = Math.abs(val - targetValue);
              if (distance < minDistance) {
                minDistance = distance;
                nearestValue = val;
              }
            }
          }

          newMinValue = nearestValue;
          newMinPercent = (nearestValue - rangeMin) / range;
        } else {
          const targetValue = rangeMin + (percent * range);

          let nearestValue = values[values.length - 1];
          let minDistance = Infinity;

          for (const val of values) {
            if (val > prev.minValue) {
              const distance = Math.abs(val - targetValue);
              if (distance < minDistance) {
                minDistance = distance;
                nearestValue = val;
              }
            }
          }

          newMaxValue = nearestValue;
          newMaxPercent = (nearestValue - rangeMin) / range;
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

  useEffect(() => {
    onChangeRef.current?.({ min: state.minValue, max: state.maxValue });
  }, [state.minValue, state.maxValue]);

  const { isDragging, minHandleProps, maxHandleProps } = useDrag({
    trackRef,
    onDrag: handleDrag,
  });

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
      const { min, max, step = 1 } = currentProps;

      setState((prev) => {
        if (editingLabel === "min") {
          const clampedValue = Math.max(min, Math.min(numValue, prev.maxValue - step));
          return {
            ...prev,
            minValue: clampedValue,
            minPercent: (clampedValue - min) / (max - min),
          };
        } else {
          const clampedValue = Math.max(prev.minValue + step, Math.min(numValue, max));
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

  const formatValue = (value: number) => `${value.toFixed(2)}${currency}`;

  const isInNormalMode = isNormalMode(props);

  const renderLabel = (which: "min" | "max") => {
    const value = which === "min" ? state.minValue : state.maxValue;
    const isEditing = editingLabel === which;

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

  const ariaValues = isInNormalMode
    ? { min: (props as NormalRangeProps).min, max: (props as NormalRangeProps).max }
    : {
        min: (props as FixedRangeProps).values[0],
        max: (props as FixedRangeProps).values[(props as FixedRangeProps).values.length - 1]
      };

  return (
    <div className={styles.container} data-testid="range-container">
      <div className={styles.labelWrapper}>{renderLabel("min")}</div>

      <div ref={trackRef} className={styles.track} data-testid="range-track">
        <div
          className={styles.trackActive}
          style={{
            left: `${state.minPercent * 100}%`,
            width: `${(state.maxPercent - state.minPercent) * 100}%`,
          }}
          data-testid="range-track-active"
        />

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

      <div className={styles.labelWrapper}>{renderLabel("max")}</div>
    </div>
  );
}
