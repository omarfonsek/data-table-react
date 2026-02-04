"use client";

import { PlusCircle, XCircle } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

function getIsValidRange(value) {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

function parseValuesAsNumbers(value) {
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(v => (typeof v === "string" || typeof v === "number") && !Number.isNaN(v))
  ) {
    return [Number(value[0]), Number(value[1])];
  }
  return undefined;
}

export function DataTableSliderFilter({ column, title }) {
  const id = React.useId();
  const columnFilterValue = parseValuesAsNumbers(column.getFilterValue());
  const defaultRange = column.columnDef.meta?.range;
  const unit = column.columnDef.meta?.unit;

  const { min, max, step } = React.useMemo(() => {
    let minValue = 0;
    let maxValue = 100;

    if (defaultRange && getIsValidRange(defaultRange)) {
      [minValue, maxValue] = defaultRange;
    } else {
      const values = column.getFacetedMinMaxValues();
      if (values && Array.isArray(values) && values.length === 2) {
        const [facetMinValue, facetMaxValue] = values;
        if (typeof facetMinValue === "number" && typeof facetMaxValue === "number") {
          minValue = facetMinValue;
          maxValue = facetMaxValue;
        }
      }
    }

    const rangeSize = maxValue - minValue;
    const step =
      rangeSize <= 20
        ? 1
        : rangeSize <= 100
        ? Math.ceil(rangeSize / 20)
        : Math.ceil(rangeSize / 50);

    return { min: minValue, max: maxValue, step };
  }, [column, defaultRange]);

  const range = React.useMemo(() => {
    return columnFilterValue ?? [min, max];
  }, [columnFilterValue, min, max]);

  const formatValue = value =>
    value.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const onFromInputChange = event => {
    const numValue = Number(event.target.value);
    if (!Number.isNaN(numValue) && numValue >= min && numValue <= range[1]) {
      column.setFilterValue([numValue, range[1]]);
    }
  };

  const onToInputChange = event => {
    const numValue = Number(event.target.value);
    if (!Number.isNaN(numValue) && numValue <= max && numValue >= range[0]) {
      column.setFilterValue([range[0], numValue]);
    }
  };

  const onSliderValueChange = value => {
    if (Array.isArray(value) && value.length === 2) {
      column.setFilterValue(value);
    }
  };

  const onReset = event => {
    if (event.target instanceof HTMLDivElement) {
      event.stopPropagation();
    }
    column.setFilterValue(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed font-normal">
          {columnFilterValue ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
              onClick={onReset}
            >
              <XCircle />
            </div>
          ) : (
            <PlusCircle />
          )}
          <span>{title}</span>

          {columnFilterValue && (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              {formatValue(columnFilterValue[0])} - {formatValue(columnFilterValue[1])}
              {unit ? ` ${unit}` : ""}
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="flex w-auto flex-col gap-4">
        <div className="flex flex-col gap-3">
          <p className="font-medium leading-none">{title}</p>

          <div className="flex items-center gap-4">
            {/* MIN */}
            <div className="relative">
              <Input
                id={`${id}-from`}
                type="number"
                placeholder={min}
                min={min}
                max={max}
                value={range[0]}
                onChange={onFromInputChange}
                className={cn("h-8 w-24", unit && "pr-8")}
              />
              {unit && <span className="absolute right-0 px-2 text-sm">{unit}</span>}
            </div>

            {/* MAX */}
            <div className="relative">
              <Input
                id={`${id}-to`}
                type="number"
                placeholder={max}
                min={min}
                max={max}
                value={range[1]}
                onChange={onToInputChange}
                className={cn("h-8 w-24", unit && "pr-8")}
              />
              {unit && <span className="absolute right-0 px-2 text-sm">{unit}</span>}
            </div>
          </div>

          <Slider min={min} max={max} step={step} value={range} onValueChange={onSliderValueChange} />
        </div>

        <Button variant="outline" size="sm" onClick={onReset}>
          Clear
        </Button>
      </PopoverContent>
    </Popover>
  );
}
