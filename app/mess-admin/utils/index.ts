// Utility functions for mess admin

/**
 * Format number as currency with consistent formatting
 * Prevents hydration mismatch by avoiding locale-specific formatting
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

/**
 * Format date in a consistent way
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB') // DD/MM/YYYY format
  } catch (error) {
    return dateString
  }
}

/**
 * Get status badge color classes
 */
export function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
    case 'inactive':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
    case 'pending':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200'
    case 'draft':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
  }
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
