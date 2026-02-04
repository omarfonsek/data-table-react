// Utility functions for data table

// Get pinning styles for columns
export function getCommonPinningStyles({ column }) {
  const isPinned = column.getIsPinned()

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  }
}

// Filter operators for different column types
const textOperators = [
  { label: "Contiene", value: "contains" },
  { label: "No contiene", value: "notContains" },
  { label: "Es igual a", value: "equals" },
  { label: "No es igual a", value: "notEquals" },
  { label: "Empieza con", value: "startsWith" },
  { label: "Termina con", value: "endsWith" },
  { label: "Está vacío", value: "isEmpty" },
  { label: "No está vacío", value: "isNotEmpty" },
]

const numberOperators = [
  { label: "Es igual a", value: "equals" },
  { label: "No es igual a", value: "notEquals" },
  { label: "Mayor que", value: "greaterThan" },
  { label: "Mayor o igual que", value: "greaterThanOrEqual" },
  { label: "Menor que", value: "lessThan" },
  { label: "Menor o igual que", value: "lessThanOrEqual" },
  { label: "Entre", value: "between" },
  { label: "Está vacío", value: "isEmpty" },
  { label: "No está vacío", value: "isNotEmpty" },
]

const dateOperators = [
  { label: "Es", value: "equals" },
  { label: "No es", value: "notEquals" },
  { label: "Antes de", value: "before" },
  { label: "Después de", value: "after" },
  { label: "En o antes de", value: "onOrBefore" },
  { label: "En o después de", value: "onOrAfter" },
  { label: "Entre", value: "between" },
  { label: "Está vacío", value: "isEmpty" },
  { label: "No está vacío", value: "isNotEmpty" },
]

const selectOperators = [
  { label: "Es", value: "equals" },
  { label: "No es", value: "notEquals" },
  { label: "Está vacío", value: "isEmpty" },
  { label: "No está vacío", value: "isNotEmpty" },
]

const multiSelectOperators = [
  { label: "Incluye", value: "includes" },
  { label: "No incluye", value: "notIncludes" },
  { label: "Incluye todos", value: "includesAll" },
  { label: "Está vacío", value: "isEmpty" },
  { label: "No está vacío", value: "isNotEmpty" },
]

const booleanOperators = [{ label: "Es", value: "equals" }]

// Get filter operators based on column type
export function getFilterOperators(type) {
  switch (type) {
    case "text":
      return textOperators
    case "number":
      return numberOperators
    case "date":
      return dateOperators
    case "select":
      return selectOperators
    case "multi-select":
      return multiSelectOperators
    case "boolean":
      return booleanOperators
    default:
      return textOperators
  }
}

// Get default filter operator for a column type
export function getDefaultFilterOperator(type) {
  switch (type) {
    case "text":
      return "contains"
    case "number":
      return "equals"
    case "date":
      return "equals"
    case "select":
      return "equals"
    case "multi-select":
      return "includes"
    case "boolean":
      return "equals"
    default:
      return "contains"
  }
}
