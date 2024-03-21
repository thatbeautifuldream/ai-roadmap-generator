import { getRoadmapById } from "@/actions/roadmaps";

type PageProps = {
  params: { id: string };
  searchParams: {};
};

const generatorById = async (props: PageProps) => {
  const {
    params: { id },
  } = props;
  const roadmap = await getRoadmapById(id);
  if (!roadmap) return <>Error Component</>;
  return (
    <>
      <p>{roadmap.title}</p>
    </>
  );
};

export default generatorById;
