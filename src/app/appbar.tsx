import NavItems from "@/app/nav-items";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SignInButton, UserButton, currentUser } from "@clerk/nextjs";
import { Coins } from "lucide-react";
import Link from "next/link";
import { Icons } from "./shared/Icons";

import { getUserCredits } from "@/actions/users";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

async function AppBar() {
  const user = await currentUser();
  const userCredits = await getUserCredits();

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-2 flex gap-2 items-center">
          <Link href="/">
            <Icons.roadmapai className="h-[40px] w-[120px]" />
          </Link>
          <div className="ml-auto flex items-center">
            <div className={buttonVariants({})}>
              <SignInButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="p-2 flex gap-2 items-center">
        <Link href="/">
          <Icons.roadmapai className="h-[40px] w-[120px]" />
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
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppBar;
