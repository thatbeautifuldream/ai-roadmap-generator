import { getRoadmapsByUserId } from "@/actions/roadmaps";

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
                  <span className="text-sm text-gray-400">2m ago</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
