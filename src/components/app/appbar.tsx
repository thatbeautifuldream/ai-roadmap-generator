import NavItems from "@/components/app/nav-items";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Coins } from "lucide-react";
import { Link } from "next-view-transitions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MobileDrawer from "@/components/app/mobile-drawer";
import NeobrutalismButton from "@/components/ui/neobrutalism-button";
import ThreeDButton from "../ui/three-d-button";
import { getCaller } from "@/trpc/server";

async function AppBar() {
  const user = await currentUser();
  let userCredits: number | undefined = 0;
  
  if (user) {
    const caller = await getCaller();
    userCredits = await caller.user.getCredits();
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-2 flex gap-2 items-center">
          <Link href="/">
            <NeobrutalismButton>
              <span className="font-bold text-lg">RoadmapAI</span>
            </NeobrutalismButton>
          </Link>
          <div className="ml-auto items-center">
            <NeobrutalismButton>
              <SignInButton />
            </NeobrutalismButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="p-2 flex gap-2 items-center">
        <span className="md:hidden ml-2">
          <MobileDrawer />
        </span>
        <Link href="/">
          <NeobrutalismButton>
            <span className="font-semibold text-lg">RoadmapAI</span>
          </NeobrutalismButton>
        </Link>
        <NavItems />
        <div className="ml-auto flex items-center">
          <div className="flex gap-2 items-center">
            <div className="gap-2">
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
                  <TooltipContent>Credits Remaining</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <span>
          <UserButton />
        </span>
      </div>
    </div>
  );
}

export default AppBar;
