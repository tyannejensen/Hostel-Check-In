import { Document, ObjectId } from "mongoose"
import { ICardBrand, IPaymentType } from "@/mytypes/index"
import { IChangeLog } from "@/interfaces/index"

// Interfaces for Payment Method Subdocument
export interface IPaymentMethod extends Document {
	_id: ObjectId
	userId: string // reference to the user (tenant) who owns the payment - uses uuid v4
	isPrimary: boolean
	method: IPaymentType
	cardBrand?: ICardBrand
	cardNumberLastFour?: string // TODO: Update to use 'Tokenization' for PCI compliance
	expirationDate?: Date
	routingNumber?: string
	accountNumber?: string
	bankName?: string
	checkNumber?: string
	history: IChangeLog[]
	createdBy: string // reference to the user (employee) who created the payment method - uses uuid v4
	updatedBy: string // reference to the user (employee) who last updated the payment method - uses uuid v4
}
