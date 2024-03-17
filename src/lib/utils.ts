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

export function formatDuration(seconds: number) {
  // Convert seconds to hours
  const hours = Math.floor(seconds / 3600);

  if (hours >= 1) {
    // If duration is 1 hour or more, return in hours
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    // If duration is less than 1 hour, convert to minutes
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
}