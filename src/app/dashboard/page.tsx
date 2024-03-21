import { getRoadmapsByUserId } from "@/actions/roadmaps";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { timeFromNow } from "@/lib/utils";
import Link from "next/link";

export default async function Dashboard() {
  const roadmaps = await getRoadmapsByUserId();
  const session = await auth();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
        Your Roadmaps
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roadmaps.map((roadmap: any) => (
          <Link key={roadmap.id} href={`/roadmap/${roadmap.id}`}>
            <Card className="w-full">
              <CardHeader>
                <div className="h-10 overflow-hidden">
                  <CardTitle>{roadmap.title}</CardTitle>
                </div>
                {/* TODO: move this into a different component and convert that to a client component */}
                {/* <Trash
                onClick={async () => {
                  await deleteRoadmapById(roadmap.id);
                }}
              /> */}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs">1 views</span>
                  <span className="text-xs">
                    {timeFromNow(roadmap.createdAt)}
                  </span>
                  {/* <span className="text-gray-400 border-gray-200 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                    {session?.user?.name?.[0]?.toUpperCase() ?? ""}
                  </span> */}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
