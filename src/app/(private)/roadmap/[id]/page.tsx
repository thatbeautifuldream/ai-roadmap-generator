import { getRoadmapById, increaseViewsByRoadmapId } from "@/actions/roadmaps";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { Flow } from "@/components/flow-components/Flow";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const generatorById = async (props: PageProps) => {
  const { id: roadmapId } = await props.params;
  const roadmap = await getRoadmapById(roadmapId);
  await increaseViewsByRoadmapId(roadmapId);

  if (!roadmap) return <ErrorAlert />;
  return (
    <>
      <Flow roadmapId={roadmapId} />
    </>
  );
};

export default generatorById;
