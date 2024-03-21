import { auth, signIn, signOut } from "auth";
import Link from "next/link";

async function AppBar() {
  const session = await auth();
  return (
    <div className="p-2 flex gap-2 items-center">
      {/* Move the two links to the left */}
      {session && session.user && (
        <div className="flex gap-4 ml-6">
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
          <Link className="font-semibold text-sm" href={"/dashboard"}>
            Dashboard
          </Link>
        </div>
      )}
      <div className="ml-auto">
        {session && session.user ? (
          <div className="flex gap-8 items-center mr-12">
            <p className="font-semibold text-sm">{session.user.name}</p>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                className="rounded-md bg-black/10 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-black/20"
                type="submit"
              >
                Logout
              </button>
            </form>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn();
            }}
          >
            <button
              className="rounded-md bg-black/10 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-black/20"
              type="submit"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AppBar;
