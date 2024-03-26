import NavItems from "@/app/nav-items";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth, signOut } from "auth";
import { Coins, LogOut } from "lucide-react";
import Link from "next/link";
import { Icons } from "./shared/Icons";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

async function AppBar() {
  const session = await auth();
  const userId = session?.user?.id;
  let user: any = {};
  if (session) {
    user = await db.user.findUnique({
      where: { id: userId },
    });
  }
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="p-2 flex gap-2 items-center">
        <Link href="/">
          <Icons.roadmapai className="h-[50px] w-[150px]" />
        </Link>
        {session && session.user && <NavItems />}
        <div className="ml-auto flex items-center">
          {session && session.user ? (
            <div className="flex gap-2 items-center">
              <div className="hidden sm:flex gap-2">
                <TooltipProvider>
                  <Tooltip delayDuration={250}>
                    <TooltipTrigger asChild>
                      <Badge
                        className="cursor-default"
                        variant={user?.credits > 0 ? "outline" : "destructive"}
                      >
                        {user?.credits} <Coins size={16} />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Credits Remaining</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="font-semibold text-sm md:ml-1">{session.user.name}</p>
              </div>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant="link" size="icon" type="submit">
                  <TooltipProvider>
                    <Tooltip delayDuration={250}>
                      <TooltipTrigger asChild>
                        <LogOut className="text-red-600 h-5 w-5" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Logout</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/auth/login" className={buttonVariants()}>
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppBar;
