import { getRoadmapsByUserId } from "@/actions/roadmaps";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Trash } from "lucide-react";
import { timeFromNow } from "@/lib/utils";
import Link from "next/link";

export default async function Dashboard() {
  const roadmaps = await getRoadmapsByUserId();
  const session = await auth();

  return (
    <div>
      <div className="flex flex-col gap-4">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Your Roadmaps
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {roadmaps.map((roadmap: any) => (
            <Link key={roadmap.id} href={`/roadmap/${roadmap.id}`}>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>{roadmap.title}</CardTitle>
                  {/*
                TODO: move this into a different component and convert that to a client component
                <Trash
                  onClick={async () => {
                    await deleteRoadmapById(roadmap.id);
                  }}
                /> */}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">1 views</span>
                    <Badge variant="outline">
                      {timeFromNow(roadmap.createdAt)}
                    </Badge>
                    <span className="text-gray-400 border-gray-200 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                      {session?.user?.name?.[0]?.toUpperCase() ?? ""}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
