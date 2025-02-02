function setDate(days: number): Date {
	return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}

// Users data
const usersData = [
	// 1 admin, 5 tenants, 6 total
	{
		// admin
		firstName: "John",
		lastName: "Doe",
		phoneNumbers: [
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
		paymentMethods: [],
		bookings: [],
		tags: ["boss"],
		history: [],
		createdBy: "",
	},
	{
		// tenant #1
		firstName: "Jane",
		lastName: "Doe",
		phoneNumbers: [
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
		paymentMethods: [
			{
				isPrimary: true,
				paymentName: "My Pocket",
				method: "cash",
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
		phoneNumbers: [
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
		paymentMethods: [
			{
				isPrimary: true,
				method: "bank",
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
		phoneNumbers: [
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
		paymentMethods: [
			{
				isPrimary: true,
				method: "credit",
				paymentName: "Mastercard",
				cardHolerName: "Sam Jones",
				cardNumber: "1234567890123456",
				expirationDate: new Date("2028-12-31"),
				cvv: "567",
			},
			{
				isPrimary: false,
				method: "credit",
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
		phoneNumbers: [
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
		paymentMethods: [
			{
				isPrimary: true,
				method: "credit",
				paymentName: "Visa",
				cardHolerName: "Katie Ames",
				cardNumber: "1234563330123456",
				expirationDate: new Date(
					new Date(new Date().getFullYear() + 2, 11, 31)
				),
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
		phoneNumbers: [
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
		paymentMethods: [
			{
				isPrimary: true,
				method: "check",
				paymentName: "Check",
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

// Rooms data for Bookings
const roomsData = [
	{
		type: "shared",
		roomNumber: "101A",
		status: "occupied",
		deposit: 100,
		name: "Room 101A",
		size: 4,
		occupants: [],
	},
	{
		type: "shared",
		roomNumber: "101B",
		status: "occupied",
		deposit: 100,
		name: "Room 101B",
		size: 4,
		occupants: [],
	},
	{
		type: "single",
		roomNumber: "102",
		status: "occupied",
		deposit: 300,
		name: "Room 102",
		size: 1,
		occupants: [],
	},
	{
		type: "double",
		roomNumber: "103",
		status: "occupied",
		deposit: 500,
		name: "Room 103",
		size: 2,
		occupants: [],
	},
	{
		type: "suite",
		roomNumber: "104",
		status: "occupied",
		deposit: 800,
		name: "Room 104",
		size: 2,
		occupants: [],
	},
]

// Bookings data
const bookingsData = [
	{
		roomId: "",
		checkIn: setDate(-4),
		checkOut: setDate(3),
		status: "paid",
		DepositAmount: null,
		depositReturned: false,
	},
	{
		roomId: "",
		checkIn: setDate(-1),
		checkOut: setDate(5),
		status: "pending",
		DepositAmount: null,
		depositReturned: false,
	},
	{
		roomId: "",
		checkIn: setDate(-2),
		checkOut: setDate(30),
		status: "paid",
		DepositAmount: null,
		depositReturned: false,
	},
	{
		roomId: "",
		checkIn: setDate(0),
		checkOut: setDate(7),
		status: "pending",
		DepositAmount: null,
		depositReturned: false,
	},
	{
		roomId: "",
		checkIn: setDate(3),
		checkOut: setDate(10),
		status: "booked",
		DepositAmount: null,
		depositReturned: false,
	},
]

// Notes data for Bookings
const notesData = [
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

export { usersData, roomsData, bookingsData, notesData }
