import { getRoadmapsByUserId } from "@/actions/roadmaps";

const dashboard = async () => {
  const roadmaps = await getRoadmapsByUserId();

  return (
    <div>
      {roadmaps?.map((roadmap) => (
        <div key={roadmap.id}>{roadmap.title}</div>
      ))}
    </div>
  );
};

export default dashboard;
