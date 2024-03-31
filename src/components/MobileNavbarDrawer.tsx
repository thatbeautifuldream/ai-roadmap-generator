"use client";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

const MobileNavbarDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSheet = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Sheet open={isOpen}>
      <SheetTrigger onClick={toggleSheet}>
        <Menu className="mr-2 h-6 w-6" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className=" h-full flex flex-col items-center justify-center gap-4"
      >
        <Link onClick={toggleSheet} href="/explore">
          Explore
        </Link>
        <Link onClick={toggleSheet} href="/dashboard">
          Dashboard
        </Link>
        <Link onClick={toggleSheet} href="/roadmap">
          Roadmap
        </Link>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbarDrawer;
