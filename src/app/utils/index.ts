import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine classnames with Tailwind CSS
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
