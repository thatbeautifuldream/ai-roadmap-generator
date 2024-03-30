import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { SheetClose } from "./ui/sheet";

const MobileNavbarDrawer = () => {
  const handleCloseSidebar = () => {
    // Close the sidebar here
    console.log("Closing sidebar...");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="mr-2 h-6 w-6" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className=" h-full flex flex-col items-center justify-center gap-4"
      >
        <SheetClose onClick={handleCloseSidebar}>
          <Link href="/explore">Explore</Link>
        </SheetClose>
        <SheetClose onClick={handleCloseSidebar}>
          <Link href="/dashboard">Dashboard</Link>
        </SheetClose>
        <SheetClose onClick={handleCloseSidebar}>
          <Link href="/roadmap">Roadmap</Link>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbarDrawer;
