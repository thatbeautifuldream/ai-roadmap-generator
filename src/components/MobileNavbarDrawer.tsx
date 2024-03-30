import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

const MobileNavbarDrawer = async () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="mr-2 h-6 w-6" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className=" h-full flex flex-col items-center justify-center gap-4"
      >
        <Link href="/explore">Explore</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/roadmap">Roadmap</Link>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbarDrawer;
