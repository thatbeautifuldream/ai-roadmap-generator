"use client";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useHasMounted } from "@/hooks/use-has-mounted";

function PeerlistBanner() {
  const hasMounted = useHasMounted();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const value = localStorage.getItem("banner_is_hidden");
    setIsHidden(value === "true");
  }, []);

  const handleDismiss = () => {
    setIsHidden(true);
    localStorage.setItem("banner_is_hidden", "true");
  };

  if (!hasMounted || isHidden) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-6 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 bg-gradient-to-r from-[#ffd700] via-[#daa520] to-[#ffd700]">
      <p className="text-sm leading-6 text-white">
        <Link
          href="https://peerlist.io/milind/project/ai-roadmap-generator"
          target="_blank"
        >
          <strong className="font-bold">
            WE WON THE PEERLIST SPOTLIGHT AWARD 🏆 THANK YOU!
          </strong>
        </Link>
      </p>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          onClick={handleDismiss}
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
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
