import Link from "next/link";
import NavItems from "@/app/nav-items";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Coins, LogOut } from "lucide-react";
import { Icons } from "./shared/Icons";
import { SignOutButton, currentUser } from "@clerk/nextjs";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserCredits } from "@/actions/users";

async function AppBar() {
  const user = await currentUser();
  const userCredits = await getUserCredits();

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-2 flex gap-2 items-center">
          <Link href="/">
            <Icons.roadmapai className="h-[50px] w-[150px]" />
          </Link>
          <div className="ml-auto flex items-center">
            <Link href="/dashboard" className={buttonVariants()}>
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="p-2 flex gap-2 items-center">
        <Link href="/">
          <Icons.roadmapai className="h-[50px] w-[150px]" />
        </Link>
        <NavItems />
        <div className="ml-auto flex items-center">
          <div className="flex gap-2 items-center">
            <div className="hidden sm:flex gap-2">
              <TooltipProvider>
                <Tooltip delayDuration={250}>
                  <TooltipTrigger asChild>
                    <Badge
                      className="cursor-default"
                      variant={
                        userCredits && userCredits > 0
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {userCredits} <Coins size={16} />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Credits Remaining</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="font-semibold text-sm md:ml-1">
                {`${user?.firstName} ${user?.lastName}`}
              </p>
            </div>
            <SignOutButton>
              <Button variant="link" size="icon" type="submit">
                <TooltipProvider>
                  <Tooltip delayDuration={250}>
                    <TooltipTrigger asChild>
                      <LogOut size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Logout</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppBar;
