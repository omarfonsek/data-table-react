"use client";

import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  GripVertical,
  ListFilter,
  Trash2,
} from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import * as React from "react";

import { DataTableRangeFilter } from "@/components/data-table/data-table-range-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Faceted,
  FacetedBadgeList,
  FacetedContent,
  FacetedEmpty,
  FacetedGroup,
  FacetedInput,
  FacetedItem,
  FacetedList,
  FacetedTrigger,
} from "@/components/ui/faceted";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/components/ui/sortable";

import { dataTableConfig } from "@/config/data-table";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { getDefaultFilterOperator, getFilterOperators } from "@/lib/data-table";
import { formatDate } from "@/lib/format";
import { generateId } from "@/lib/id";
import { getFiltersStateParser } from "@/lib/parsers";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;
const FILTER_SHORTCUT_KEY = "f";
const REMOVE_FILTER_SHORTCUTS = ["backspace", "delete"];

export function DataTableFilterList({
  table,
  debounceMs = DEBOUNCE_MS,
  throttleMs = THROTTLE_MS,
  shallow = true,
  ...props
}) {
  const id = React.useId();
  const labelId = React.useId();
  const descriptionId = React.useId();
  const [open, setOpen] = React.useState(false);
  const addButtonRef = React.useRef(null);

  const columns = React.useMemo(() => {
    return table
      .getAllColumns()
      .filter((column) => column.columnDef.enableColumnFilter);
  }, [table]);

  const [filters, setFilters] = useQueryState(
    table.options.meta?.queryKeys?.filters ?? "filters",
    getFiltersStateParser(columns.map((field) => field.id))
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
        shallow,
        throttleMs,
      })
  );

  const debouncedSetFilters = useDebouncedCallback(setFilters, debounceMs);

  const [joinOperator, setJoinOperator] = useQueryState(
    table.options.meta?.queryKeys?.joinOperator ?? "",
    parseAsStringEnum(["and", "or"]).withDefault("and").withOptions({
      clearOnDefault: true,
      shallow,
    })
  );

  const onFilterAdd = React.useCallback(() => {
    const column = columns[0];
    if (!column) return;

    debouncedSetFilters([
      ...filters,
      {
        id: column.id,
        value: "",
        variant: column.columnDef.meta?.variant ?? "text",
        operator: getDefaultFilterOperator(
          column.columnDef.meta?.variant ?? "text"
        ),
        filterId: generateId({ length: 8 }),
      },
    ]);
  }, [columns, filters, debouncedSetFilters]);

  const onFilterUpdate = React.useCallback(
    (filterId, updates) => {
      debouncedSetFilters((prevFilters) => {
        return prevFilters.map((filter) =>
          filter.filterId === filterId ? { ...filter, ...updates } : filter
        );
      });
    },
    [debouncedSetFilters]
  );

  const onFilterRemove = React.useCallback(
    (filterId) => {
      const updatedFilters = filters.filter((f) => f.filterId !== filterId);
      setFilters(updatedFilters);
      requestAnimationFrame(() => {
        addButtonRef.current?.focus();
      });
    },
    [filters, setFilters]
  );

  const onFiltersReset = React.useCallback(() => {
    setFilters(null);
    setJoinOperator("and");
  }, [setFilters, setJoinOperator]);

  React.useEffect(() => {
    function onKeyDown(event) {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement &&
          event.target.contentEditable === "true")
      ) {
        return;
      }

      if (
        event.key.toLowerCase() === FILTER_SHORTCUT_KEY &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey
      ) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const onTriggerKeyDown = React.useCallback(
    (event) => {
      if (
        REMOVE_FILTER_SHORTCUTS.includes(event.key.toLowerCase()) &&
        filters.length > 0
      ) {
        event.preventDefault();
        onFilterRemove(filters[filters.length - 1]?.filterId ?? "");
      }
    },
    [filters, onFilterRemove]
  );

  return (
    <Sortable
      value={filters}
      onValueChange={setFilters}
      getItemValue={(item) => item.filterId}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="font-normal"
            onKeyDown={onTriggerKeyDown}
          >
            <ListFilter className="text-muted-foreground" />
            Filter
            {filters.length > 0 && (
              <Badge
                variant="secondary"
                className="h-[18px] rounded px-[5px] font-mono text-[10px]"
              >
                {filters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          aria-describedby={descriptionId}
          aria-labelledby={labelId}
          className="flex w-full flex-col gap-3.5 p-4 sm:min-w-[380px]"
          {...props}
        >
          <div className="flex flex-col gap-1">
            <h4 id={labelId} className="font-medium leading-none">
              {filters.length > 0 ? "Filters" : "No filters applied"}
            </h4>
            <p
              id={descriptionId}
              className={cn(
                "text-muted-foreground text-sm",
                filters.length > 0 && "sr-only"
              )}
            >
              {filters.length > 0
                ? "Modify filters to refine your rows."
                : "Add filters to refine your rows."}
            </p>
          </div>

          {filters.length > 0 && (
            <SortableContent asChild>
              <ul className="flex max-h-[300px] flex-col gap-2 overflow-y-auto p-1">
                {filters.map((filter, index) => (
                  <DataTableFilterItem
                    key={filter.filterId}
                    filter={filter}
                    index={index}
                    filterItemId={`${id}-filter-${filter.filterId}`}
                    joinOperator={joinOperator}
                    setJoinOperator={setJoinOperator}
                    columns={columns}
                    onFilterUpdate={onFilterUpdate}
                    onFilterRemove={onFilterRemove}
                  />
                ))}
              </ul>
            </SortableContent>
          )}

          <div className="flex w-full items-center gap-2">
            <Button size="sm" ref={addButtonRef} onClick={onFilterAdd}>
              Add filter
            </Button>
            {filters.length > 0 && (
              <Button variant="outline" size="sm" onClick={onFiltersReset}>
                Reset filters
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <SortableOverlay>
        <div className="flex items-center gap-2">
          <div className="h-8 w-[72px] rounded bg-primary/10" />
          <div className="h-8 w-32 rounded bg-primary/10" />
          <div className="h-8 w-32 rounded bg-primary/10" />
          <div className="h-8 flex-1 rounded bg-primary/10" />
          <div className="size-8 rounded bg-primary/10" />
          <div className="size-8 rounded bg-primary/10" />
        </div>
      </SortableOverlay>
    </Sortable>
  );
}

/* ------------------------------------------
   ITEM
------------------------------------------- */

function DataTableFilterItem({
  filter,
  index,
  filterItemId,
  joinOperator,
  setJoinOperator,
  columns,
  onFilterUpdate,
  onFilterRemove,
}) {
  const [showFieldSelector, setShowFieldSelector] = React.useState(false);
  const [showOperatorSelector, setShowOperatorSelector] = React.useState(false);
  const [showValueSelector, setShowValueSelector] = React.useState(false);

  const column = columns.find((c) => c.id === filter.id);
  if (!column) return null;

  const columnMeta = column.columnDef.meta;
  const filterOperators = getFilterOperators(filter.variant);

  const inputId = `${filterItemId}-input`;

  const onItemKeyDown = (event) => {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    )
      return;

    if (showFieldSelector || showOperatorSelector || showValueSelector) return;

    if (REMOVE_FILTER_SHORTCUTS.includes(event.key.toLowerCase())) {
      event.preventDefault();
      onFilterRemove(filter.filterId);
    }
  };

  return (
    <SortableItem value={filter.filterId} asChild>
      <li
        id={filterItemId}
        tabIndex={-1}
        className="flex items-center gap-2"
        onKeyDown={onItemKeyDown}
      >
        {/* JOIN OPERATOR */}
        <div className="min-w-[72px] text-center">
          {index === 0 ? (
            <span className="text-muted-foreground text-sm">Where</span>
          ) : index === 1 ? (
            <Select
              value={joinOperator}
              onValueChange={(value) => setJoinOperator(value)}
            >
              <SelectTrigger size="sm" className="rounded lowercase">
                <SelectValue placeholder={joinOperator} />
              </SelectTrigger>
              <SelectContent className="lowercase">
                {dataTableConfig.joinOperators.map((op) => (
                  <SelectItem key={op} value={op}>
                    {op}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-muted-foreground text-sm">
              {joinOperator}
            </span>
          )}
        </div>

        {/* FIELD SELECTOR */}
        <Popover
          open={showFieldSelector}
          onOpenChange={setShowFieldSelector}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-32 justify-between rounded font-normal"
            >
              <span className="truncate">
                {columnMeta?.label ?? "Select field"}
              </span>
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-40 p-0">
            <Command>
              <CommandInput placeholder="Search fields..." />
              <CommandList>
                <CommandEmpty>No fields found.</CommandEmpty>
                <CommandGroup>
                  {columns.map((col) => (
                    <CommandItem
                      key={col.id}
                      value={col.id}
                      onSelect={(value) => {
                        onFilterUpdate(filter.filterId, {
                          id: value,
                          variant: col.columnDef.meta?.variant ?? "text",
                          operator: getDefaultFilterOperator(
                            col.columnDef.meta?.variant ?? "text"
                          ),
                          value: "",
                        });
                        setShowFieldSelector(false);
                      }}
                    >
                      <span className="truncate">
                        {col.columnDef.meta?.label}
                      </span>
                      <Check
                        className={cn(
                          "ml-auto",
                          col.id === filter.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* OPERATOR SELECT */}
        <Select
          open={showOperatorSelector}
          onOpenChange={setShowOperatorSelector}
          value={filter.operator}
          onValueChange={(value) =>
            onFilterUpdate(filter.filterId, {
              operator: value,
              value:
                value === "isEmpty" || value === "isNotEmpty"
                  ? ""
                  : filter.value,
            })
          }
        >
          <SelectTrigger size="sm" className="w-32 rounded lowercase">
            <SelectValue placeholder={filter.operator} />
          </SelectTrigger>
          <SelectContent>
            {filterOperators.map((op) => (
              <SelectItem key={op.value} value={op.value} className="lowercase">
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* FILTER INPUT */}
        <div className="flex-1 min-w-36">
          {onFilterInputRender({
            filter,
            inputId,
            column,
            columnMeta,
            onFilterUpdate,
            showValueSelector,
            setShowValueSelector,
          })}
        </div>

        {/* REMOVE BUTTON */}
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded"
          onClick={() => onFilterRemove(filter.filterId)}
        >
          <Trash2 />
        </Button>

        {/* DRAG HANDLE */}
        <SortableItemHandle asChild>
          <Button variant="outline" size="icon" className="size-8 rounded">
            <GripVertical />
          </Button>
        </SortableItemHandle>
      </li>
    </SortableItem>
  );
}

/* ------------------------------------------
 FILTER INPUT RENDER
------------------------------------------- */

function onFilterInputRender({
  filter,
  inputId,
  column,
  columnMeta,
  onFilterUpdate,
  showValueSelector,
  setShowValueSelector,
}) {
  if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") {
    return (
      <div
        id={inputId}
        role="status"
        aria-label={`${columnMeta?.label} filter is ${filter.operator === "isEmpty" ? "empty" : "not empty"
          }`}
        aria-live="polite"
        className="h-8 w-full rounded border bg-transparent dark:bg-input/30"
      />
    );
  }

  switch (filter.variant) {
    case "text":
    case "number":
    case "range": {
      const isNumber =
        filter.variant === "number" || filter.variant === "range";

      if (filter.operator === "isBetween") {
        return (
          <DataTableRangeFilter
            filter={filter}
            column={column}
            inputId={inputId}
            onFilterUpdate={onFilterUpdate}
          />
        );
      }

      return (
        <Input
          id={inputId}
          type={isNumber ? "number" : "text"}
          placeholder={columnMeta?.placeholder ?? "Enter a value..."}
          defaultValue={typeof filter.value === "string" ? filter.value : ""}
          onChange={(e) =>
            onFilterUpdate(filter.filterId, { value: e.target.value })
          }
          className="h-8 w-full rounded"
        />
      );
    }

    case "boolean": {
      return (
        <Select
          open={showValueSelector}
          onOpenChange={setShowValueSelector}
          value={filter.value}
          onValueChange={(value) =>
            onFilterUpdate(filter.filterId, { value })
          }
        >
          <SelectTrigger id={inputId} size="sm" className="w-full rounded">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    case "select":
    case "multiSelect": {
      const multiple = filter.variant === "multiSelect";

      const selectedValues = multiple
        ? Array.isArray(filter.value)
          ? filter.value
          : []
        : typeof filter.value === "string"
          ? filter.value
          : undefined;
      return (
        <Faceted
          open={showValueSelector}
          onOpenChange={setShowValueSelector}
          multiple={multiple}
          value={selectedValues}
          onValueChange={(value) =>
            onFilterUpdate(filter.filterId, { value })
          }
        >
          <FacetedTrigger asChild>
            <Button
              id={inputId}
              variant="outline"
              size="sm"
              className="w-full rounded font-normal"
            >
              <FacetedBadgeList
                options={columnMeta?.options}
                placeholder={columnMeta?.placeholder ?? "Select..."}
              />
            </Button>
          </FacetedTrigger>

          <FacetedContent className="w-[200px]">
            <FacetedInput placeholder="Search..." />
            <FacetedList>
              <FacetedEmpty>No options found.</FacetedEmpty>
              <FacetedGroup>
                {columnMeta?.options?.map((option) => (
                  <FacetedItem key={option.value} value={option.value}>
                    {option.icon && <option.icon />}
                    <span>{option.label}</span>
                    {option.count && (
                      <span className="ml-auto font-mono text-xs">
                        {option.count}
                      </span>
                    )}
                  </FacetedItem>
                ))}
              </FacetedGroup>
            </FacetedList>
          </FacetedContent>
        </Faceted>
      );
    }

    case "date":
    case "dateRange": {
      const dateValue = Array.isArray(filter.value)
        ? filter.value
        : [filter.value];

      const displayValue =
        filter.operator === "isBetween" && dateValue.length === 2
          ? `${formatDate(new Date(Number(dateValue[0])))} - ${formatDate(
            new Date(Number(dateValue[1]))
          )}`
          : dateValue[0]
            ? formatDate(new Date(Number(dateValue[0])))
            : "Pick a date";

      return (
        <Popover open={showValueSelector} onOpenChange={setShowValueSelector}>
          <PopoverTrigger asChild>
            <Button
              id={inputId}
              variant="outline"
              size="sm"
              className="w-full justify-start rounded font-normal"
            >
              <CalendarIcon className="mr-2" />
              {displayValue}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0">
            {filter.operator === "isBetween" ? (
              <Calendar
                mode="range"
                selected={{
                  from: dateValue[0] ? new Date(Number(dateValue[0])) : null,
                  to: dateValue[1] ? new Date(Number(dateValue[1])) : null,
                }}
                onSelect={(date) => {
                  onFilterUpdate(filter.filterId, {
                    value: [
                      date?.from?.getTime()?.toString() ?? "",
                      date?.to?.getTime()?.toString() ?? "",
                    ],
                  });
                }}
              />
            ) : (
              <Calendar
                mode="single"
                selected={
                  dateValue[0] ? new Date(Number(dateValue[0])) : null
                }
                onSelect={(date) => {
                  onFilterUpdate(filter.filterId, {
                    value: date?.getTime()?.toString() ?? "",
                  });
                  setShowValueSelector(false);
                }}
              />
            )}
          </PopoverContent>
        </Popover>
      );
    }

    default:
      return null;
  }
}
