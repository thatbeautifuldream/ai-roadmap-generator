import { Button } from "@/components/ui/button";
import { auth, signIn, signOut } from "auth";
import Link from "next/link";

async function AppBar() {
  const session = await auth();
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="p-2 flex gap-2 items-center">
        <div className="relative">
          <Link
            className="hidden sm:inline text-lg font-semibold mr-4"
            href="/"
          >
            RoadmapAI
          </Link>
          <span className="hidden sm:inline top-[22px] absolute left-[72px] items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
            BETA
          </span>
        </div>
        {session && session.user && (
          <>
            <Link className="font-semibold text-sm" href={"/dashboard"}>
              Dashboard
            </Link>
            <Link className="font-semibold text-sm" href={"/roadmap"}>
              Roadmap
            </Link>
          </>
        )}
        <div className="ml-auto">
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
            <form
              action={async () => {
                "use server";
                await signIn();
              }}
            >
              <Button type="submit">Login</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppBar;
