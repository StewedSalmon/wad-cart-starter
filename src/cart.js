// Implement cartTotal here. See README.md for the specification.
export function cartTotal(items, options) {
  if (items.length === 0) return 0

  const subtotal = items.reduce((total, item) => {
    if (item.price < 0 || !Number.isInteger(item.qty) || item.qty <= 0) {
      throw new RangeError('price must be non-negative and qty must be a positive integer')
    }

    return total + item.price * item.qty
  }, 0)

  const vat = subtotal * options.vatRate
  const shipping = subtotal >= options.freeShipFrom ? 0 : options.shipFee

  return Math.round(subtotal + vat + shipping)
}
