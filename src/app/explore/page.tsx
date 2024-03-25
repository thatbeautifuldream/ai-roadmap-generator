import Search from "@/components/flow-components/Search";

const explore = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-4">
          <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
            Explore Roadmaps
          </h2>
          <Search />
        </div>
      </div>
    </div>
  );
};

export default explore;
