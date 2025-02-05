import { IPaymentType, ICardBrand, IState } from "@/mytypes/index"

export function getPaymentTypes(): IPaymentType[] {
	return ["cash", "credit", "debit", "bank", "money order", "check"]
}

export function getCardBrands(): ICardBrand[] {
	return ["Visa", "Mastercard", "Amex", "Discover"]
}

export function getStates(): IState[] {
	return [
		"AL",
		"AK",
		"AZ",
		"AR",
		"CA",
		"CO",
		"CT",
		"DE",
		"FL",
		"GA",
		"HI",
		"ID",
		"IL",
		"IN",
		"IA",
		"KS",
		"KY",
		"LA",
		"ME",
		"MD",
		"MA",
		"MI",
		"MN",
		"MS",
		"MO",
		"MT",
		"NE",
		"NV",
		"NH",
		"NJ",
		"NM",
		"NY",
		"NC",
		"ND",
		"OH",
		"OK",
		"OR",
		"PA",
		"RI",
		"SC",
		"SD",
		"TN",
		"TX",
		"UT",
		"VT",
		"VA",
		"WA",
		"WV",
	]
}
