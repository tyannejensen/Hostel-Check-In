import { Document } from "mongoose"
import { IState } from "@/mytypes/index"

export interface IBillingAddress extends Document {
	addressLineOne: string
	addressLineTwo: string
	city: string
	postalCode: string
	state: IState
	country: string
}
