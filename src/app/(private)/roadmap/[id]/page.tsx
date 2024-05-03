import { getRoadmapById, increaseViewsByRoadmapId } from "@/actions/roadmaps";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { Flow } from "@/components/flow-components/Flow";

type PageProps = {
  params: { id: string };
  searchParams: {};
};

const generatorById = async (props: PageProps) => {
  const {
    params: { id: roadmapId },
  } = props;
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
