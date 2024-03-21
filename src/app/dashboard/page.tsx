import { getRoadmapsByUserId } from "@/actions/roadmaps";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Dashboard() {
  const roadmaps = await getRoadmapsByUserId();
  console.log({ roadmaps });
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {roadmaps.map((roadmap: any) => (
            <Card className="w-full" key={roadmap.id}>
              <CardHeader>
                <CardTitle>{roadmap.title}</CardTitle>
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
          ))}
        </div>
      </div>
    </div>
  );
}
