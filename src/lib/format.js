export function formatDate(date, options = {}) {
  if (!date) return ""
  
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options
  }
  
  return new Date(date).toLocaleDateString("es-ES", defaultOptions)
}

export function formatDateTime(date, options = {}) {
  if (!date) return ""
  
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options
  }
  
  return new Date(date).toLocaleDateString("es-ES", defaultOptions)
}

export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatNumber(number, options = {}) {
  return new Intl.NumberFormat("es-ES", options).format(number)
}
