export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  const symbol = currency === 'INR' ? '₹' : currency
  return `${symbol}${amount.toFixed(2)}`
}

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}
