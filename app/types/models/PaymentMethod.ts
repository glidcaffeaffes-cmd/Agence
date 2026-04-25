export interface PaymentMethod {
  id: number
  accountId: number
  cardholderName: string
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other'
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  createdAt: string
}
