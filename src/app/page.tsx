"use client";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const onSubmit = async () => {
    try {
      const data = await axios.post("/api/roadmap", { query });
      console.log(data);
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
    </>
  );
}
