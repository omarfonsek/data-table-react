export const dataTableConfig = {
  textOperators: [
    { label: "Contiene", value: "contains" },
    { label: "No contiene", value: "notContains" },
    { label: "Es", value: "is" },
    { label: "No es", value: "isNot" },
    { label: "Empieza con", value: "startsWith" },
    { label: "Termina con", value: "endsWith" },
  ],
  numericOperators: [
    { label: "=", value: "eq" },
    { label: "≠", value: "notEq" },
    { label: ">", value: "gt" },
    { label: "≥", value: "gte" },
    { label: "<", value: "lt" },
    { label: "≤", value: "lte" },
  ],
  dateOperators: [
    { label: "Es", value: "is" },
    { label: "No es", value: "isNot" },
    { label: "Antes de", value: "before" },
    { label: "Después de", value: "after" },
  ],
}
