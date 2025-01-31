// Custom types for interfaces and schemas
export type IRoomType = "shared" | "single" | "double" | "suite"

export type IRoomStatus = "available" | "occupied" | "maintenance" | "cleaning"

export type IRole = "admin" | "employee" | "tenant"

export type IBookingStatus = "paid" | "pending" | "booked" | "due"

export type IPaymentType =
	| "cash"
	| "credit"
	| "debit"
	| "bank"
	| "money order"
	| "check"
