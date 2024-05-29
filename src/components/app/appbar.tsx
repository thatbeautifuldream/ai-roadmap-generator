import NavItems from "@/components/app/nav-items";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SignInButton, UserButton, currentUser } from "@clerk/nextjs";
import { Coins } from "lucide-react";
import { Link } from "next-view-transitions";

import { getUserCredits } from "@/actions/users";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MobileDrawer from "@/components/app/mobile-drawer";
import NeobrutalismButton from "@/components/ui/neobrutalism-button";
import ThreeDButton from "../ui/three-d-button";

async function AppBar() {
  const user = await currentUser();
  const userCredits = await getUserCredits();

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
          <UserButton afterSignOutUrl="/" />
        </span>
      </div>
    </div>
  );
}

export default AppBar;
