import { Node } from "@/app/shared/types/common";
import { clsx, type ClassValue } from "clsx";
import LZString from "lz-string";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SanitiseJSON(text: string) {
  console.log("=>", text.split("```json")[1].split("```")[0]);

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
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    // If duration is less than 1 hour, convert to minutes
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
}

export const decodeFromURL = (params: URLSearchParams): Node[] => {
  let array = [];
  const code = params.get("code");
  if (code) {
    const uncompressed = LZString.decompressFromEncodedURIComponent(code);
    try {
      array = JSON.parse(uncompressed);
    } catch (e) { }
  }
  return array;
};

export function downloadImage(dataUrl: string) {
  const a = document.createElement("a");
  // [TODO] : set query string as a name for the file
  a.setAttribute("download", "roadmap.png");
  a.setAttribute("href", dataUrl);
  a.click();
}
// export const DIAGRAM_IMAGE_WIDTH = 4096;
// export const DIAGRAM_IMAGE_HEIGHT = 3048;
export const DIAGRAM_IMAGE_WIDTH = 1224;
export const DIAGRAM_IMAGE_HEIGHT = 786 + 786;

export function timeFromNow(dateString: string) {
  var createdDate = +new Date(dateString);
  var currentDate = +new Date();
  var timeDifference = Math.abs(currentDate - createdDate);
  var hourDifference = Math.floor(timeDifference / (1000 * 60 * 60));

  if (hourDifference < 1) {
    return "a few seconds ago";
  } else if (hourDifference === 1) {
    return "an hour ago";
  } else {
    return hourDifference + " hours ago";
  }
}

export const getFormattedDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(dateString));
};
