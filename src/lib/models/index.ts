// import all models
import { Booking } from "@/models/Booking.model"
import { Payment } from "@/models/Payment.model"
import { PaymentMethod } from "@/models/PaymentMethod.model"
import { Room } from "@/models/Room.model"
import { User } from "@/models/User.model"
// import all schemas
import { BillingAddressSchema } from "@/models/BillingAddress.schema"
import { ChangeLogSchema } from "@/models/ChangeLog.schema"
import { LogSchema } from "@/models/Log.schema"
import { NoteSchema } from "@/models/Note.schema"
import { PhoneNumberSchema } from "@/models/PhoneNumber.schema"

// Export all models and schmeas
export {
	User,
	Booking,
	Payment,
	PaymentMethod,
	Room,
	BillingAddressSchema,
	ChangeLogSchema,
	LogSchema,
	PhoneNumberSchema,
	NoteSchema,
}
