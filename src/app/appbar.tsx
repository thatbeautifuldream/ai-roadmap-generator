import NavItems from "@/app/nav-items";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth, signOut } from "auth";
import { Coins, LogOut } from "lucide-react";
import Link from "next/link";
import { Icons } from "./shared/Icons";

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
                <Badge
                  variant={
                    Math.abs(5 - user?.credits) > 0 ? "outline" : "destructive"
                  }
                >
                  {Math.abs(5 - user?.credits)} <Coins size={16} />
                </Badge>
                <p className="font-semibold text-sm">{session.user.name}</p>
              </div>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant="link" type="submit">
                  <LogOut size={16} />
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
