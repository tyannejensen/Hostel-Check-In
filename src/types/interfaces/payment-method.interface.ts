import { IPaymentDetails } from "@/mytypes/interfaces/payment-details.interface"

// Interfaces for Payment Method Subdocument
export interface IPaymentMethod extends IPaymentDetails {
	isPrimary: boolean
	paymentName?: string
}
