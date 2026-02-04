"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function DataTableRangeFilter({
  filter,
  column,
  inputId,
  onFilterUpdate,
  className,
  ...props
}) {
  const meta = column.columnDef.meta;

  const [min, max] = React.useMemo(() => {
    const range = column.columnDef.meta?.range;
    if (range) return range;

    const values = column.getFacetedMinMaxValues();
    if (!values) return [0, 100];

    return [values[0], values[1]];
  }, [column]);

  const formatValue = value => {
    if (value === undefined || value === "") return "";
    const numValue = Number(value);
    return Number.isNaN(numValue)
      ? ""
      : numValue.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        });
  };

  const value = React.useMemo(() => {
    if (Array.isArray(filter.value)) return filter.value.map(formatValue);
    return [formatValue(filter.value), ""];
  }, [filter.value]);

  const onRangeValueChange = (value, isMin) => {
    const numValue = Number(value);
    const currentValues = Array.isArray(filter.value)
      ? filter.value
      : ["", ""];

    const otherValue = isMin
      ? currentValues[1] ?? ""
      : currentValues[0] ?? "";

    if (
      value === "" ||
      (!Number.isNaN(numValue) &&
        (isMin
          ? numValue >= min && numValue <= (Number(otherValue) || max)
          : numValue <= max && numValue >= (Number(otherValue) || min)))
    ) {
      onFilterUpdate(filter.filterId, {
        value: isMin ? [value, otherValue] : [otherValue, value],
      });
    }
  };

  return (
    <div
      data-slot="range"
      className={cn("flex w-full items-center gap-2", className)}
      {...props}
    >
      <Input
        id={`${inputId}-min`}
        type="number"
        placeholder={min}
        min={min}
        max={max}
        className="h-8 w-full rounded"
        defaultValue={value[0]}
        onChange={e => onRangeValueChange(e.target.value, true)}
      />

      <Input
        id={`${inputId}-max`}
        type="number"
        placeholder={max}
        min={min}
        max={max}
        className="h-8 w-full rounded"
        defaultValue={value[1]}
        onChange={e => onRangeValueChange(e.target.value)}
      />
    </div>
  );
}
