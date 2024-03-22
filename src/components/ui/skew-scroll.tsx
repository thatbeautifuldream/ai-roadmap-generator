const SkewedInfiniteScroll = () => {
  const items = [
    { id: "1", text: "Item" },
    { id: "2", text: "Another Item" },
    { id: "3", text: "Yet Another Item" },
    { id: "4", text: "Yet Another Item" },
    { id: "5", text: "Yet Another Item" },
    { id: "6", text: "Yet Another Item" },
    {
      id: "7",
      text: "Yet Another Item",
    },
    {
      id: "8",
      text: "Yet Another Item",
    },
  ];
  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-screen-lg overflow-hidden">
          <div className="pointer-events-none absolute -top-1 z-10 h-20 w-full bg-gradient-to-b from-white"></div>
          <div className="pointer-events-none absolute -bottom-1 z-10 h-20 w-full bg-gradient-to-t from-white"></div>
          <div className="pointer-events-none absolute -left-1 z-10 h-full w-20 bg-gradient-to-r from-white"></div>
          <div className="pointer-events-none absolute -right-1 z-10 h-full w-20 bg-gradient-to-l from-white"></div>

          <div className="animate-skew-scroll mx-auto grid h-[250px] w-[400px] grid-cols-1 gap-5 sm:w-[800px] sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex cursor-pointer items-center space-x-2 rounded-md border border-gray-100 px-5 shadow-md transition-all hover:-translate-y-1 hover:translate-x-1 hover:scale-[1.025] hover:shadow-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 flex-none text-cyan-500"
                >
                  <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkewedInfiniteScroll;
