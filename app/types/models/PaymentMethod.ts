export interface PaymentMethod {
  id: number
  accountId: number
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other'
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  createdAt: string
}
