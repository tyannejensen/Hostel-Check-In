import { IPaymentDetails } from "@/interfaces/paymentDetails.interface"

// Interfaces for Payment Method Subdocument
export interface IPaymentMethod extends IPaymentDetails {
	isPrimary: boolean
	paymentName?: string
}
