import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 } from 'uuid'
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUuid() {
  return v4()
}