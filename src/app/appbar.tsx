import { auth, signIn, signOut } from "auth";
import Link from "next/link";

async function AppBar() {
  const session = await auth();
  return (
    <div className="p-2 flex gap-2 items-center">
      <Link className="text-black font-semibold ml-2" href="/">
        RoadmapAI
      </Link>
      {/* Move the two links to the left */}
      {session && session.user && (
        <>
          <Link className="font-semibold text-sm" href={"/roadmap"}>
            Roadmap
          </Link>
          <Link className="font-semibold text-sm" href={"/dashboard"}>
            Dashboard
          </Link>
        </>
      )}
      <div className="ml-auto">
        {session && session.user ? (
          <div className="flex gap-2 items-center">
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
