import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFallback(username: string | null | undefined) {
  if (!username) return "NA"
  const words = username.split(" ")

  const firstWord = words[0]
  const secondWord = words.length > 1 ? words[1] : ""

  const firstLetterFirstWord = firstWord.charAt(0)
  const firstLetterSecondWord = secondWord.charAt(0)

  const fallback =
    firstLetterFirstWord.toUpperCase() + firstLetterSecondWord.toUpperCase()

  return fallback
}
