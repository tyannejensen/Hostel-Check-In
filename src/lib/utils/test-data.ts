import { IRoom } from "@/lib/types/interfaces/room.interface"

const users = [
	// 1 admin, 5 tenants, 6 total
	{
		// admin
		firstName: "John",
		lastName: "Doe",
		phoneNumber: [
			{
				countryCode: "+1",
				number: "555-555-5555",
				isMobile: true,
				isPrimary: true,
			},
		],
		email: "john@test.com",
		password: "password123",
		role: "admin",
		paymentMethod: [],
		bookings: [],
		tags: [],
		history: [],
		createdBy: "",
	},
	{
		// tenant #1
		firstName: "Jane",
		lastName: "Doe",
		phoneNumber: [
			{
				countryCode: "+1",
				number: "222-222-2222",
				isMobile: true,
				isPrimary: true,
			},
			{
				countryCode: "+1",
				number: "888-888-8888",
				isMobile: false,
				isPrimary: false,
			},
		],
		email: "jane@test.com",
		password: "password123",
		role: "tenant",
		paymentMethod: [
			{
				isPrimary: true,
				paymentName: "Cash",
			},
		],
		bookings: [],
		tags: ["delinquent"],
		history: [],
		createdBy: "",
		updatedBy: "",
	},
	{
		// tenant #2
		firstName: "Alice",
		lastName: "Smith",
		phoneNumber: [
			{
				countryCode: "+1",
				number: "444-444-4444",
				isMobile: true,
				isPrimary: true,
			},
		],
		email: "alice@test.com",
		password: "password123",
		role: "tenant",
		paymentMethod: [
			{
				isPrimary: true,
				paymentName: "My Checking",
				routingNumber: "123456789",
				accountNumber: "987654321",
				bankName: "US Bank",
			},
		],
		bookings: [],
		tags: ["regular"],
		history: [],
		createdBy: "",
		updatedBy: "",
	},
	{
		// tenant #3
		firstName: "Sam",
		lastName: "Jones",
		phoneNumber: [
			{
				countryCode: "+1",
				number: "777-777-7777",
				isMobile: true,
				isPrimary: true,
			},
		],
		email: "sam@test.com",
		password: "password123",
		role: "tenant",
		paymentMethod: [
			{
				isPrimary: true,
				paymentName: "Mastercard",
				cardHolerName: "Sam Jones",
				cardNumber: "1234567890123456",
				expirationDate: new Date("2028-12-31"),
				cvv: "567",
			},
			{
				isPrimary: false,
				paymentName: "Visa",
				cardHolerName: "Sam Jones",
				cardNumber: "1234567890150000",
				expirationDate: new Date("2026-12-31"),
				cvv: "123",
			},
		],
		bookings: [],
		tags: ["regular"],
		history: [],
		createdBy: "",
		updatedBy: "",
	},
	{
		// tenant #4
		firstName: "Katie",
		lastName: "Ames",
		phoneNumber: [
			{
				countryCode: "+1",
				number: "800-222-3333",
				isMobile: true,
				isPrimary: true,
			},
		],
		email: "katie@test.com",
		password: "password123",
		role: "tenant",
		paymentMethod: [
			{
				isPrimary: true,
				paymentName: "Visa",
				cardHolerName: "Katie Ames",
				cardNumber: "1234563330123456",
				expirationDate: new Date(new Date().getFullYear() + 2, 11, 31),
				cvv: "112",
			},
		],
		bookings: [],
		tags: ["regular"],
		history: [],
		createdBy: "",
		updatedBy: "",
	},
	{
		// tenant #5
		firstName: "Jason",
		lastName: "Borne",
		phoneNumber: [
			{
				countryCode: "+1",
				number: "999-999-9999",
				isMobile: true,
				isPrimary: true,
			},
		],
		email: "jason@test.com",
		password: "password123",
		role: "tenant",
		paymentMethod: [
			{
				isPrimary: true,
				paymentName: "check",
				routingNumber: "123456789",
				accountNumber: "987654321",
				bankName: "US Bank",
				checkNumber: "10021",
			},
		],
		bookings: [],
		tags: ["secret-agent"],
		history: [],
		createdBy: "",
		updatedBy: "",
	},
]

const rooms = [
	{
		type: "shared",
		roomNumber: "101A",
		status: "available",
		deposit: 100,
		bookedBy: "",
		name: "Room 101A",
		occupants: 4,
	},
	{
		type: "shared",
		roomNumber: "101B",
		status: "available",
		deposit: 100,
		bookedBy: "",
		name: "Room 101B",
		occupants: 4,
	},
	{
		type: "single",
		roomNumber: "102",
		status: "available",
		deposit: 300,
		bookedBy: "",
		name: "Room 102",
		occupants: 1,
	},
	{
		type: "double",
		roomNumber: "103",
		status: "available",
		deposit: 500,
		bookedBy: "",
		name: "Room 103",
		occupants: 2,
	},
	{
		type: "suite",
		roomNumber: "104",
		status: "available",
		deposit: 800,
		bookedBy: "",
		name: "Room 104",
		occupants: 2,
	},
]

const bookings = [
	{
		roomId: "",
		checkIn: new Date().getDate() - 4,
		checkOut: new Date().getDate() + 3,
		status: "paid",
		DepositAmount: null,
		depositReturned: false,
	},
	{
		roomId: "",
		checkIn: new Date().getDate() - 1,
		checkOut: new Date().getDate() + 5,
		status: "pending",
		DepositAmount: null,
		depositReturned: false,
	},
	{
		roomId: "",
		checkIn: new Date().getDate() - 1,
		checkOut: new Date().getDate() + 30,
		status: "paid",
		DepositAmount: null,
		depositReturned: false,
	},
	{
		roomId: "",
		checkIn: new Date(),
		checkOut: new Date().getDate() + 7,
		status: "pending",
		DepositAmount: null,
		depositReturned: false,
	},
	{
		roomId: "",
		checkIn: new Date().getDate() + 3,
		checkOut: new Date().getDate() + 7,
		status: "booked",
		DepositAmount: null,
		depositReturned: false,
	},
]

const notes = [
	{
		content: "Tenant is delinquent",
		createdBy: "",
	},
	{
		content: "Tenant is regular",
		createdBy: "",
	},
	{
		content: "Needs fresh sheets",
		createdBy: "",
	},
	{
		content: "Tenant is regular",
		createdBy: "",
	},
	{
		content: "North window is broken. Needs repair",
		createdBy: "",
	},
]

export { users, rooms, bookings, notes }
