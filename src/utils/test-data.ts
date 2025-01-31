const users = [
	// 1 admin, 3 tenants
	{
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
		transactions: [],
		tags: [],
		history: [],
		createdBy: "insert_uuid_here",
	},
	{
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
		transactions: [],
		tags: [],
		history: [],
		createdBy: "insert_uuid_here",
		updatedBy: "insert_uuid_here",
	},
	{
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
		transactions: [],
		tags: [],
		history: [],
		createdBy: "insert_uuid_here",
		updatedBy: "insert_uuid_here",
	},
	{
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
		transactions: [],
		tags: [],
		history: [],
		createdBy: "insert_uuid_here",
		updatedBy: "insert_uuid_here",
	},
]

export { users }
