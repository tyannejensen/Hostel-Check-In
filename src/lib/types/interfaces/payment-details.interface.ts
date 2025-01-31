import { IPaymentType } from "@/lib/types/index"

export interface IPaymentDetails {
	method: IPaymentType
	cardHolderName?: string
	cardNumber?: string
	expirationDate?: Date
	cvv?: string
	routingNumber?: string
	accountNumber?: string
	bankName?: string
	checkNumber?: string
}
