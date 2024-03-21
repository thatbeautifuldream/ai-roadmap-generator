import { getRoadmapById } from "@/actions/roadmaps";
import { Flow } from "@/app/flow-components/Flow";

type PageProps = {
  params: { id: string };
  searchParams: {};
};

const generatorById = async (props: PageProps) => {
  const {
    params: { id: roadmapId },
  } = props;
  const roadmap = await getRoadmapById(roadmapId);
  if (!roadmap) return <>Error Component</>;
  return (
    <>
      <Flow roadmapId={roadmapId} />
    </>
  );
};

export default generatorById;
