import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { Flow } from "@/components/flow-components/Flow";
import { getCaller } from "@/trpc/server";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const generatorById = async (props: PageProps) => {
  const { id: roadmapId } = await props.params;
  const caller = await getCaller();
  const roadmap = await caller.roadmap.getById({ id: roadmapId });
  await caller.roadmap.incrementViews({ id: roadmapId });

  if (!roadmap) return <ErrorAlert />;
  return (
    <>
      <Flow roadmapId={roadmapId} />
    </>
  );
};

export default generatorById;
