"use client";
import axios, { all } from "axios";
import { useEffect, useState } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState({
    "Introduction to Node.js": [
      "What is Node.js?",
      "Advantages of Node.js",
      "Setting up Node.js environment",
    ],
    "Node.js Basics": [
      "Working with npm (Node Package Manager)",
      "Basic modules and their usage",
      "Asynchronous programming with callbacks",
    ],
    "Node.js Advanced Concepts": [
      "Event loop and event emitters",
      "Streams and buffers",
      "Error handling and debugging",
    ],
    "Node.js Frameworks": [
      "Express.js framework",
      "Sails.js framework",
      "Koa.js framework",
    ],
    "Database Integration with Node.js": [
      "Connecting to databases",
      "CRUD operations with databases",
      "ORM (Object-Relational Mapping) libraries",
    ],
    "Testing and Debugging in Node.js": [
      "Unit testing with Mocha and Chai",
      "Debugging with Node.js inspector",
      "Performance optimization",
    ],
    "Building RESTful APIs with Node.js": [
      "Understanding REST architecture",
      "Express.js routing for APIs",
      "Authentication and security",
    ],
    "Real-time Applications with Node.js": [
      "Socket.io for real-time communication",
      "Building chat applications",
      "Scalability and load balancing",
    ],
    "Deployment and DevOps for Node.js": [
      "Deploying Node.js applications",
      "Containerization with Docker",
      "DevOps best practices",
    ],
  });
  const initialNodes = Object.entries(data).map(([key, value], i) => ({
    id: String(i),
    position: { x: 0, y: 0 + i * 100 },
    data: { label: key },
  }));

  const moduleNodes = Object.entries(data)
    .map(([key, value], i) => {
      const res = value.map((val, j) => ({
        id: String(`${i}-${j}`),
        position: { x: j % 2 === 0 ? -400 : 400, y: 0 + i * 100 },
        data: { label: val },
      }));
      return res;
    })
    .flat();
  // console.log(moduleNodes);
  // initialNodes.concat(moduleNodes)

  let initialEdges = initialNodes.map((node, i) => ({
    id: `e${i}-${i + 1}`,
    source: String(i),
    target: String(i + 1),
  }));

  initialEdges.pop();
  const allNodes = initialNodes.concat(moduleNodes);

  const onSubmit = async () => {
    try {
      const { data } = await axios.post("/api/roadmap", { query });
      setData(data.text.chapters);
    } catch (e) {}
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
      <div style={{ width: "100vw", height: "90vh" }}>
        {/* <ReactFlow nodes={initialNodes} fitView /> */}
        <ReactFlow
          nodes={allNodes}
          // nodes={initialNodes}
          edges={initialEdges}
          fitView
          fitViewOptions={{ minZoom: 1 }}
        />
      </div>
    </>
  );
}
