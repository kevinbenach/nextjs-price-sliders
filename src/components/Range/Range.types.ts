 export type RangeValues = {
    min: number;
    max: number;
  };

  export type NormalRangeProps = {
    mode: "normal";
    min: number;
    max: number;
    initialMinValue?: number;
    initialMaxValue?: number;
    step?: number;
    currency?: string;
    onChange?: (values: RangeValues) => void;
  };

  export type FixedRangeProps = {
    mode: "fixed";
    values: number[];
    initialMinIndex?: number;
    initialMaxIndex?: number;
    currency?: string;
    onChange?: (values: RangeValues) => void;
  };

  export type RangeProps = NormalRangeProps | FixedRangeProps;
  export type DraggingHandle = "min" | "max" | null;