"use client";

import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

export default function NavItems() {
  const pathname = usePathname();
  return (
    <div className="flex gap-x-3 ml-4">
      <Link
        className="font-semibold text-sm underline-offset-4 hover:underline"
        href={"/explore"}
      >
        <span
          className={cn(
            "text-gray-500 hidden sm:flex",
            pathname === "/explore"
              ? "underline text-black underline-offset-4"
              : "",
          )}
        >
          Explore
        </span>
      </Link>
      <Link
        className="font-semibold text-sm underline-offset-4 hover:underline"
        href={"/dashboard"}
      >
        <span
          className={cn(
            "text-gray-500 hidden sm:flex",
            pathname === "/dashboard"
              ? "underline text-black underline-offset-4"
              : "",
          )}
        >
          Dashboard
        </span>
      </Link>
      <Link
        className="font-semibold text-sm underline-offset-4 hover:underline"
        href={"/roadmap"}
      >
        <span
          className={cn(
            "text-gray-500 hidden sm:flex",
            pathname === "/roadmap"
              ? "underline text-black underline-offset-4"
              : "",
          )}
        >
          Roadmap
        </span>
      </Link>
    </div>
  );
}
