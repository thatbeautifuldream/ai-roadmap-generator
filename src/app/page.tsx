"use client";
import React, { useState } from "react";
import ExpandCollapse from "./components/ExpandCollapse";
import axios from "axios";

type Props = {};

const Page = (props: Props) => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [rerender, setRerender] = useState(false);
  const onSubmit = async () => {
    try {
      const { data } = await axios.post("/api/roadmap", { query });

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
      <input
        className="mx-auto w-[400px] shadow-md px-4 py-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="button" onClick={onSubmit}>
        Submit
      </button>
      {data.length !== 0 ? (
        <ExpandCollapse key={data[0].name} data={data} />
      ) : null}
    </>
  );
};

export default Page;

function capitalize(str: string) {
  if (str && typeof str === "string") {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  return "";
}
