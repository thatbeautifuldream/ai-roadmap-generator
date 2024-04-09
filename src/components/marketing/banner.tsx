"use client";

import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { usePathname } from "next/navigation";

function PeerlistBanner() {
  return (
    <div className="flex items-center gap-x-6 bg-green-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <p className="text-sm leading-6 text-white">
        <Link
          href="https://peerlist.io/milind/project/ai-roadmap-generator"
          target="_blank"
        >
          <strong className="font-semibold">Peerlist Spotlight</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-0.5 w-0.5 fill-current"
            aria-hidden="true"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          Help us win{" "}
          <span className="font-semibold">
            WEEK 15<span aria-hidden="true">&rarr;</span>
          </span>
        </Link>
      </p>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon className="h-5 w-5 text-white hidden" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function Banner() {
  const pathname = usePathname();
  if (pathname !== "/") {
    return null;
  }
  return <PeerlistBanner />;
}
