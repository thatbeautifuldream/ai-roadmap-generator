import React, { useEffect, useState } from "react";
import ReactFlow, {
  Position,
  ReactFlowProvider,
  useReactFlow,
  MiniMap,
  Background,
  Node,
  Controls,
} from "react-flow-renderer";
import { HierarchyNode, hierarchy, tree } from "d3-hierarchy";
import { scaleLinear } from "d3-scale";
import useAnimatedNodes from "../../hooks/use-animated-nodes";
import { Drawer } from "./drawer";
import { useShallow } from "zustand/react/shallow";
import { useUIStore } from "../stores/useUI";

const colorScale = scaleLinear()
  .domain([0, 5])
  .range(["#ff0072" as any, "#0041d0"]);
const proOptions = { account: "paid-pro", hideAttribution: true };

const nodeColor = (node: Node) => colorScale(node.data.depth);

type ProProps = {
  animationDuration?: number;
  data: _Node[];
  h: HierarchyNode<unknown>;
};
const layout = tree().nodeSize([70, 200]);
// const layout = tree().nodeSize([200, 70]);

function getElements(h: HierarchyNode<unknown>) {
  const root = layout(h);

  const nodes = root.descendants().map((d: any, i) => ({
    id: d.id,
    data: { label: d.data.name, depth: d.depth },
    // position: { x: d.x, y: d.y },
    position: { x: d.y, y: d.x },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    // sourcePosition: Position.Bottom,
    // targetPosition: Position.Top,
    type: i === 0 ? "input" : d._children ? "default" : "output",
  }));

  const edges = root.links().map((d, i) => ({
    id: `${i}`,
    source: d.source.id || "",
    target: d.target.id || "",
  }));

  return { nodes, edges };
}

function ReactFlowPro({ animationDuration = 200, data, h }: ProProps) {
  const initialElements = getElements(h);
  const [nodes, setNodes] = useAnimatedNodes(initialElements.nodes, {
    duration: animationDuration,
  });
  const [edges, setEdges] = useState(initialElements.edges);
  const { fitView } = useReactFlow();
  const { toggleDrawer } = useUIStore(
    useShallow((state) => ({
      // drawerOpen: state.drawerOpen,
      toggleDrawer: state.toggleDrawer,
    }))
  );
  const handleNodeClick = (_: any, node: Node) => {
    const c: any = h.find((n) => {
      return n.id === node.id;
    });

    if (!c) return;
    if (!c._children) {
    }

    const isExpanded = !!c.children;
    c.children = isExpanded ? null : c._children;
    if (!c._children) {
      toggleDrawer();
    }
    const nextElements = getElements(h);

    setNodes(nextElements.nodes);
    setEdges(nextElements.edges);
  };

  useEffect(() => {
    fitView({ duration: animationDuration });
  }, [nodes, fitView, animationDuration]);

  return (
    <ReactFlow
      minZoom={-Infinity}
      fitView
      nodes={nodes}
      edges={edges}
      onNodeClick={handleNodeClick}
      elementsSelectable={false}
      proOptions={proOptions}
    >
      <Controls />
    </ReactFlow>
  );
}

type Props = {
  data: _Node[];
};

type _Node = { name: string; children?: _Node[] };

function ExpandCollapse(props: Props) {
  const { data } = props;

  const h: HierarchyNode<unknown> = hierarchy<unknown>(data[0]);
  h.descendants().forEach((d: any, i: number) => {
    d.id = `${i}`;
    d._children = d.children;
    d.children = null;
  });

  return (
    <div className="w-full h-[85vh]">
      <ReactFlowProvider>
        <Drawer />

        <ReactFlowPro {...props} h={h} data={data} />
      </ReactFlowProvider>
    </div>
  );
}

export default ExpandCollapse;
