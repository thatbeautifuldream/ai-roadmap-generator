import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function SanitiseJSON(text: any) {
  // ugly hack to remove the first and last part of response to get the JSON
  const json = text.split("```json")[1].split("```")[0];
  return json;
}

export function capitalize(str: string) {
  if (str && typeof str === "string") {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  return "";
}
