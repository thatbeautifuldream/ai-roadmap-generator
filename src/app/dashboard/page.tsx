import { deleteRoadmapById, getRoadmapsByUserId } from "@/actions/roadmaps";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Trash } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const roadmaps = await getRoadmapsByUserId();
  return (
    <div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-6xl font-medium mt-6 text-center">
          Your Roadmaps
        </h1>

        <div className="grid grid-cols-2 gap-4">
          {roadmaps.map((roadmap: any) => (
            <Link key={roadmap.id} href={`/generate/${roadmap.id}`}>
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
                    <span className="text-sm text-gray-400">
                      {moment(roadmap.createdAt).startOf("hour").fromNow()}
                    </span>
                    <img
                      className="inline-block h-6 w-6 rounded-full"
                      src="https://lh3.googleusercontent.com/a/ACg8ocLNkTBbLQLLrZMz3vdKW8x37P1usXna6T5SYvhYCgS_iiSP=s96-c"
                      alt=""
                    />
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
