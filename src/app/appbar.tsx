import NavItems from "@/app/nav-items";
import { Button, buttonVariants } from "@/components/ui/button";
import { auth, signOut } from "auth";
import Link from "next/link";
import { Icons } from "./shared/Icons";

async function AppBar() {
  const session = await auth();
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="p-2 flex gap-2 items-center">
        <Link href="/">
          <Icons.roadmapai className="h-[50px] w-[150px]" />
        </Link>
        {session && session.user && <NavItems />}
        <div className="ml-auto flex items-center">
          {session && session.user ? (
            <div className="flex gap-4 items-center">
              <div className="hidden sm:flex">
                <p className="font-semibold text-sm">{session.user.name}</p>
              </div>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant="destructive" type="submit">
                  Logout
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
