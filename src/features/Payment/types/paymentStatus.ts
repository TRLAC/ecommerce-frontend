// Khớp enum PaymentStatus của BE.
// PENDING -> SUCCESS / FAILED / CANCELLED; SUCCESS -> REFUNDED
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
