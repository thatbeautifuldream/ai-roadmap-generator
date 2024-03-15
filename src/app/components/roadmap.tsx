"use client";
import React, { useState } from "react";
import ExpandCollapse from "./ExpandCollapse";
import axios from "axios";

type Props = {};

const Roadmap = (props: Props) => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [rerender, setRerender] = useState(false);
  const onSubmit = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/cohere/roadmap/", { query });
      const tree = [
        {
          name: capitalize(query),
          children: Object.keys(data.text.chapters).map((sectionName) => ({
            name: sectionName,
            children: data.text.chapters[sectionName].map((topic: string) => ({
              name: topic,
            })),
          })),
        },
      ];
      // setRerender()
      setData(tree);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 w-full rounded-xl bg-green-100 px-4 py-3 text-green-800">
            <h2 className="flex items-center text-base font-semibold text-green-800 sm:text-lg">
              AI Generated Roadmap{" "}
              <span className="ml-1.5 rounded-md border border-green-500 bg-green-200 px-1.5 text-xs uppercase tracking-wide text-green-800">
                Beta
              </span>
            </h2>
            <p className="mb-2 mt-1">
              This is an AI generated roadmap and is not verified by us. We are
              currently in beta and working hard to improve the quality of the
              generated roadmaps.
            </p>
          </div>
          <form className="my-3 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
            <input
              type="text"
              placeholder="e.g. Try searching for Frontend or Backend"
              className="flex-grow rounded-md border border-gray-400 px-3 py-2 transition-colors focus:border-black focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="flex min-w-[127px] flex-shrink-0 items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onSubmit}
            >
              Submit
            </button>
          </form>
          {/* <input
            className="mx-auto w-[400px] shadow-md px-4 py-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" onClick={onSubmit}>
            Submit
          </button> */}
        </div>
      </div>
      {data.length !== 0 ? (
        <ExpandCollapse key={data[0].name} data={data} />
      ) : null}
    </>
  );
};

export default Roadmap;

function capitalize(str: string) {
  if (str && typeof str === "string") {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  return "";
}
